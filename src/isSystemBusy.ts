// import { cpus, totalmem, freemem, loadavg } from "os";
import { cpuUsage } from "os-utils";

/**
 * Promises `true` if system is using more than 75% of CPU
 */
export const isSystemBusy = async (): Promise<boolean> => {
  const percentage = await new Promise<number>((resolve) =>
    cpuUsage((percentage) => resolve(percentage)),
  );
  //console.log({ percentage });
  return percentage > 0.75;

  //    This is not useful enough....
  //   console.dir(
  //     {
  //       cpus: cpus(),
  //       totalmem: totalmem(),
  //       freemem: freemem(),
  //       load: loadavg(),
  //     },
  //     { depth: 99 }
  //   );
};
