#!/usr/bin/env node
import { execSync } from "child_process";
import { fs } from "from-anywhere/node";
import { operations } from "sdk-operations";
import { path as nodePath } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { getOperationPath } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { StandardFunctionConfig } from "from-anywhere/types";

export type OpenableFile = {
  projectRelativePath?: string;
  /**
   *
   */
  operationName?: string;
  operationRelativeFilePath?: string;
  line?: number;
};

export const getOpenableFilePath = async (
  file: OpenableFile,
): Promise<string | undefined> => {
  const projectRoot = getProjectRoot();

  if (!projectRoot) return;

  if (file.projectRelativePath)
    return path.join(projectRoot, file.projectRelativePath);

  if (!file.operationName || !file.operationRelativeFilePath) return;

  const operationBasePath = await getOperationPath(file.operationName, {
    operationPathsObject: operations,
  });
  if (!operationBasePath) return;

  const openableFilePath = nodePath.join(
    operationBasePath,
    file.operationRelativeFilePath,
  );

  return openableFilePath;
};

/**
 * opens a file in vscode through the "code" cli
 */
export const vscodeOpen = async (config: {
  /**
  Files to open. Either use a projectRelativePath or an operationName combined with an operationRelativePath.
  
  can optionally have the line and character specified as well after the file with [file-path]:[line]:[character]
   */
  files?: OpenableFile[];
}): Promise<undefined | { success: boolean; response: string }> => {
  const projectRoot = getProjectRoot();
  if (!projectRoot) return;

  if (!config.files) {
    const command = `code --goto ${projectRoot}`;
    execSync(command);
    return { success: true, response: "Opened the project root" };
  }

  await Promise.all(
    config.files.map(async (file) => {
      const absolutePath = await getOpenableFilePath(file);

      if (!absolutePath || !fs.existsSync(absolutePath)) {
        return { success: false, response: "This path doesn't exist" };
      }

      const fullPathWithLine = file.line
        ? `${absolutePath}:${file.line}`
        : absolutePath;

      const command = `code --goto ${fullPathWithLine}`;

      execSync(command);

      return { success: true, response: "Opened the file" };
    }),
  );

  return { success: true, response: "Opened the file(s)" };
};

vscodeOpen.config = {
  isPublic: false,
  categories: ["admin", "ui"],
} satisfies StandardFunctionConfig;
