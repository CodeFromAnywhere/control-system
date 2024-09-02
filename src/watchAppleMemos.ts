import { compressConvert } from "ffmpeg-util";
import * as path from "path";
import * as fs from "fs";
import { getProjectRoot } from "from-anywhere/node";
import { platform } from "os";
import { StandardFunctionConfig } from "from-anywhere/types";
import { WatchContext } from "from-anywhere/types";
import { WatchFunctionConfig } from "from-anywhere/types";
import { movedFileSubextension } from "from-anywhere";
/**
 
Watch `/Application Support/com.apple.voicememos/Recordings` and move them to /memory/recordings immediately. on success, add a file. `[recording-name].m4a.moved`

When restarting the server, find all m4a's there that don't have this file. Transcribe those too with whisper.

*/
export const watchAppleMemos = async (context: WatchContext) => {
  const { absolutePath, isStartup, me_personSlug } = context;
  if (!fs.existsSync(absolutePath)) {
    return;
  }
  const projectRoot = getProjectRoot();
  if (!projectRoot) return;
  const screenPath = path.join(projectRoot, "memory", "recordings");

  const stats = await fs.stat(absolutePath);
  const createdAt = stats.ctimeMs;

  // if (isStartup) {
  //   return;
  // }

  // first put the wav there
  const resultingAudioPath = await compressConvert(absolutePath, {
    targetFormat: "wav",
    is16bitWav: true,
    keepOriginal: true,
    outputFolderPath: screenPath,
    name: String(createdAt),
  });

  if (!resultingAudioPath) {
    return;
  }

  const movedMarkPath = `${absolutePath}.${movedFileSubextension}`;
  await fs.writeFile(movedMarkPath, String(Date.now()), "utf8");
};

watchAppleMemos.config = {
  isWatchFunction: true,

  watchFilter: (eventName, absolutePath) => {
    if (platform() !== "darwin") {
      // macOS
      return false;
    }

    // only the change event marks the alteration and with that finalisation (hopefully) of the m4a buffer
    // NB: doens't work! on startup,it's "add"
    // if (eventName !== "change") {
    //   return false;
    // }

    const userPath = process.env.HOME; // how to do this?
    const absoluteRecordingsPath = userPath
      ? path.resolve(
          userPath,
          "Library/Application Support/com.apple.voicememos/Recordings",
        )
      : undefined;

    // NB: In order to resolve it to an absolute path, I think this might work.
    if (
      !absoluteRecordingsPath ||
      !absolutePath.startsWith(absoluteRecordingsPath)
    ) {
      return false;
    }

    // something got added to the MacOS recordings folder
    if (path.parse(absolutePath).ext !== ".m4a") {
      return false;
    }
    // it's m4a!

    const movedMarkPath = `${absolutePath}.${movedFileSubextension}`;

    if (fs.existsSync(movedMarkPath)) {
      return false;
    }
    // it hasn't been transcribed before
    return true;
  },
  watchStartupStrategy: "queue",
} satisfies StandardFunctionConfig & WatchFunctionConfig;
