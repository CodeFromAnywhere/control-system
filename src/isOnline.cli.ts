import { isOnline } from "./isOnline.js";
const main = async () => {
  const online = await isOnline();

  console.log({ online });
};
main();
