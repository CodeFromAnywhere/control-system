import { getBatteryLevelPercentage } from "./getBatteryLevelPercentage.js";
import { isSystemUsingBattery } from "./isSystemUsingBattery.js";
getBatteryLevelPercentage().then(console.log);
isSystemUsingBattery().then(console.log);
