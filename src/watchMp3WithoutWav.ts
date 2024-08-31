import { compressConvert } from "ffmpeg-util";
import { fs } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { getSubExtensions } from "from-anywhere/node";
import { StandardFunctionConfig } from "from-anywhere/types";
import { WatchContext } from "from-anywhere/types";
import { WatchFunctionConfig } from "from-anywhere/types";
import { temporaryConvertedSubextension } from "from-anywhere";
import { isLocked } from "from-anywhere/node";
import { lockError } from "from-anywhere/node";
/**
 * Find all mp3 everywhere without wav, add 16-bit wav
 */
export const watchMp3WithoutWav = async (
  context: WatchContext,
): Promise<string | undefined> => {
  const { absolutePath } = context;
  if (!fs.existsSync(absolutePath)) {
    console.log("doesn't exist", absolutePath);
    return;
  }
  if (isLocked(absolutePath)) {
    console.log("is locked", absolutePath);
    return;
  }
  const result = await compressConvert(absolutePath, {
    targetFormat: "wav",
    is16bitWav: true,
    keepOriginal: true,
  });

  return result;
};

watchMp3WithoutWav.config = {
  isDisabled: true,
  isHeavy: true,
  isInternetRequired: false,
  isBrowserRequired: false,
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

    if (extension !== ".mp3") {
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
    // ext is .mp3

    const potentialWavFile = path.join(
      parsedPath.dir,
      `${parsedPath.name}.wav`,
    );
    const shouldConvert = !fs.existsSync(potentialWavFile);

    return shouldConvert;
  },
} satisfies StandardFunctionConfig & WatchFunctionConfig;
