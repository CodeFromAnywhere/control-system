#!/usr/bin/env node
import { execSync } from "child_process";
import { path } from "from-anywhere/node";
import { fs } from "from-anywhere/node";
import { pickRandomArrayItem } from "from-anywhere";

export const getFolderNames = async (absoluteFolderPath: string) => {
  const dirents = await fs.readdir(absoluteFolderPath, {
    withFileTypes: true,
    encoding: "utf8",
  });
  const folderNames = dirents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  return folderNames;
};

/**
 * Please place your description here
 */
export const playMusic = async (config: { musicFolderName?: string }) => {
  const { musicFolderName } = config;

  const musicFolderPath = path.join("/Users/king/Documents/wijnand/music");

  const folderNames = await getFolderNames(musicFolderPath);

  const randomFolder = pickRandomArrayItem(folderNames);

  const finalFolderName = musicFolderName || randomFolder;

  console.log("Going to play some", finalFolderName);

  const absoluteFolderPath = path.join(musicFolderPath, finalFolderName);

  if (!fs.existsSync(absoluteFolderPath)) {
    console.log(
      `Please put your ${musicFolderName} music in ${absoluteFolderPath} so it can be played.`,
    );
    return;
  }

  execSync("find . -name '*.mp3' -exec afplay '{}' \\;", {
    cwd: absoluteFolderPath,
    stdio: "inherit",
  });
};
