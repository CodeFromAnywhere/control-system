#!/usr/bin/env node
import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { homedir } from "os";
import { pickRandomArrayItem } from "from-anywhere";

export const getFolderNames = async (absoluteFolderPath: string) => {
  const dirents = fs.readdirSync(absoluteFolderPath, {
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

  const musicFolderPath = path.join(homedir(), "Music");

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
