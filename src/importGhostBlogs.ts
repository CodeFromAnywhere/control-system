import * as path from "path";
import * as fs from "fs";
import { readJsonFile } from "read-json-file";
export const importGhostBlogs = async (
  absoluteGhostJsonFilePath: string,
  destinationFolderPath: string,
) => {
  const ghostJson = await readJsonFile<GhostJson>(absoluteGhostJsonFilePath);

  const posts = ghostJson?.db?.[0]?.data?.posts;

  if (!posts) {
    console.log("Couldn't read format");
    return;
  }

  if (!fs.existsSync(destinationFolderPath)) {
    await fs.mkdir(destinationFolderPath, { recursive: true });
  }
  posts.map((post) => {
    const destinationFilePath = path.join(
      destinationFolderPath,
      `${post.slug}.md`,
    );

    const createdAt = new Date(post.created_at).valueOf();
    const updatedAt = new Date(post.updated_at).valueOf();
    const publishedAt = new Date(post.published_at).valueOf();

    fs.writeFileSync(
      destinationFilePath,
      `---
createdAt: ${createdAt}
updatedAt: ${updatedAt}
publishedAt: ${publishedAt}
---

# ${post.title}

${post.plaintext}`,
    );
  });
};

export type GhostPost = {
  title: string;
  slug: string;
  plaintext: string;
  html: string;
  mobiledoc: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  [otherStuff: string]: any;
};

export type GhostJson = {
  db: {
    meta: any;
    data: {
      [otherThing: string]: any;
      posts: GhostPost[];
    };
  }[];
};
