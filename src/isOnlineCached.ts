import { isOnline } from "./isOnline.js";
let isOnlineNow: boolean = false;
let lastCheckedAt: number = 0;

/**
 * Checks maximum once per minute if we are online by going to google.
 */
export const isOnlineCached = async () => {
  if (lastCheckedAt < Date.now() - 60000) {
    // NB: too long ago
    const newIsOnline = await isOnline();
    //console.log("Checking again", newIsOnline);
    isOnlineNow = newIsOnline;
    lastCheckedAt = Date.now();
    return newIsOnline;
  }

  return isOnlineNow;
};
