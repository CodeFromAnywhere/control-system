import { textToText } from "ai-models";
import { fs } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { findJsonInMarkdown } from "marked-util";
export const getIsPrivate = async (contents: string) => {
  const isPrivateConventionPath = path.join(
    import.meta.dir,
    "..",
    "src",
    "is-private-convention.md",
  );

  const conventionText = await fs.readTextFile(isPrivateConventionPath);
  const tttResult = await textToText({
    text: `Consider the following text:
  
  ---
  ${contents}
  ---
  
  Should we mark this file private? Please respond in JSON, in this format: \`{ isPrivate: boolean }\`.
  
  ${conventionText}`,
  });

  if (!tttResult.isSuccessful) {
    return { isSuccessful: false, message: tttResult.message };
  }

  const json = findJsonInMarkdown<{ isPrivate: boolean }>(
    tttResult.chatResponse,
  );
  const isPrivate = json?.isPrivate;

  return { isSuccessful: true, message: tttResult.message, isPrivate };
};
