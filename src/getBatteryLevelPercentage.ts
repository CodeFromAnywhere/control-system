// import getBatteryLevel from "battery-level";
/**
 * Uses (`battery-level`)[https://github.com/gillstrom/battery-level] for getting a battery level percentage in windows, macOs and Linux
 *
 * Promises a number between 0 and 1
 */
export const getBatteryLevelPercentage = async () => {
  const isMac = process.platform === "darwin";

  if (!isMac) {
    return 1;
  }

  try {
    // const percentage = await getBatteryLevel();
    return 1;
  } catch (e) {
    // NB: if there's no battery, assume it's 100%
    return 1;
  }
};
