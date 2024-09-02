import * as path from "path";
import { importAppleNotes } from "./importAppleNotes.js";
const test = () => {
  const appleNotesFolder = path.join(
    getRootPath("assets")!,
    "drive-notes-etc",
    "notes2",
  );
  const appleNotesDestinationFolder = path.join(
    getRootPath("assets")!,
    "drive-notes-etc",
    "apple-notes-md",
  );
  importAppleNotes(appleNotesFolder, appleNotesDestinationFolder);
};
test();
