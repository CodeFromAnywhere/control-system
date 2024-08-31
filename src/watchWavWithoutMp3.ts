import { compressConvert } from "ffmpeg-util";
import { temporaryConvertedSubextension } from "from-anywhere";
import { fs } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { getSubExtensions } from "from-anywhere/node";
import { isLocked } from "from-anywhere/node";
import { StandardFunctionConfig } from "from-anywhere/types";
import { WatchContext } from "from-anywhere/types";
import { WatchFunctionConfig } from "from-anywhere/types";
/**
 * Find all wav everywhere without mp3, add mp3
 */
export const watchWavWithoutMp3 = async (
  context: WatchContext,
): Promise<string | undefined> => {
  const { absolutePath } = context;
  if (isLocked(absolutePath)) {
    return;
  }
  if (!fs.existsSync(absolutePath)) {
    return;
  }
  const result = await compressConvert(absolutePath, {
    targetFormat: "mp3",
    keepOriginal: true,
  });

  return result;
};

watchWavWithoutMp3.config = {
  isHeavy: true,
  isInternetRequired: false,
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
    const extension = parsedPath.ext;
    const subextensions = getSubExtensions(absolutePath);

    if (extension !== ".wav") {
      return false;
    }

    if (
      getSubExtensions(absolutePath).includes(temporaryConvertedSubextension)
    ) {
      // temporary
      return false;
    }

    if (isLocked(absolutePath)) {
      return false;
    }
    // ext is .wav
    const potentialMp3File = path.join(
      parsedPath.dir,
      `${parsedPath.name}.mp3`,
    );
    const shouldConvert = !fs.existsSync(potentialMp3File);

    return shouldConvert;
  },
} satisfies StandardFunctionConfig & WatchFunctionConfig;
