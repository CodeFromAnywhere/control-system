#!/usr/bin/env node
import { execSync } from "child_process";

export const decreaseBrightness = (): boolean => {
  execSync(
    `osascript -e 'tell application "System Events"' -e 'key code 145' -e ' end tell'`,
  );
  return true;
};

export const increaseBrightness = (): boolean => {
  execSync(
    `osascript -e 'tell application "System Events"' -e 'key code 144' -e ' end tell'`,
  );
  return true;
};

export const brigtnessZero = (): boolean => {
  Array(16)
    .fill(0)
    .map(() => decreaseBrightness());
  return true;
};

export const brigtnessFull = (): boolean => {
  Array(16)
    .fill(0)
    .map(() => increaseBrightness());
  return true;
};
