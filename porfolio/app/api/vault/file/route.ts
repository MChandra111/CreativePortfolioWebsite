import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const VAULT_ROOT = path.join(process.cwd(), "public", "vault");

function normalizePath(filePath: string) {
  const normalized = path.normalize(filePath).replace(/^([\/]+)|([\/]+)$/g, "");
  return normalized;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathParam = url.searchParams.get("path");

  if (!pathParam) {
    return NextResponse.json({ error: "Missing path parameter." }, { status: 400 });
  }

  const normalizedPath = normalizePath(pathParam);
  const resolvedPath = path.join(VAULT_ROOT, normalizedPath);

  if (!resolvedPath.startsWith(VAULT_ROOT)) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }

  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const content = fs.readFileSync(resolvedPath, "utf8");
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
