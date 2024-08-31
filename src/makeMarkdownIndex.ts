import { path } from "from-anywhere/node";
import { writeJsonToFile } from "from-anywhere/node";
import { MarkdownIndex } from "from-anywhere/types";
import { readMarkdownFile } from "read-markdown-file";
import { textToText } from "ai-models";
import { notEmpty } from "from-anywhere";
import { omitUndefinedValues } from "from-anywhere";
import { isLocked } from "from-anywhere/node";
import { lock } from "from-anywhere/node";
import { lockError } from "from-anywhere/node";
import { unlock } from "from-anywhere/node";
import { getUpdatedTimeObject } from "from-anywhere/types";
import { calculateTokenCount } from "ai-chunking";
import { getIsPrivate } from "./getIsPrivate.js";
/**
 * Creates `MarkdownIndex` using GPT and other things.
 
 */
export const makeMarkdownIndex = async (absoluteMarkdownFilePath: string) => {
  if (isLocked(absoluteMarkdownFilePath)) {
    return;
  }

  await lock(
    absoluteMarkdownFilePath,
    "making markdown index",
    "makeMarkdownIndex",
    [absoluteMarkdownFilePath],
  );

  const pathParse = path.parse(absoluteMarkdownFilePath);
  const markdownParse = await readMarkdownFile(absoluteMarkdownFilePath);
  if (!markdownParse) {
    await lockError(
      absoluteMarkdownFilePath,
      "Can't find file",
      undefined,
      "makeMarkdownIndex",
      [absoluteMarkdownFilePath],
    );
    return;
  }

  const contents = markdownParse.raw;

  if (calculateTokenCount(contents) > 1024) {
    console.log("FILE TOO LONG, FOR NOW.");
    lockError(
      absoluteMarkdownFilePath,
      "file too long, for now",
      undefined,
      "makeMarkdownIndex",
      [absoluteMarkdownFilePath],
    );

    return;
  }
  const title = (
    await textToText({
      text: `Please describe the contents of this file in just a few words:
    
    \`\`\`
    ${contents}
    \`\`\``,
    })
  )?.chatResponse;

  const seoTitle = (
    await textToText({
      text: `Can you come up with a good SEO title for this webpage?
    
    \`\`\`
    ${contents}
    \`\`\``,
    })
  )?.chatResponse;

  const keywords = (
    await textToText({
      text: `Can you come up with some keywords for this file?
    
    \`\`\`
    ${contents}
    \`\`\``,
    })
  )?.chatResponse?.split(",");

  const seoKeywords = (
    await textToText({
      text: `Can you come up with some SEO keywords for this webpage?
    
    \`\`\`
    ${contents}
    \`\`\``,
    })
  )?.chatResponse
    ?.split(",")
    .map((x) => x.trim());

  const imagePromptDescriptions = (
    await textToText({
      text: `Can you come up with a list of visual descriptions for images that would present this content well?
      
    \`\`\`
    ${contents}
    \`\`\``,
    })
  )?.chatResponse?.split("\n");
  const socialMediaPost = (
    await textToText({
      text: `What would be a good social media post about this information?
      
    \`\`\`
    ${contents}
    \`\`\``,
    })
  )?.chatResponse;

  const socialMediaPosts = socialMediaPost ? [socialMediaPost] : [];

  const summary = (
    await textToText({
      text: `Summarize this piece of text:
    
    \`\`\`
    ${contents}
    \`\`\``,
    })
  )?.chatResponse;

  const takeAways = (
    await textToText({
      text: `What are the main take-aways from this text?
      
    \`\`\`
    ${contents}
    \`\`\``,
    })
  )?.chatResponse?.split("\n");

  const statements = (
    await textToText({
      text: `Can you list the most important statements made in this piece of text?
      
    \`\`\`
    ${contents}
    \`\`\``,
    })
  )?.chatResponse?.split("\n");
  /*

  const snippet = (
    await textToText(`Can you provide me a snippet of this file that would be a good standalone piece of content? If there is none, no problem.
    
  \`\`\`
  ${contents}
  \`\`\``)
  )?.result;

  const snippets = [
    snippet
      ? {
          firstLine: snippet.split("\n")[0],
          lastLine: snippet.split("\n").pop()!,
        }
      : undefined,
  ].filter(notEmpty);
*/

  const isPrivate = (await getIsPrivate(contents))?.isPrivate;
  /**
   * TODO: make much more here. super important
   */
  const markdownIndex: MarkdownIndex = omitUndefinedValues({
    ...getUpdatedTimeObject(),
    isSource: false,
    isPrivate,
    source: "makeMarkdownIndex v1",
    createdAt: Date.now(),
    title,
    keywords,
    imagePromptDescriptions,
    seoKeywords,
    seoTitle,
    socialMediaPosts,
    summary,
    takeAways,
    statements,
    // later
    suggestedLocation: undefined,
  });

  const indexPath = path.join(
    pathParse.dir,
    `${pathParse.name}.MarkdownIndex.json`,
  );

  const isSuccessful = await writeJsonToFile(indexPath, markdownIndex);

  await unlock(absoluteMarkdownFilePath);
};
