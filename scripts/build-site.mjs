import { copyFile, mkdir, readFile, rm, stat } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(projectRoot, "dist");

// Keep the deployable site to an explicit allow-list. The notebook, original
// source image, README, and development scripts must not enter the public site.
const publicFiles = [
  "index.html",
  "styles.css",
  "src/main.js",
  "assets/glove-map.txt.gz",
];

if (!outputDirectory.startsWith(projectRoot + sep)) {
  throw new Error("Refusing to build outside the project directory.");
}

const html = await readFile(join(projectRoot, "index.html"), "utf8");
const requiredReferences = [
  "./styles.css?v=click-me-2",
  "./src/main.js?v=click-me-2",
];

for (const reference of requiredReferences) {
  if (!html.includes(reference)) {
    throw new Error("index.html is missing the expected local resource: " + reference);
  }
}

for (const relativePath of publicFiles) {
  const sourcePath = join(projectRoot, relativePath);
  const info = await stat(sourcePath);

  if (!info.isFile() || info.size === 0) {
    throw new Error("Required site file is missing or empty: " + relativePath);
  }
}

// Rebuild the output from the allow-list each time, removing stale files.
await rm(outputDirectory, { recursive: true, force: true });

for (const relativePath of publicFiles) {
  const destinationPath = join(outputDirectory, relativePath);
  await mkdir(dirname(destinationPath), { recursive: true });
  await copyFile(join(projectRoot, relativePath), destinationPath);
}

console.log("Prepared GitHub Pages files in dist/ (" + publicFiles.length + " files).");
console.log("The notebook and development reference files were excluded.");
console.log("Nothing has been published or deployed.");
