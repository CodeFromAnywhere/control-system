// import { setRandomTimezone } from "set-random-timezone";

/**
 * To enable possibility to change the timezone in the OS, this is the actually correct time, assuming we are in timezone GMT+1
 */
export const time = () => {
  const nowMs = Date.now();
  const nowDate = new Date(nowMs);
  const fakeOffsetMs = 60000 * nowDate.getTimezoneOffset();
  // hardcoded on GMT+1
  const realOffsetMs = 8 * 60 * 60000;

  const myTimeMs = nowMs + fakeOffsetMs + realOffsetMs;

  const myTimeDate = new Date(myTimeMs);

  //   console.log({
  //     nowMs,
  //     myTimeMs,
  //     fakeOffsetH: fakeOffsetMs / 3600000,
  //     realOffsetMs: realOffsetMs / 3600000,
  //   });

  //setRandomTimezone();
  return {
    timeString: `${myTimeDate.getHours()}:${myTimeDate.getMinutes()}`,
    myTimeDate,
    myTimeMs,
  };
};
