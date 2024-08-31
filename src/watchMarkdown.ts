import { fs } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { StandardFunctionConfig } from "from-anywhere/types";
import { WatchContext } from "from-anywhere/types";
import { WatchFunctionConfig } from "from-anywhere/types";
import { makeMarkdownIndex } from "./makeMarkdownIndex.js";
/**
TODO:

# Refactor MarkdownIndex storage

- put it in frontmatter of the markdown!
- don't watch for .markdownIndex
- remove all .markdownindex.json
- watch contents of md file (frontmatter only) to see if index-version is "old"
- set everything being old...


==============


Every time a markdown file comes in (watcher), can we do some default functions and GPT for it.

Created `MarkdownIndex` at `[filename].MarkdownIndex.json`

- frontmatter
    - add author, createdAt (non-GPT)
    - title, keywords, seo keywords, seo title
- [filename].index.json: 
    - statements
    - take-aways
    - social-media-posts
    - images: GPT to get visual descriptions for any markdown file, which in turn can be turned into images
    - summary
    - snippets: Interesting standalone snippet finding in bigger video/audio `audiofile-name].snippets.json`


TODO: Offline GPT-less naming:

Match the audio recording .md against word combinations, model names, and folder names (and operation names, with that). name of the md can be based on those matches. fire out an exact strategy later. this way, the name can be auto-generated without a GPT, which is way more free/scalable/offline/decentralised, right now
 */
export const watchMarkdown = async (context: WatchContext) => {
  const { absolutePath } = context;
  if (!fs.existsSync(absolutePath)) {
    return { isSuccessful: false, message: "File doesn't exist (anymore)" };
  }

  await makeMarkdownIndex(absolutePath);
};

watchMarkdown.config = {
  isInternetRequired: true,
  isHeavy: false,
  isBrowserRequired: false,
  isDisabled: false,
  isWatchFunction: true,

  /**
   * filter to only get all add/change for any .md file that doesn't have a [file].MarkdownIndex.json
   */
  watchFilter: (eventName, absolutePath) => {
    // for now disable it for a while
    if (eventName !== "add") {
      return false;
    }

    const projectRoot = getProjectRoot();
    if (!projectRoot) {
      return false;
    }
    if (!absolutePath.startsWith(projectRoot)) {
      return false;
    }
    const parsedPath = path.parse(absolutePath);
    const extension = parsedPath.ext;

    // no correct extension
    if (extension !== ".md") {
      return false;
    }

    const potentialIndexPath = path.join(
      parsedPath.dir,
      `${parsedPath.name}.MarkdownIndex.json`,
    );

    if (!fs.existsSync(potentialIndexPath)) {
      // no index yet
      return true;
    }

    // a markdown not indexed yet!
    return true;
  },
  watchStartupStrategy: "ignore",
} satisfies StandardFunctionConfig & WatchFunctionConfig;
