import { WatchContext } from "from-anywhere/types";
import { WatchFunctionConfig } from "from-anywhere/types";
import { StandardFunctionConfig } from "from-anywhere/types";
import { fs } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { getSubExtensions } from "from-anywhere/node";
import { temporaryConvertedSubextension } from "from-anywhere";
import { isLocked } from "from-anywhere/node";
import { getPersona } from "person-util";
import { speechToText } from "ai-models";
/**
Watch wav files anywhere. Every wav file that doesn't have a `.txt` file existing under the same name should be whispered. This way it's integrated on many more pipelines than just recording (also import, for example)

Besides using whisper, speaker separation can be applied as well
*/
export const watchWavToSpeech = async (context: WatchContext) => {
  const { absolutePath } = context;
  const persona = await getPersona();
  if (!persona) {
    return false;
  }
  if (isLocked(absolutePath)) {
    console.log("mmm locked", absolutePath);
    return false;
  }
  if (!fs.existsSync(absolutePath)) {
    console.log("mmm doesn't exist", absolutePath);
    return { isSuccessful: false, message: "File doesn't exist (anymore)" };
  }
  const result = await speechToText({
    audioUri: absolutePath,
    model: "whisper",
    provider: "bananadev",
    me_personSlug: context.me_personSlug,
    relation_personSlug: context.relation_personSlug,
  });
};

watchWavToSpeech.config = {
  isInternetRequired: true,
  isHeavy: true,
  isBrowserRequired: false,
  isDisabled: true,
  watchStartupStrategy: "queue",
  isWatchFunction: true,

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
    if (parsedPath.ext !== ".wav") {
      return false;
    }

    if (
      getSubExtensions(absolutePath).includes(temporaryConvertedSubextension)
    ) {
      // temporary
      return false;
    }

    if (isLocked(absolutePath)) {
      // NB : also skips errored now :)
      return false;
    }

    const potentialTranscriptionFilePath = path.join(
      parsedPath.dir,
      `${parsedPath.name}.transcription.json`,
    );
    if (fs.existsSync(potentialTranscriptionFilePath)) {
      // already converted into a .transcription.json
      return false;
    }
    // its a wav file, added into the project, without a .transcription.json tied to it
    return true;
  },
} satisfies StandardFunctionConfig & WatchFunctionConfig;
