import { path } from "from-anywhere/node";
import { getRootPath } from "from-anywhere/node";
import { importAppleNotes } from "./importAppleNotes.js";
import { importGoogleKeep } from "./importGoogleKeep.js";
const test = () => {
  const notesFolder = path.join(
    getRootPath("assets")!,
    "drive-notes-etc",
    "keep-notes",
    "Keep",
  );
  const destinationFolder = path.join(
    getRootPath("memory")!,
    "persons/wijnand",
    "keep2",
  );
  importGoogleKeep(notesFolder, destinationFolder);
};
test();
