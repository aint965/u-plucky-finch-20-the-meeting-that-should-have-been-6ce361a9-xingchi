import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One joke about a meeting that should have been an email.
// Revised in this round: the old line ("Someone shared their screen to
// read us an email we were all already copied on — slowly.") scored well
// on recognition, but its laugh landed mid-sentence and "slowly" was a
// soft kicker. The new line won the re-scoring (24/25 vs 21/25): it names
// the meeting and the email explicitly, the turn — an email summarising
// the meeting that was held to read an email — arrives on the last word,
// the meeting-about-an-email-about-a-meeting loop is a fresher angle
// than a single observation, and it is tighter at 78 characters.
const LINE =
  "We held a meeting to read an email, then got an email summarising the meeting.";

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
