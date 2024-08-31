import { WatchContext } from "from-anywhere/types";
import { WatchFunctionConfig } from "from-anywhere/types";
import { StandardFunctionConfig } from "from-anywhere/types";
import { fs } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { getSubExtensions } from "from-anywhere/node";
import { ffmpegCommands } from "ffmpeg-util";
import { queueFfmpeg } from "ffmpeg-util";
import { docToMd } from "doc-to-md";
import { docxToMd } from "doc-to-md";
import { convertPdfToMd } from "pdf-to-md";
import { temporaryConvertedSubextension } from "from-anywhere";
import { audioFileExtensions } from "./extensions.js";
import { docFileExtensions } from "./extensions.js";
import { imageFileExtensions } from "./extensions.js";
import { readonlyDocFileExtensions } from "./extensions.js";
import { videoFileExtensions } from "./extensions.js";
import { isLocked } from "from-anywhere/node";
import { isAllTrue } from "from-anywhere";
/**

Watch all video file formats except mp4, and convert them all into a compressed .mp4 (10fps 480p) (remove original)

Find all audiofile formats in project except mp3 and wav, convert into 16 bit wav (remove original)

Find all image file formats in the project except png, convert to png, compress size if it seems to be able to be done without much loss.

Watch all doc formats (docx, rtf, pdf, what else?) and convert them into .md (keeping original)

*/

export const watchAudioVideoDoc = async (
  context: WatchContext,
): Promise<{ isSuccessful: boolean; message?: string }> => {
  const { absolutePath } = context;
  if (!fs.existsSync(absolutePath)) {
    return { isSuccessful: false, message: "File doesn't exist (anymore)" };
  }

  if (isLocked(absolutePath)) {
    return { isSuccessful: false, message: "Locked" };
  }

  if (absolutePath.endsWith(".doc")) {
    return docToMd(absolutePath, true);
  }

  if (absolutePath.endsWith(".docx")) {
    return docxToMd(absolutePath, true);
  }

  if (absolutePath.endsWith(".pdf")) {
    const pathParse = path.parse(absolutePath);

    const mdPathToBe = path.join(pathParse.dir, `${pathParse.name}.md`);
    if (fs.existsSync(mdPathToBe)) {
      return {
        isSuccessful: false,
        message: "Markdown already exists, not overwriting from pdf (for now)",
      };
    }
    if (!absolutePath) {
      return { isSuccessful: false, message: "Doesn't exist" };
    }
    const result = await convertPdfToMd({ inputPdfFilePath: absolutePath });
    return result;
  }

  const parsedPath = path.parse(absolutePath);
  const extension = parsedPath.ext;

  if (videoFileExtensions.includes(extension)) {
    const result = await queueFfmpeg(
      ffmpegCommands.getWhatsappMp4(absolutePath),
    );

    return {
      isSuccessful: !!result.outputPath,
    };
  }

  if (audioFileExtensions.includes(extension)) {
    const result = await queueFfmpeg(ffmpegCommands.getSimpleMp3(absolutePath));

    return {
      isSuccessful: !!result.outputPath,
    };
  }

  return { isSuccessful: false, message: "File isn't audio/video/image" };
};

watchAudioVideoDoc.config = {
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

    if (!fs.existsSync(absolutePath)) {
      // could be that it doesn't exist already
      return false;
    }

    const parsedPath = path.parse(absolutePath);

    const extension = parsedPath.ext;
    const subextensions = getSubExtensions(absolutePath);

    // in case of doc files, we want to keep the original!
    if (docFileExtensions.includes(extension)) {
      const potentialMdFile = path.join(
        parsedPath.dir,
        `${parsedPath.name}.md`,
      );
      const shouldConvert = !fs.existsSync(potentialMdFile);
      return shouldConvert;
    }

    if (readonlyDocFileExtensions.includes(extension)) {
      // if it's a .pdf, only convert if there's not already a .doc, .docx or .md with the same name
      const potentialSourceFilePaths = docFileExtensions
        .concat(".md")
        .map((extension) =>
          path.join(parsedPath.dir, `${parsedPath.name}${extension}`),
        );
      const shouldConvert = isAllTrue(
        potentialSourceFilePaths.map((p) => !fs.existsSync(p)),
      );
      return shouldConvert;
    }

    // in case of audio, video, and image files, we want to remove the original, so it should just never be there.

    const extensionsToWatch = audioFileExtensions
      .concat(videoFileExtensions)
      .concat(imageFileExtensions);

    if (!extensionsToWatch.includes(extension)) {
      // extension that we don't care about
      return false;
    }

    if (subextensions.includes(temporaryConvertedSubextension)) {
      // this is a temporary file (see ffmpeg-util)
      return false;
    }

    if (isLocked(absolutePath)) {
      return false;
    }

    // its a audio/video/image file, added into the project, in the wrong format
    return true;
  },
} satisfies StandardFunctionConfig & WatchFunctionConfig;
