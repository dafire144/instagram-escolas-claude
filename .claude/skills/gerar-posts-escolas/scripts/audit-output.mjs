import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const jobIndex = args.indexOf("--job");
if (jobIndex < 0 || !args[jobIndex + 1]) {
  throw new Error("Use: node audit-output.mjs --job caminho/job.json");
}

const repoRoot = process.cwd();
const jobPath = path.resolve(repoRoot, args[jobIndex + 1]);
const job = JSON.parse(fs.readFileSync(jobPath, "utf8"));
const output = path.resolve(repoRoot, job.output);
const manifestPath = path.join(output, "manifest.json");

if (!fs.existsSync(manifestPath)) throw new Error(`Manifesto ausente: ${manifestPath}`);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (manifest.safe_photo_reviewed !== true) throw new Error("Manifesto sem revisão fotográfica.");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  const signature = buffer.subarray(1, 4).toString("ascii");
  if (signature !== "PNG") throw new Error(`PNG inválido: ${file}`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

const pngs = walk(output).filter(
  (file) => file.toLowerCase().endsWith(".png") && !file.includes(`${path.sep}_assets${path.sep}`),
);
const expected = ["carousel", "carrossel"].includes(String(job.format).toLowerCase()) ? job.slides.length : 1;
if (pngs.length !== expected) throw new Error(`Quantidade incorreta de PNGs: ${pngs.length}. Esperado: ${expected}.`);

for (const file of pngs) {
  const dimensions = pngDimensions(file);
  if (dimensions.width !== 1080 || dimensions.height !== 1350) {
    throw new Error(`Dimensão incorreta em ${file}: ${dimensions.width}x${dimensions.height}.`);
  }
}

console.log(`STRUCTURAL PASS: ${pngs.length} PNG(s) em 1080x1350.`);
console.log("PENDENTE: abrir cada PNG e revisar todas as pessoas visualmente.");
