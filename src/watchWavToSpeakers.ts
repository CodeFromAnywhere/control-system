import { WatchContext } from "from-anywhere/types";
import { WatchFunctionConfig } from "from-anywhere/types";
import { StandardFunctionConfig } from "from-anywhere/types";
import { fs } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { getSubExtensions } from "from-anywhere/node";
import { speakerSeparation } from "ai-models";
import { temporaryConvertedSubextension } from "from-anywhere";
import { isLocked } from "from-anywhere/node";
import { getPersona } from "person-util";
/**
Watch wav files anywhere and add speaker separation output if that isn't there yet
*/
export const watchWavToSpeakers = async (context: WatchContext) => {
  const { absolutePath } = context;
  const persona = await getPersona();
  if (!persona) {
    return;
  }
  if (isLocked(absolutePath)) {
    return false;
  }
  if (!fs.existsSync(absolutePath)) {
    return { isSuccessful: false, message: "File doesn't exist (anymore)" };
  }
  const speakerSeparationResult = await speakerSeparation({
    audioUri: absolutePath,
    relation_personSlug: persona.__id,
  });
  console.log({ speakerSeparationResult });
};

watchWavToSpeakers.config = {
  isInternetRequired: true,
  isHeavy: false,
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

    const potentialFilePath = `${absolutePath}.speakers.json`;
    if (fs.existsSync(potentialFilePath)) {
      // already converted
      return false;
    }

    if (isLocked(absolutePath)) {
      return false;
    }
    // its a wav file, added into the project, without a .speakers.json tied to it
    return true;
  },
} satisfies StandardFunctionConfig & WatchFunctionConfig;
