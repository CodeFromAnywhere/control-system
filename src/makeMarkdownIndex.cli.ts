import { makeMarkdownIndex } from "./makeMarkdownIndex.js";
const makeMarkdownIndexCli = () => {
  const [absoluteMarkdownFilePath] = process.argv.slice(2);
  makeMarkdownIndex(absoluteMarkdownFilePath);
};
makeMarkdownIndexCli();
