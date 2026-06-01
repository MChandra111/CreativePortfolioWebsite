// components/VaultGraph.tsx
"use client"; // Next.js App Router — remove if using Pages Router

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

// ── Types (mirror parseVault.ts) ──────────────────────────────────────────────

export interface NoteNode {
  id: string;
  label: string;
  linkCount: number;
  path: string;
  tags: string[];
  // D3 injects these at runtime
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface NoteLink {
  source: string | NoteNode; // string before sim, NoteNode after
  target: string | NoteNode;
}

export interface GraphData {
  nodes: NoteNode[];
  links: NoteLink[];
}

// ── Colour palette: simplified to a single unified color
// Previously nodes were coloured per-folder group. That separation
// is removed so nodes no longer need distinct folder/group ids.
// Use a neutral gray for all nodes
const FALLBACK_COLOR = "#9CA3AF";

function groupColor(): string {
  return FALLBACK_COLOR;
}

function nodeRadius(n: NoteNode): number {
  // Hub-like notes (many links) are larger
  return Math.max(5, Math.min(14, 5 + n.linkCount * 0.8));
}

// ── Component ─────────────────────────────────────────────────────────────────

interface VaultGraphProps {
  /** URL of the JSON produced by parseVault.ts — defaults to /graph-data.json */
  dataUrl?: string;
  /** Called when the user clicks a node */
  onNodeClick?: (node: NoteNode) => void;
  className?: string;
}

export default function VaultGraph({
  dataUrl = "/graph-data.json",
  onNodeClick,
  className = "",
}: VaultGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<d3.Simulation<NoteNode, NoteLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<HTMLCanvasElement, unknown> | null>(null);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const highlightRef = useRef<string | null>(null);
  const onNodeClickRef = useRef<typeof onNodeClick>(onNodeClick);

  useEffect(() => {
    onNodeClickRef.current = onNodeClick;
  }, [onNodeClick]);

  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<NoteNode | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

  // ── Fetch data ──────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch(dataUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load graph data (${r.status})`);
        return r.json() as Promise<GraphData>;
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [dataUrl]);

  // ── Draw ────────────────────────────────────────────────────────────────────

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      nodes: NoteNode[],
      links: NoteLink[],
      selectedId: string | null,
      t: d3.ZoomTransform,
      W: number,
      H: number
    ) => {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.scale(t.k, t.k);

      const selectedNeighbors = new Set<string>();
      if (selectedId) {
        links.forEach((l) => {
          const s = (l.source as NoteNode).id;
          const tgt = (l.target as NoteNode).id;
          if (s === selectedId) selectedNeighbors.add(tgt);
          if (tgt === selectedId) selectedNeighbors.add(s);
        });
      }

      // Draw links (highlight ONLY those directly connected to the selected node)
      links.forEach((l) => {
        const src = l.source as NoteNode;
        const tgt = l.target as NoteNode;
        if (src.x == null || tgt.x == null) return;

        const isHighlighted = selectedId && (src.id === selectedId || tgt.id === selectedId);

        ctx.beginPath();
        ctx.moveTo(src.x, src.y!);
        ctx.lineTo(tgt.x, tgt.y!);
        ctx.strokeStyle = isHighlighted ? "rgba(127,119,221,0.7)" : "rgba(128,128,128,0.18)";
        ctx.lineWidth = isHighlighted ? 1.5 : 0.8;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((n) => {
        if (n.x == null) return;
        const r = nodeRadius(n);
        const color = groupColor();
        const isSelected = n.id === selectedId;
        const isNeighbor = selectedNeighbors.has(n.id);
        const dimmed = selectedId && !isSelected && !isNeighbor;

        ctx.beginPath();
        ctx.arc(n.x, n.y!, r, 0, Math.PI * 2);
        ctx.fillStyle = dimmed ? color + "33" : color + "cc";
        ctx.fill();

        if (isSelected || isNeighbor) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Label: always show for selected/neighbors + large nodes
        const showLabel = isSelected || isNeighbor || n.linkCount >= 4;
        if (showLabel && !dimmed) {
          ctx.fillStyle = isSelected ? "#ffffff" : "rgba(200,200,200,0.9)";
          ctx.font = `${isSelected ? 500 : 400} ${isSelected ? 12 : 10}px system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y! + r + 11);
        }
      });

      ctx.restore();
    },
    []
  );

  // ── Set up simulation ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!data || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d")!;
    let W = container.clientWidth;
    let H = container.clientHeight;
    canvas.width = W;
    canvas.height = H;

    // Deep-clone nodes so D3 can mutate them
    const nodes: NoteNode[] = data.nodes.map((n) => ({ ...n }));
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const links: NoteLink[] = data.links.map((l) => ({
      source: nodeMap.get(l.source as string)!,
      target: nodeMap.get(l.target as string)!,
    }));

    const redraw = () =>
      draw(ctx, nodes, links, highlightRef.current, transformRef.current, W, H);

    const sim = d3
      .forceSimulation<NoteNode>(nodes)
      // increase link distance so connected nodes sit further apart
      .force("link", d3.forceLink<NoteNode, NoteLink>(links).distance(160).strength(0.6))
      // moderate repulsion so nodes don't clump but remain responsive
      .force("charge", d3.forceManyBody<NoteNode>().strength(-100))
      .force("center", d3.forceCenter(W / 2, H / 2))
      // larger collision padding to maintain readable spacing after drag
      .force("collision", d3.forceCollide<NoteNode>((n) => nodeRadius(n) + 12))
      .on("tick", redraw);

    simRef.current = sim;

    // ── Hit testing ───────────────────────────────────────────────────────────

    function getNodeAt(ex: number, ey: number): NoteNode | undefined {
      const t = transformRef.current;
      const mx = (ex - t.x) / t.k;
      const my = (ey - t.y) / t.k;
      return nodes.find(
        (n) => n.x != null && Math.hypot(n.x - mx, n.y! - my) < nodeRadius(n) + 6
      );
    }

    // ── Zoom & pan (only when NOT over a node) ────────────────────────────────

    const zoom = d3
      .zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.2, 4])
      .filter((event) => {
        // Allow wheel zoom always; allow pan only when pointer is not on a node
        if (event.type === "wheel") return true;
        return !getNodeAt(event.offsetX, event.offsetY);
      })
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        redraw();
      });

    d3.select(canvas).call(zoom);
    zoomRef.current = zoom;

    // ── Drag (manual pointer events, bypasses zoom entirely) ──────────────────

    let dragNode: NoteNode | null = null;
    let dragMoved = false;

    canvas.addEventListener("pointerdown", (e) => {
      const n = getNodeAt(e.offsetX, e.offsetY);
      if (!n) return;
      e.stopPropagation(); // prevent zoom from seeing this event
      dragNode = n;
      dragMoved = false;
      canvas.setPointerCapture(e.pointerId);
      sim.alphaTarget(0.3).restart();
      n.fx = n.x;
      n.fy = n.y;
      canvas.style.cursor = "grabbing";
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!dragNode) return;
      dragMoved = true;
      const t = transformRef.current;
      dragNode.fx = (e.offsetX - t.x) / t.k;
      dragNode.fy = (e.offsetY - t.y) / t.k;
    });

    const stopDrag = () => {
      if (!dragNode) return;
      dragNode.fx = null;
      dragNode.fy = null;
      dragNode = null;
      sim.alphaTarget(0);
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerup", stopDrag);
    canvas.addEventListener("pointercancel", stopDrag);

    // ── Click (select node) ───────────────────────────────────────────────────

    canvas.addEventListener("click", (e) => {
      if (dragMoved) {
        dragMoved = false;
        return;
      }

      const n = getNodeAt(e.offsetX, e.offsetY);
      if (n) {
        // Do not toggle a persistent selection; only notify via callback
        if (onNodeClickRef.current) onNodeClickRef.current(n);
      } else {
        // clicking empty space clears any explicit selection state
        setSelected(null);
      }
      redraw();
    });

    // ── Hover / tooltip ───────────────────────────────────────────────────────

    canvas.addEventListener("mousemove", (e) => {
      const n = getNodeAt(e.offsetX, e.offsetY);
      setHovered(n ?? null);
      // update the highlight ref so the simulation redraw uses hover
      highlightRef.current = n ? n.id : null;
      if (n) {
        setTooltip({ x: e.offsetX + 14, y: e.offsetY - 8 });
        canvas.style.cursor = "pointer";
      } else {
        setTooltip(null);
        canvas.style.cursor = "grab";
      }
    });

    canvas.addEventListener("mouseleave", () => {
      setHovered(null);
      setTooltip(null);
    });

    // ── Resize ────────────────────────────────────────────────────────────────

    const ro = new ResizeObserver(() => {
      W = container.clientWidth;
      H = container.clientHeight;
      canvas.width = W;
      canvas.height = H;
      sim.force("center", d3.forceCenter(W / 2, H / 2));
      sim.alpha(0.3).restart();
    });
    ro.observe(container);

    return () => {
      sim.stop();
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, draw]);

  // Keep draw in sync with `selected` state without re-running the whole effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !data) return;
    const ctx = canvas.getContext("2d")!;
    const W = container.clientWidth;
    const H = container.clientHeight;

    // Re-fetch the live node/link arrays from the simulation
    const sim = simRef.current;
    if (!sim) return;
    const nodes = sim.nodes();

    const links = sim.force<d3.ForceLink<NoteNode, NoteLink>>("link")!.links();
    // Use the hover-driven highlight instead of click-based selection
    draw(ctx, nodes, links, highlightRef.current, transformRef.current, W, H);
  }, [hovered, data, draw]);

  // Legend removed — groups are no longer displayed.

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={`relative w-full h-full flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10 text-xs text-neutral-400">
        <span>Drag nodes · Scroll to zoom · Click to select</span>
        <button
          className="ml-auto px-2 py-0.5 rounded border border-white/20 hover:bg-white/10 transition"
          onClick={() => {
            transformRef.current = d3.zoomIdentity;
            setSelected(null);
            setHovered(null);
            highlightRef.current = null;
            const sim = simRef.current;
            if (sim) {
              sim.nodes().forEach((node) => {
                node.fx = null;
                node.fy = null;
              });
              sim.alpha(0);
              sim.alphaTarget(0);
              sim.stop();
            }
            if (canvasRef.current && zoomRef.current) {
              d3.select(canvasRef.current).call(zoomRef.current.transform, d3.zoomIdentity);
            }
          }}
        >
          Reset
        </button>
      </div>

      {/* Canvas container */}
      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
            Loading graph…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-red-400">
            {error}
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-full select-none"
          style={{ cursor: "grab", touchAction: "none", userSelect: "none" }}
        />

        {/* Tooltip */}
        {hovered && tooltip && (
          <div
            className="pointer-events-none select-none absolute z-10 rounded-md border border-white/20 bg-black/80 px-2.5 py-1.5 text-xs text-white backdrop-blur"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <span className="font-medium">{hovered.label}</span>
            <span className="ml-2 text-neutral-400">
              {hovered.linkCount} link{hovered.linkCount !== 1 ? "s" : ""}
            </span>
            {hovered.tags.length > 0 && (
              <div className="mt-0.5 text-neutral-500">
                {hovered.tags.join(", ")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend removed */}
    </div>
  );
}
