#!/usr/bin/env node
import { log } from "log";
import { execAsync } from "child-process-helper";

////
/**
 * gets location
 *
 * make sure this is installed:
 * https://github.com/fulldecent/corelocationcli
 *
 * later it will probably be better to have an electron app with all sensors for crossplatform compatibility
 */
export const getLocation = async () => {
  console.log("getLocation Coming soon");
  return { latitude: 0, longitude: 0 };
  // try {
  //   const { success, response } = await execAsync("corelocationcli");

  //   if (!success) {
  //     log("Error fetching location", { type: "error" });
  //     return;
  //   }
  //   const [latitude, longitude] = response
  //     .replace("\n", "")
  //     .split(" ")
  //     .map(Number);
  //   console.log({ latitude, longitude });
  //   return { latitude, longitude };
  // } catch (e) {
  //   log("Error fetching location", { type: "error" });
  // }

  /**
   * what we need
   *
   * 1) a way to draw polygons and circles with radius on a map that are then saved to an Area model. This UI should also show where you've been: UnknownLocation's are shown and places where you stayed in a small area for more than 10 minutes should be highlighted
   * 2) a way to determine if your current location is in any Area
   * 3) if there's no match of area, save location to UnknownLocation model
   * 4) if there's a match of area, save location to Location model. Group locations together if they stay the same with a startUnix and endUnix
   * 5) latest area and coords should be returned by papi
   * 6) It'd be great to acquire a database with country and city names and areas and maybe even addresses so we can reverse geocode everything OFFLINE.
   * 
   * 
   * 
   * After all of this is there, we can also work on answering the following questions:
   * 
- are you outside?
- are you at home?
- are you working?
- are you in a restaurant?
- what are you doing, most likely?
- are you commuting, if so, are you walking, cycling, or driving?

Once we can answer some of these questions the interval on which location is asked for can also be optimised. When we are sleeping, it's very unlikely location will change for the coming 15 minutes, so no need to track. When we are commuting, a more accurate location may be handy. This seems like a premature optimisation though, let's see what the battery thinks of this first!
   */
};
