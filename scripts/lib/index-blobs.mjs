// Reads every blob in the git INDEX without parsing a path out of any text stream.
//
// `git ls-files -z -s` gives one NUL-terminated record per entry, "<mode> <sha> <stage>\t<path>",
// and the path is everything after the first TAB, verbatim — no quoting, no newline splitting.
// The blobs are then read by object id through `git cat-file --batch`, which never sees a path.
//
// Why this exists (2026-10-05, two review rounds): the tree checks used to parse `git grep` and
// `git diff` output, and each round found a new way a filename or a line of content could be
// mistaken for structure (a git-quoted path, a newline in a filename, an added line that looked
// like a diff header). Reading blobs by id removes the parsing instead of hardening it.
//
// A blob is returned as text whatever bytes it holds; callers decide nothing about "binary".

import { execFileSync, spawnSync } from "node:child_process";

export function readIndexBlobs({ cwd, skip = () => false } = {}) {
  const raw = execFileSync("git", ["ls-files", "-z", "-s"], { encoding: "utf8", cwd, maxBuffer: 64 * 1024 * 1024 });
  const entries = [];
  for (const rec of raw.split("\0")) {
    if (!rec) continue;
    const tab = rec.indexOf("\t");
    const [mode, sha] = rec.slice(0, tab).split(" ");
    const file = rec.slice(tab + 1);
    // 160000 is a submodule pointer and 120000 a symlink: neither is file content in this tree.
    if (mode === "160000" || mode === "120000" || skip(file)) continue;
    entries.push({ file, sha });
  }
  if (!entries.length) return [];
  const res = spawnSync("git", ["cat-file", "--batch"], { cwd, input: entries.map((e) => e.sha).join("\n") + "\n", maxBuffer: 1024 * 1024 * 1024 });
  if (res.status !== 0) throw new Error(`git cat-file --batch exited ${res.status}`);
  const buf = res.stdout;
  const out = [];
  let pos = 0;
  for (const e of entries) {
    const nl = buf.indexOf(0x0a, pos);
    const header = buf.subarray(pos, nl).toString("utf8");
    const size = Number(header.split(" ")[2]);
    if (!header.startsWith(e.sha) || !Number.isFinite(size)) throw new Error(`unexpected cat-file header for ${e.file}: ${header.slice(0, 80)}`);
    out.push({ file: e.file, text: buf.subarray(nl + 1, nl + 1 + size).toString("utf8") });
    pos = nl + 1 + size + 1; // the blob is followed by one LF
  }
  return out;
}

export function toLines(blobs) {
  const lines = [];
  for (const { file, text } of blobs) text.split(/\r?\n/).forEach((t, i) => lines.push({ file, line: i + 1, text: t }));
  return lines;
}
