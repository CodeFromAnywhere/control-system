import { path } from "from-anywhere/node";
import { getRootPath } from "from-anywhere/node";
import { importGhostBlogs } from "./importGhostBlogs.js";
const test = () => {
  const ghostFile =
    "/Users/king/King/assets/ghost/ghost-blog-weird-chars-removed.json";
  const destinationFolder = path.join(
    getRootPath("memory")!,
    "persons/wijnand/blogs-ghost",
  );

  importGhostBlogs(ghostFile, destinationFolder);
};
test();
