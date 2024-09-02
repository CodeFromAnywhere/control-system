import * as path from "path";
import * as fs from "fs";
import html2md from "html-to-md";
/**
IMPORT NOTES FROM APPLE .txt export
*/
export const importAppleNotes = async (
  appleNotesFolder: string,
  destinationFolder?: string,
) => {
  const names = await fs.readdir(appleNotesFolder, "utf8");

  if (destinationFolder && !fs.existsSync(destinationFolder)) {
    await fs.mkdir(destinationFolder, { recursive: true });
  }
  names.map((name) => {
    const filePath = path.join(appleNotesFolder, name);
    const parsedPath = path.parse(filePath);
    const mdPath = path.join(
      destinationFolder || appleNotesFolder,
      `${parsedPath.name}.md`,
    );
    const content = fs.readFileSync(filePath, "utf8");

    const md = html2md(content);

    fs.writeFileSync(mdPath, md, "utf8");
  });
};
