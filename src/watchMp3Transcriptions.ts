import { WatchContext } from "from-anywhere/types";
import { WatchFunctionConfig } from "from-anywhere/types";
import { StandardFunctionConfig } from "from-anywhere/types";
import { getProjectRoot } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { fs } from "from-anywhere/node";
import { writeJsonToFile } from "from-anywhere/node";
import { textToText } from "ai-models";
import { oneByOne } from "from-anywhere";
import { isLocked } from "from-anywhere/node";
import { lock } from "from-anywhere/node";
import { lockError } from "from-anywhere/node";
import { unlock } from "from-anywhere/node";
import { transcriptionToGptChunks } from "ai-chunking";
import { notEmpty } from "from-anywhere";
import { Transcription } from "ai-types";
import { readJsonFile } from "read-json-file";
import { getUpdatedTimeObject } from "from-anywhere/types";
import { CHUNK_TOKEN_SIZE } from "./getRecordingType.js";
import { getRecordingType } from "./getRecordingType.js";
/**
Add an automation (watcher that queues or does) to act on any `.mp3.txt` (which indicates a whisper is done) that doesn't have a `.clean.md`

There are many other things we can do with the spoken text transcription of an audio file, but these will be applied on any md file (which is much more general purpose)

Promises the path of the resulting converted cleaned-up file
*/
export const watchMp3Transcriptions = async (
  context: WatchContext,
): Promise<string | undefined> => {
  const { absolutePath } = context;

  if (!fs.existsSync(absolutePath)) {
    console.log(`${absolutePath} doesn't exist`);
    return;
  }

  const oldTranscription = await readJsonFile<Transcription>(absolutePath);
  if (!oldTranscription) {
    return;
  }
  if (isLocked(absolutePath)) {
    console.log(`${absolutePath} locked`);

    return;
  }
  const chunks = await transcriptionToGptChunks(absolutePath, CHUNK_TOKEN_SIZE);

  if (!chunks || chunks.length === 0) {
    console.log(`${absolutePath} no chunks`);
    return;
  }

  await lock(absolutePath, "busy", "watchMp3Transcriptions", [
    undefined,
    absolutePath,
  ]);
  // turn speech into clean text
  const finalCleanedupResultString = (
    await oneByOne(chunks, async (chunk, index) => {
      await lock(
        absolutePath,
        `chunk ${index + 1}/${chunks.length}`,
        "watchMp3Transcriptions",
        [undefined, absolutePath],
      );

      const result = await textToText({
        text: `Consider this transcription and please make it cleaner (remove speaking errors and transform it into alineas)

        \`\`\`
        ${chunk}
        \`\`\`
        `,
      });
      return result.chatResponse;
    })
  )
    .filter(notEmpty)
    .join("\n\n");

  const parsedPath = path.parse(absolutePath);
  const totalExtension = ".transcription.json";
  const baseName = parsedPath.base.slice(
    0,
    parsedPath.base.length - totalExtension.length,
  );
  const cleanFilePath = path.join(parsedPath.dir, `${baseName}.md`);

  if (finalCleanedupResultString === "") {
    console.log("No result transcribing", finalCleanedupResultString);
    await lockError(
      absolutePath,
      "No result transcribing",
      undefined,
      "watchMp3Transcriptions",
      [undefined, absolutePath],
    );
    return;
  }

  const recordingType = await getRecordingType(absolutePath);

  const newTranscription: Transcription = {
    ...oldTranscription,
    ...getUpdatedTimeObject(),
    recordingType,
  };

  await writeJsonToFile(absolutePath, newTranscription);
  // TODO: just put this in .transcription.json file
  const fullMd = `---
isSource: false
source: ./${path.parse(absolutePath).base}
createdAt: ${Date.now()}
---

${finalCleanedupResultString}`;

  await fs.writeFile(cleanFilePath, fullMd, "utf8");

  await unlock(absolutePath);
  return cleanFilePath;
};

watchMp3Transcriptions.config = {
  isInternetRequired: true,
  isHeavy: false,
  watchStartupStrategy: "queue",
  isWatchFunction: true,

  /**
  filter to check if its an .transcription.json file, added into the project, without a .md tied to it

  NB: no /assets/ files for now
  */
  watchFilter: (eventName, absolutePath) => {
    if (eventName !== "add") {
      return false;
    }
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
      return false;
    }
    if (!absolutePath.startsWith(projectRoot)) {
      return false;
    }

    const parsedPath = path.parse(absolutePath);
    const totalExtension = ".transcription.json";
    if (!parsedPath.base.endsWith(totalExtension)) {
      return false;
    }

    const baseName = parsedPath.name.slice(
      0,
      parsedPath.base.length - totalExtension.length,
    );

    const potentialCleanFilePath = path.join(parsedPath.dir, `${baseName}.md`);

    if (absolutePath.includes("/assets/")) {
      // console.log("not doing assets for now");
      return false;
    }

    if (fs.existsSync(potentialCleanFilePath)) {
      // already converted into a .md
      return false;
    }

    if (isLocked(absolutePath)) {
      return false;
    }

    // its an .transcription.json file, added into the project, without a .md tied to it
    return true;
  },
} satisfies StandardFunctionConfig & WatchFunctionConfig;
