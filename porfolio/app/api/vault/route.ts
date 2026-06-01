import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

interface VaultEntry {
  name: string;
  path: string;
  type: "folder" | "file";
  children?: VaultEntry[];
}

const VAULT_ROOT = path.join(process.cwd(), "public", "vault");

function isHidden(name: string) {
  return name.startsWith(".");
}

function sortEntries(a: VaultEntry, b: VaultEntry) {
  if (a.type !== b.type) {
    return a.type === "folder" ? -1 : 1;
  }
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

function listVault(dir: string, relativeBase = VAULT_ROOT): VaultEntry[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries
    .filter((entry) => !isHidden(entry.name))
    .map((entry) => {
      const entryPath = path.join(dir, entry.name);
      const relPath = path.relative(relativeBase, entryPath).split(path.sep).join("/");

      if (entry.isDirectory()) {
        return {
          name: entry.name,
          path: relPath,
          type: "folder",
          children: listVault(entryPath, relativeBase),
        } as VaultEntry;
      }

      return {
        name: entry.name,
        path: relPath,
        type: "file",
      } as VaultEntry;
    })
    .sort(sortEntries);
}

export async function GET() {
  if (!fs.existsSync(VAULT_ROOT)) {
    return NextResponse.json({ error: "Vault directory not found." }, { status: 404 });
  }

  const entries = listVault(VAULT_ROOT);
  return NextResponse.json(entries);
}
