import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One joke about a meeting that should have been an email.
// Chosen from eight drafted one-liners and revised once: the sharpest,
// freshest angle was the host screen-sharing an email everyone had
// already received — and the kicker "slowly" makes the turn land on the
// last word, the way the judge's brief asks.
const LINE =
  "Someone shared their screen to read us an email we were all already copied on — slowly.";

// Gate before writing: exactly one line of plain text, 1-200 characters,
// not only whitespace.
if (
  LINE.length < 1 ||
  LINE.length > 200 ||
  LINE.trim().length === 0 ||
  LINE.includes("\n")
) {
  throw new Error(
    `entry line fails gate: ${LINE.length} characters, must be 1-200, single line, non-blank`,
  );
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

// Create the output directory only; never delete or clear it.
mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, LINE + "\n", "utf8");

// Verify the written file round-trips exactly.
const written = readFileSync(outPath, "utf8");
if (written !== LINE + "\n") {
  throw new Error("round-trip verification failed: entry.txt mismatch");
}

console.log(
  `Wrote ${LINE.length} characters to ${outPath} ` +
    `(sha256 ${createHash("sha256").update(written, "utf8").digest("hex")})`,
);
