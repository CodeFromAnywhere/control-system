import * as path from "path";
import * as fs from "fs";

import { readJsonFileSync } from "read-json-file";
export const importGoogleKeep = async (
  googleNotesFolder: string,
  destinationFolder?: string,
) => {
  const names = fs.readdirSync(googleNotesFolder, "utf8");

  if (destinationFolder && !fs.existsSync(destinationFolder)) {
    await fs.mkdir(destinationFolder, { recursive: true });
  }
  names.map((name) => {
    if (!name.endsWith(".json")) {
      // only take json files
      return;
    }
    const filePath = path.join(googleNotesFolder, name);
    const parsedPath = path.parse(filePath);
    const mdPath = path.join(
      destinationFolder || googleNotesFolder,
      `${parsedPath.name}.md`,
    );
    const content = readJsonFileSync<GoogleNoteType>(filePath);
    if (!content?.textContent) return;

    fs.writeFileSync(
      mdPath,
      `---
createdAt: ${Math.round(content.createdTimestampUsec / 1000)}
updatedAt: ${Math.round(content.userEditedTimestampUsec / 1000)}
---

# ${content.title}\n\n${content.textContent}`,
      "utf8",
    );
  });
};

type GoogleNoteType = {
  color: string;
  isTrashed: boolean;
  isPinned: boolean;
  isArchived: boolean;
  textContent: string;
  title: string;
  userEditedTimestampUsec: number;
  createdTimestampUsec: number;
  labels: { name: string }[];
};
