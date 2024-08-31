import { execSync } from "child_process";
export const disableScreenSleep = (administratorPassword: string) => {
  execSync(
    `echo "${administratorPassword}" | sudo -S pmset -a disablesleep 1`,
    { stdio: "inherit" },
  );
};

export const disableScreenSleep2 = () => {
  execSync(`sudo pmset -a disablesleep 1`, { stdio: "inherit" });
};

export const enableScreenSleep = (administratorPassword: string) => {
  execSync(
    `echo '${administratorPassword}' | sudo -S pmset -a disablesleep 0`,
    { stdio: "inherit" },
  );
};
