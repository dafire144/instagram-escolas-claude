import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const jobIndex = args.indexOf("--job");
const jobFile = jobIndex >= 0 && args[jobIndex + 1];
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const job = jobFile ? JSON.parse(await fs.readFile(path.resolve(root, jobFile), "utf8")) : null;
if (job?.content_type === "informative") {
  const { buildInformativeJob } = await import("./informative_posts.mjs");
  await buildInformativeJob(jobFile);
} else {
  await import("./build_test_posts.mjs");
}
