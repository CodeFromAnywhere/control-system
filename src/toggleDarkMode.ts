import { execSync } from "child_process";
import { setDarkmodeCommand } from "./general.js";
export const toggleDarkMode = (): boolean => {
  execSync(setDarkmodeCommand("not dark mode"));
  return true;
};
