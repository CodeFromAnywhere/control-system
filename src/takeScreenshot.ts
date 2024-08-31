import screenshot from "desktop-screenshot";
/**
 * Do this automatically every second... https://www.banana.dev/carrot
 */
const takeScreenshot = () => {
  screenshot(
    "screenshot.jpg",
    { width: 400, height: 300, quality: 60 },
    function (error: any, complete: any) {
      if (error) console.log("Screenshot failed", error);
      else console.log("Screenshot succeeded");
    },
  );
};

takeScreenshot();
