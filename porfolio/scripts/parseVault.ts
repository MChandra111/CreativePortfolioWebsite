// scripts/parseVault.ts
// Run with: npx ts-node scripts/parseVault.ts
// Or add to your package.json scripts: "parse-vault": "ts-node scripts/parseVault.ts"
// Output: public/graph-data.json  (served statically by Next.js)

import fs from "fs";
import path from "path";
import "dotenv/config";

// ── Config ────────────────────────────────────────────────────────────────────
const VAULT_DIR = process.env.VAULT_DIR ?? path.join(process.cwd(), "vault");
const OUTPUT_FILE = path.join(process.cwd(), "public", "graph-data.json");
// ─────────────────────────────────────────────────────────────────────────────

export interface NoteNode {
  id: string;        // filename without .md
  label: string;     // display name
  group: string;     // top-level folder, or "root"
  linkCount: number; // number of outgoing + incoming links
  path: string;      // relative path inside vault, e.g. "Projects/Web Dev.md"
  tags: string[];    // frontmatter tags
}

export interface NoteLink {
  source: string;   // node id
  target: string;   // node id
}

export interface GraphData {
  nodes: NoteNode[];
  links: NoteLink[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Recursively collect all .md files under a directory. */
function collectMarkdownFiles(dir: string, baseDir = dir): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path.relative(baseDir, fullPath));
    }
  }
  return files;
}

/** Extract [[wikilinks]] from note content. Handles aliases: [[Target|Alias]]. */
function extractWikilinks(content: string): string[] {
  const re = /\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g;
  const links: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(content)) !== null) {
    // Normalise to lowercase so "My Note" and "my note" resolve to the same node.
    links.push(match[1].trim());
  }
  return links;
}

/** Parse YAML-style frontmatter tags. Handles both list and inline styles. */
function extractTags(content: string): string[] {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return [];
  const fm = fmMatch[1];

  // tags: [tag1, tag2]  or  tags: tag1
  const inlineMatch = fm.match(/^tags:\s*\[([^\]]+)\]/m);
  if (inlineMatch) {
    return inlineMatch[1].split(",").map((t) => t.trim().replace(/^['"]|['"]$/g, ""));
  }

  // tags:\n  - tag1\n  - tag2
  const blockMatch = fm.match(/^tags:\s*\n((?:\s+-\s+.+\n?)+)/m);
  if (blockMatch) {
    return blockMatch[1]
      .split("\n")
      .map((l) => l.replace(/^\s+-\s+/, "").trim())
      .filter(Boolean);
  }

  return [];
}

/** Derive a node id from a relative file path (strip .md, normalise slashes). */
function pathToId(relativePath: string): string {
  return relativePath.replace(/\.md$/, "").replace(/\\/g, "/");
}

/** Given a raw wikilink target, find the matching node id. */
function resolveLink(
  rawTarget: string,
  allIds: Set<string>
): string | null {
  // Exact match first
  if (allIds.has(rawTarget)) return rawTarget;
  // Match by basename (Obsidian resolves shortest path)
  const lower = rawTarget.toLowerCase();
  for (const id of allIds) {
    const base = id.split("/").pop()!.toLowerCase();
    if (base === lower) return id;
  }
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function parseVault(): GraphData {
  if (!fs.existsSync(VAULT_DIR)) {
    throw new Error(`Vault directory not found: ${VAULT_DIR}`);
  }

  const files = collectMarkdownFiles(VAULT_DIR);
  console.log(`Found ${files.length} markdown files.`);

  // Build a map of id → raw content
  const contentMap = new Map<string, string>();
  for (const relPath of files) {
    const id = pathToId(relPath);
    const content = fs.readFileSync(path.join(VAULT_DIR, relPath), "utf8");
    contentMap.set(id, content);
  }

  const allIds = new Set(contentMap.keys());

  // Track link counts per node
  const linkCounts = new Map<string, number>();
  for (const id of allIds) linkCounts.set(id, 0);

  // Build edges
  const edgeSet = new Set<string>(); // deduplicate
  const links: NoteLink[] = [];

  for (const [sourceId, content] of contentMap) {
    const rawLinks = extractWikilinks(content);
    for (const raw of rawLinks) {
      const targetId = resolveLink(raw, allIds);
      if (!targetId || targetId === sourceId) continue;

      const key = `${sourceId}→${targetId}`;
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);

      links.push({ source: sourceId, target: targetId });
      linkCounts.set(sourceId, (linkCounts.get(sourceId) ?? 0) + 1);
      linkCounts.set(targetId, (linkCounts.get(targetId) ?? 0) + 1);
    }
  }

  // Build nodes
  const nodes: NoteNode[] = [];
  for (const [id, content] of contentMap) {
    const parts = id.split("/");
    const label = parts[parts.length - 1];
    const group = parts.length > 1 ? parts[0] : "root";
    const tags = extractTags(content);

    nodes.push({
      id,
      label,
      group,
      linkCount: linkCounts.get(id) ?? 0,
      path: id + ".md",
      tags,
    });
  }

  return { nodes, links };
}

// ── Run ───────────────────────────────────────────────────────────────────────

const graphData = parseVault();
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(graphData, null, 2));
console.log(
  `Graph written to ${OUTPUT_FILE} — ${graphData.nodes.length} nodes, ${graphData.links.length} links.`
);
