#!/usr/bin/env node
import { execSync } from "child_process";

/**
 * - `setVolume` runs `sudo osascript -e "set Volume {0-10}"` or without sudo
- `getVolume` runs `osascript -e "output volume of (get volume settings)"`
- `up/downVolume` runs `getVolume` and `setVolume` for it to go up/down
 */
export const setVolume = ({
  volume,
}: {
  /**
   * 0-7
   */
  volume: number;
}): void => {
  execSync(`osascript -e "set Volume ${volume}"`);
};

/**
 * needs to be tested
 */
export const getVolume = () => {
  const result = execSync(
    `osascript -e "output volume of (get volume settings)"`,
    { encoding: "utf8" },
  );
  const num = Number(result);
  return num;
};

export const upVolume = (): void => {
  const volume = (getVolume() / 100) * 7;
  setVolume({ volume: volume + 1 });
};

export const downVolume = (): void => {
  const volume = (getVolume() / 100) * 7;
  setVolume({ volume: volume - 1 });
};
