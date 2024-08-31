import { compressConvert } from "ffmpeg-util";
import { temporaryConvertedSubextension } from "from-anywhere";
import { fs } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { StandardFunctionConfig } from "from-anywhere/types";
import { WatchContext } from "from-anywhere/types";
import { WatchFunctionConfig } from "from-anywhere/types";
import { getProjectRoot } from "from-anywhere/node";
import { getSubExtensions } from "from-anywhere/node";
import { isLocked } from "from-anywhere/node";
/**
 * Find all mp4 everywhere without wav, add 16-bit wav
 */
export const watchMp4WithoutWav = async (
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
    targetFormat: "wav",
    is16bitWav: true,
    keepOriginal: true,
  });

  return result;
};

watchMp4WithoutWav.config = {
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

    if (extension !== ".mp4") {
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
    // ext is .mp4

    const potentialWavFile = path.join(
      parsedPath.dir,
      `${parsedPath.name}.wav`,
    );
    const shouldConvert = !fs.existsSync(potentialWavFile);

    return shouldConvert;
  },
} satisfies StandardFunctionConfig & WatchFunctionConfig;
