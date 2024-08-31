#!/usr/bin/env node
import { execSync } from "child_process";

export const setDarkmodeCommand = (newValue: string) => {
  return `osascript -e 'tell app \"System Events\" to tell appearance preferences to set dark mode to ${newValue}'`;
};

export const enableDarkMode = (): boolean => {
  execSync(setDarkmodeCommand("true"));
  return true;
};

export const disableDarkMode = (): boolean => {
  execSync(setDarkmodeCommand("false"));
  return true;
};
