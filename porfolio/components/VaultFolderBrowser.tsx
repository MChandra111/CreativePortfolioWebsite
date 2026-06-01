"use client";

import { useEffect, useMemo, useState, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Folder, FileText, ChevronDown, ChevronRight } from "lucide-react";
import VaultGraph from "./VaultGraph";

interface VaultEntry {
  name: string;
  path: string;
  type: "folder" | "file";
  children?: VaultEntry[];
}

function sortEntries(a: VaultEntry, b: VaultEntry) {
  if (a.type !== b.type) {
    return a.type === "folder" ? -1 : 1;
  }
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

function FilesContainer({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4 overflow-auto flex-1 pr-2">{children}</div>;
}

function FolderItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <div data-value={value} className="space-y-1">
      {children}
    </div>
  );
}

function FolderTrigger({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-left text-slate-100 transition hover:border-slate-600 hover:bg-slate-700 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

function FolderPanel({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden opacity-100 transition-all duration-300 ease-out"
      /* limit expansion so the left explorer never grows beyond this height */
      style={{ maxHeight: open ? 560 : 0, opacity: open ? 1 : 0 }}
    >
      <div style={{ maxHeight: 560, overflow: "auto", paddingRight: 8, paddingTop: 8 }}>{children}</div>
    </div>
  );
}

function filterOutAttachments(items: VaultEntry[]): VaultEntry[] {
  return items
    .filter((item) => item.name.toLowerCase() !== "attachments")
    .map((item) => {
      if (item.type === "folder" && item.children) {
        return { ...item, children: filterOutAttachments(item.children).sort(sortEntries) };
      }
      return item;
    });
}

function SubFiles({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1 border-l border-slate-800/80 pl-4">{children}</div>;
}

function FileItem({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? "border-slate-500 bg-slate-700 text-slate-100 shadow-sm"
          : "border-transparent bg-slate-900 text-slate-200 hover:border-slate-700 hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

export default function VaultFolderBrowser() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [activeView, setActiveView] = useState<"graph" | "preview">("graph");
  const [error, setError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const fetchVault = async () => {
    setError(null);

    try {
      const response = await fetch("/api/vault", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Unable to load vault: ${response.statusText}`);
      }
      const data = (await response.json()) as VaultEntry[];
      setEntries(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    }
  };

  const fetchFileContent = async (pathValue: string) => {
    setPreviewLoading(true);
    setPreviewError(null);
    setFileContent("");

    try {
      const response = await fetch(`/api/vault/file?path=${encodeURIComponent(pathValue)}`, { cache: "no-store" });
      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.error || `Unable to load file (${response.status})`);
      }
      const text = await response.text();
      setFileContent(text);
    } catch (fileError) {
      setPreviewError(fileError instanceof Error ? fileError.message : String(fileError));
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    const loadVault = async () => {
      await fetchVault();
    };

    void loadVault();
    const interval = window.setInterval(loadVault, 15000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedPath) {
      const timeout = window.setTimeout(() => {
        setFileContent("");
        setPreviewError(null);
      }, 0);
      return () => window.clearTimeout(timeout);
    }

    const loadFile = async () => {
      await fetchFileContent(selectedPath);
    };

    void loadFile();
  }, [selectedPath]);

  const toggle = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleSelectFile = (path: string) => {
    setSelectedPath(path);
    setActiveView("preview");
  };

  const handleGraphNodeClick = (node: { path: string }) => {
    setSelectedPath(node.path);
    setActiveView("preview");
  };

  const getDisplayName = (name: string) => name.replace(/\.md$/i, "");

  const stripWikiLinks = (content: string) => content.replace(/\[\[([^\]]+)\]\]/g, "$1");

  const normalizeMarkdown = (content: string) =>
    stripWikiLinks(content).replace(/==(.+?)==/g, "**$1**");

  const renderEntry = (entry: VaultEntry, depth = 0) => {
    const isFolder = entry.type === "folder";
    const isOpen = expanded[entry.path];
    const isSelected = selectedPath === entry.path;

    if (isFolder) {
      return (
        <FolderItem key={entry.path} value={entry.path}>
          <FolderTrigger
            onClick={() => toggle(entry.path)}
            className="group"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-800 text-slate-100 ring-1 ring-slate-700">
              <Folder className="h-4 w-4" />
            </span>
            <span className="flex-1 text-sm font-medium text-slate-100">{entry.name}</span>
            <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
              {isOpen ? <ChevronDown className="h-4 w-4 text-slate-300" /> : <ChevronRight className="h-4 w-4 text-slate-300" />}
            </span>
          </FolderTrigger>

          <FolderPanel open={isOpen}>
            <SubFiles>
              {entry.children?.sort(sortEntries).map((child) => renderEntry(child, depth + 1))}
            </SubFiles>
          </FolderPanel>
        </FolderItem>
      );
    }

    return (
      <FileItem key={entry.path} active={isSelected} onClick={() => handleSelectFile(entry.path)}>
        <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-800 text-slate-100 ring-1 ring-slate-700">
          <FileText className="h-4 w-4" />
        </span>
        <div className="flex-1 text-sm text-slate-100">
          <div className="truncate font-medium">{getDisplayName(entry.name)}</div>
        </div>
      </FileItem>
    );
  };

  const sortedEntries = useMemo(() => filterOutAttachments([...entries].sort(sortEntries)), [entries]);
  const selectedFile = useMemo(() => {
    if (!selectedPath) return null;

    const findEntry = (items: VaultEntry[]): VaultEntry | null => {
      for (const item of items) {
        if (item.path === selectedPath) return item;
        if (item.type === "folder" && item.children) {
          const found = findEntry(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findEntry(entries);
  }, [entries, selectedPath]);

  return (
    <section className="grid min-h-screen gap-8 lg:grid-cols-[minmax(320px,33%)_minmax(0,67%)]">
  <div style={{ maxHeight: 1500 }} className="flex flex-col h-full overflow-hidden rounded-3xl border border-slate-700/80 bg-[#334155] p-6 shadow-xl shadow-slate-950/10 text-slate-50">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-300">Handwritten Notes</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Knowledge Base</h2>
            </div>
          </div>

        {error ? (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-200">{error}</div>
        ) : null}

        <FilesContainer>
          {sortedEntries.length > 0 ? (
            sortedEntries.map((entry) => renderEntry(entry))
          ) : (
            <div className="rounded-3xl border border-slate-600 bg-slate-900/80 p-5 text-sm text-slate-200">
              No vault items found.
            </div>
          )}
        </FilesContainer>
      </div>

      <div className="rounded-3xl border border-slate-700/80 bg-[#334155] p-6 shadow-xl shadow-slate-950/10 text-slate-50 flex flex-col">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="mt-2 text-3xl font-semibold text-white">{selectedFile ? getDisplayName(selectedFile.name) : "Select a file"}</h2>
          <button
            type="button"
            onClick={() => setActiveView("graph")}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeView === "graph"
                ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
                : "border-slate-600 bg-slate-900 text-slate-200 hover:border-slate-500 hover:bg-slate-800"
            }`}
          >
            Graph View
          </button>
        </div>

        {previewError ? (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-200">{previewError}</div>
        ) : null}

        <div className="rounded-3xl border border-slate-600 bg-slate-900 p-5 text-sm text-slate-100 flex-1" style={{ minHeight: 680 }}>
          {activeView === "graph" ? (
            <div className="w-full h-full">
              <VaultGraph className="h-full w-full rounded-2xl bg-slate-950" onNodeClick={handleGraphNodeClick} />
            </div>
          ) : previewLoading ? (
            <div className="flex h-full items-center justify-center text-slate-300">Loading preview…</div>
          ) : selectedFile ? (
            <div className="space-y-6 text-slate-100">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: (props: ComponentPropsWithoutRef<"h1">) => (
                    <h1 className="text-2xl font-semibold text-white" {...props} />
                  ),
                  h2: (props: ComponentPropsWithoutRef<"h2">) => (
                    <h2 className="text-xl font-semibold text-white" {...props} />
                  ),
                  h3: (props: ComponentPropsWithoutRef<"h3">) => (
                    <h3 className="text-lg font-semibold text-slate-100" {...props} />
                  ),
                  p: (props: ComponentPropsWithoutRef<"p">) => (
                    <p className="leading-7 text-slate-100" {...props} />
                  ),
                  a: (props: ComponentPropsWithoutRef<"a">) => (
                    <a className="text-cyan-300 underline transition hover:text-cyan-200" {...props} />
                  ),
                  code: ({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode } & ComponentPropsWithoutRef<"code">) =>
                    inline ? (
                      <code className="rounded bg-slate-800 px-1 py-0.5 text-sm text-slate-100" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
                        <code {...props}>{children}</code>
                      </pre>
                    ),
                  li: (props: ComponentPropsWithoutRef<"li">) => (
                    <li className="ml-6 list-disc text-slate-100" {...props} />
                  ),
                  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
                    <blockquote className="rounded-xl border-l-4 border-cyan-400 bg-slate-950/80 px-4 py-3 italic text-slate-200" {...props} />
                  ),
                }}
              >
                {normalizeMarkdown(fileContent) || "This file is empty."}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">No file selected.</div>
          )}
        </div>
      </div>
    </section>
  );
}
