import { execSync } from "child_process";
import { GlobalKeyboardListener } from "node-global-key-listener";
export const cmdSpaceListener = () => {
  const v = new GlobalKeyboardListener();

  console.log("Listening to cmd space");
  //Capture Windows + Space on Windows and Command + Space on Mac
  v.addListener(function (e, down) {
    if (
      e.state == "DOWN" &&
      e.name == "SPACE" &&
      (down["LEFT META"] || down["RIGHT META"])
    ) {
      execSync("open http://clarity.com");
      //call your function
      return true;
    }
  });
};
