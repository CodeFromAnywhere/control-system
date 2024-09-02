#!/usr/bin/env node
import { execSync } from "child_process";
import { readFileSync } from "fs";
import * as path from "path";
import { StandardFunctionConfig } from "from-anywhere";

/**

sets timezone to a random one so we won't know the time. 
We can use one of the 440 timezones in timezones.md
 */
export const setRandomTimezone = (): void => {
  const timezonesPath = path.join(import.meta.dir, "..", "timezones.md");
  const timezonesString = readFileSync(timezonesPath, "utf8");
  const timezonesArray = timezonesString.split("\n");
  const randomTimezoneIndex = Math.floor(
    Math.random() * (timezonesArray.length - 1),
  );
  const timezone = timezonesArray[randomTimezoneIndex];
  const cmd = `systemsetup -settimezone ${timezone}`;
  execSync(cmd);
};

setRandomTimezone.config = {
  // runEveryPeriod: "midnight",
} satisfies StandardFunctionConfig;
