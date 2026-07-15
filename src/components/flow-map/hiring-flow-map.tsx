"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import Link from "next/link";

import { Icon } from "@/components/primitives/icon";

import {
  HighValueStateGallery,
  HiringFlowCheckpointScreen,
  MediumValueStateGallery,
  type HiringFlowCheckpoint,
} from "./hiring-flow-map-screens";

type ViewTransform = Readonly<{
  x: number;
  y: number;
  scale: number;
}>;

type FlowNodeProps = Readonly<{
  checkpoint: HiringFlowCheckpoint;
  compact?: boolean;
  summary: string;
  title: string;
  x: number;
  y: number;
}>;

type LaneHeaderProps = Readonly<{
  eyebrow: string;
  href: string;
  title: string;
  x: number;
  y: number;
}>;

type ConnectorProps = Readonly<{
  dashed?: boolean;
  label: string;
  labelX: number;
  labelY: number;
  path: string;
}>;

const BOARD_WIDTH = 10800;
const BOARD_HEIGHT = 7420;
const MIN_SCALE = 0.06;
const MAX_SCALE = 1.6;
const FIT_TOP_INSET = 112;
const FIT_EDGE_GAP = 24;

const FLOW_NODES: ReadonlyArray<FlowNodeProps> = [
  {
    checkpoint: "entry-choice",
    title: "Choose how to connect",
    summary: "The visitor opens Contact sales and chooses AI chat or a callback.",
    x: 200,
    y: 3540,
  },
  {
    checkpoint: "callback-form",
    title: "Share contact details",
    summary: "The visitor completes the existing sales callback form.",
    x: 1600,
    y: 420,
  },
  {
    checkpoint: "callback-success",
    title: "Contact request confirmed",
    summary: "LinkedIn confirms the request and still offers immediate AI help.",
    x: 3000,
    y: 420,
  },
  {
    checkpoint: "onboarding-signed-in",
    title: "Confirm lead details",
    summary: "Signed-in identity prefills the form; company context is still required.",
    x: 1600,
    y: 3540,
  },
  {
    checkpoint: "onboarding-signed-out",
    compact: true,
    title: "Signed-out variant",
    summary: "LinkedIn sign-in is offered before the same required form.",
    x: 1750,
    y: 4300,
  },
  {
    checkpoint: "welcome",
    title: "Begin the conversation",
    summary: "The concierge welcomes Jamie and offers clear starter prompts.",
    x: 3000,
    y: 3540,
  },
  {
    checkpoint: "high-qualification",
    title: "Urgent hiring ramp",
    summary: "Jamie shares large volume, specialized roles, and sourcing pressure.",
    x: 4500,
    y: 1580,
  },
  {
    checkpoint: "high-recommendation",
    title: "Recommend an AE meeting",
    summary: "The concierge commits to a consultant-led hiring plan.",
    x: 5900,
    y: 1580,
  },
  {
    checkpoint: "high-schedule",
    title: "Choose a meeting time",
    summary: "Jamie selects the meeting format, date, and time.",
    x: 8300,
    y: 1580,
  },
  {
    checkpoint: "high-booked",
    title: "AE meeting booked",
    summary: "The confirmed meeting becomes the clear terminal outcome.",
    x: 9700,
    y: 1580,
  },
  {
    checkpoint: "medium-qualification",
    title: "Manager-led hiring need",
    summary: "Jamie describes a few urgent roles without a dedicated recruiter.",
    x: 4500,
    y: 3540,
  },
  {
    checkpoint: "medium-recommendation",
    title: "Recommend an SDR handoff",
    summary: "Hiring Pro fits, and Jamie asks to speak with someone.",
    x: 5900,
    y: 3540,
  },
  {
    checkpoint: "medium-connected",
    title: "Specialist joins live chat",
    summary: "An available specialist enters the thread and continues in context.",
    x: 8300,
    y: 3540,
  },
  {
    checkpoint: "medium-schedule",
    title: "SDR unavailable — schedule a call",
    summary: "No SDR is online for a live handoff, so the concierge offers a scheduled conversation instead.",
    x: 8300,
    y: 4750,
  },
  {
    checkpoint: "medium-booked",
    title: "SDR meeting booked",
    summary: "The fallback ends with a confirmed specialist conversation.",
    x: 9700,
    y: 4750,
  },
  {
    checkpoint: "low-qualification",
    title: "One role for now",
    summary: "Jamie describes a one-off need and a preference to move independently.",
    x: 4500,
    y: 6540,
  },
  {
    checkpoint: "low-resources",
    title: "Recommend self-serve resources",
    summary: "The concierge provides a useful next step without a sales handoff.",
    x: 5900,
    y: 6540,
  },
];

const CONNECTORS: ReadonlyArray<ConnectorProps> = [
  {
    label: "Callback route",
    path: "M 920 3900 C 1240 3900 1260 780 1600 780",
    labelX: 1080,
    labelY: 2260,
  },
  {
    label: "AI concierge route",
    path: "M 920 3900 L 1600 3900",
    labelX: 1080,
    labelY: 3830,
  },
  {
    label: "Callback request submitted",
    path: "M 2320 780 L 3000 780",
    labelX: 2410,
    labelY: 710,
  },
  {
    dashed: true,
    label: "Continue to AI concierge",
    path: "M 3720 780 C 4050 780 3900 3220 2320 3900",
    labelX: 3700,
    labelY: 2320,
  },
  {
    label: "Begin qualification",
    path: "M 2320 3900 L 3000 3900",
    labelX: 2440,
    labelY: 3830,
  },
  {
    label: "Classify: High intent",
    path: "M 3720 3900 C 4100 3900 4100 1940 4500 1940",
    labelX: 3860,
    labelY: 2820,
  },
  {
    label: "Classify: Medium intent",
    path: "M 3720 3900 L 4500 3900",
    labelX: 3870,
    labelY: 3830,
  },
  {
    label: "Classify: Low intent",
    path: "M 3720 3900 C 4100 3900 4100 6900 4500 6900",
    labelX: 3860,
    labelY: 5360,
  },
  {
    label: "Route to AE meeting",
    path: "M 5220 1940 L 5900 1940",
    labelX: 5350,
    labelY: 1870,
  },
  {
    label: "Offer scheduling",
    path: "M 6620 1940 C 7200 1940 7650 2080 8300 2080",
    labelX: 7350,
    labelY: 1910,
  },
  {
    label: "Meeting confirmed",
    path: "M 9020 2080 C 9300 2080 9400 1940 9700 1940",
    labelX: 9180,
    labelY: 1870,
  },
  {
    label: "Route to SDR handoff",
    path: "M 5220 3900 L 5900 3900",
    labelX: 5320,
    labelY: 3830,
  },
  {
    label: "SDR available: Start live handoff",
    path: "M 6620 3900 L 8300 3900",
    labelX: 7100,
    labelY: 3830,
  },
  {
    label: "Live SDR unavailable: Offer scheduling",
    path: "M 6620 3980 C 7350 3980 7550 5250 8300 5250",
    labelX: 7100,
    labelY: 4580,
  },
  {
    label: "Meeting confirmed",
    path: "M 9020 5250 C 9300 5250 9400 5110 9700 5110",
    labelX: 9180,
    labelY: 5040,
  },
  {
    label: "Recommend self-serve",
    path: "M 5220 6900 L 5900 6900",
    labelX: 5350,
    labelY: 6830,
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function FlowNode({
  checkpoint,
  compact,
  summary,
  title,
  x,
  y,
}: FlowNodeProps) {
  return (
    <figure
      className="pointer-events-none absolute m-0"
      style={{ left: x, top: y, width: compact ? 450 : 720 }}
    >
      <figcaption className="mb-xl min-h-[136px] max-w-[700px]">
        <h3 className="text-[40px] font-semibold leading-[1.12] tracking-[-0.02em] text-text">
          {title}
        </h3>
        <p className="mt-sm text-[22px] leading-[1.45] text-text-meta">
          {summary}
        </p>
      </figcaption>
      <HiringFlowCheckpointScreen checkpoint={checkpoint} compact={compact} />
    </figure>
  );
}

function LaneHeader({ eyebrow, href, title, x, y }: LaneHeaderProps) {
  return (
    <section
      className="absolute flex w-[980px] items-end justify-between border-b-[3px] border-action/25 pb-lg"
      style={{ left: x, top: y }}
    >
      <div>
        <p className="text-[18px] font-semibold tracking-[0.08em] text-action uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-sm text-[48px] font-semibold leading-[1.08] tracking-[-0.02em] text-text">
          {title}
        </h2>
      </div>
      <Link
        data-canvas-control
        href={href}
        className="pointer-events-auto inline-flex h-12 items-center gap-sm rounded-round border border-action bg-background px-xl text-[18px] font-semibold text-action shadow-sm transition-colors hover:bg-action-background-transparent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
      >
        Open full flow
        <Icon name="arrow-right" size="small" />
      </Link>
    </section>
  );
}

function ConnectorLabels() {
  return (
    <>
      {CONNECTORS.map((connector) => (
        <span
          key={`${connector.label}-${connector.labelX}-${connector.labelY}`}
          className="pointer-events-none absolute rounded-round border border-border-faint bg-background px-lg py-md text-[22px] font-semibold leading-none text-text-meta shadow-sm"
          style={{ left: connector.labelX, top: connector.labelY }}
        >
          {connector.label}
        </span>
      ))}
    </>
  );
}

function BoardConnectors() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible"
      width={BOARD_WIDTH}
      height={BOARD_HEIGHT}
      viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
    >
      <defs>
        <marker
          id="flow-map-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="rgba(0, 0, 0, 0.4)" />
        </marker>
      </defs>
      {CONNECTORS.map((connector) => (
        <path
          key={connector.path}
          d={connector.path}
          fill="none"
          stroke="rgba(0, 0, 0, 0.32)"
          strokeWidth="3.5"
          strokeDasharray={connector.dashed ? "14 12" : undefined}
          markerEnd="url(#flow-map-arrow)"
        />
      ))}
    </svg>
  );
}

function StateGallery({
  children,
  summary,
  title,
  x,
  y,
}: Readonly<{
  children: ReactNode;
  summary: string;
  title: string;
  x: number;
  y: number;
}>) {
  return (
    <section
      className="pointer-events-none absolute"
      style={{ left: x, top: y }}
    >
      <div className="mb-lg">
        <h3 className="text-[34px] font-semibold leading-tight tracking-[-0.01em] text-text">
          {title}
        </h3>
        <p className="mt-sm text-[20px] leading-relaxed text-text-meta">
          {summary}
        </p>
      </div>
      {children}
    </section>
  );
}

function CanvasButton({
  children,
  label,
  onClick,
}: Readonly<{
  children: ReactNode;
  label: string;
  onClick: () => void;
}>) {
  return (
    <button
      data-canvas-control
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-9 min-w-9 items-center justify-center rounded-round border border-border-faint bg-background px-md text-control-sm text-text shadow-sm transition-colors hover:bg-background-transparent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
    >
      {children}
    </button>
  );
}

export function HiringFlowMap() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const transformRef = useRef<ViewTransform>({ x: 48, y: 48, scale: 0.1 });
  const dragRef = useRef<
    | Readonly<{
        pointerId: number;
        startClientX: number;
        startClientY: number;
        startX: number;
        startY: number;
      }>
    | undefined
  >(undefined);
  const hasInteractedRef = useRef(false);
  const [view, setView] = useState<ViewTransform>({
    x: 48,
    y: 48,
    scale: 0.1,
  });
  const [isPanning, setIsPanning] = useState(false);

  const constrain = useCallback((candidate: ViewTransform): ViewTransform => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return candidate;
    }

    const rect = viewport.getBoundingClientRect();
    const margin = Math.min(180, Math.max(72, rect.width * 0.14));
    const scaledWidth = BOARD_WIDTH * candidate.scale;
    const scaledHeight = BOARD_HEIGHT * candidate.scale;
    const x =
      scaledWidth <= rect.width - margin * 2
        ? (rect.width - scaledWidth) / 2
        : clamp(candidate.x, rect.width - scaledWidth - margin, margin);
    const y =
      scaledHeight <= rect.height - margin * 2
        ? (rect.height - scaledHeight) / 2
        : clamp(candidate.y, rect.height - scaledHeight - margin, margin);

    return { ...candidate, x, y };
  }, []);

  const commitView = useCallback(
    (candidate: ViewTransform) => {
      const next = constrain(candidate);
      transformRef.current = next;
      setView(next);
    },
    [constrain],
  );

  const fitToMap = useCallback(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const scale = clamp(
      Math.min(
        (rect.width - FIT_EDGE_GAP * 2) / BOARD_WIDTH,
        (rect.height - FIT_TOP_INSET - FIT_EDGE_GAP) / BOARD_HEIGHT,
      ),
      MIN_SCALE,
      MAX_SCALE,
    );

    commitView({
      scale,
      x: (rect.width - BOARD_WIDTH * scale) / 2,
      y: FIT_TOP_INSET,
    });
  }, [commitView]);

  const zoomAt = useCallback(
    (nextScaleValue: number, clientX: number, clientY: number) => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      const rect = viewport.getBoundingClientRect();
      const current = transformRef.current;
      const nextScale = clamp(nextScaleValue, MIN_SCALE, MAX_SCALE);
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      const boardX = (localX - current.x) / current.scale;
      const boardY = (localY - current.y) / current.scale;

      commitView({
        scale: nextScale,
        x: localX - boardX * nextScale,
        y: localY - boardY * nextScale,
      });
    },
    [commitView],
  );

  const zoomBy = useCallback(
    (factor: number) => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      const rect = viewport.getBoundingClientRect();
      hasInteractedRef.current = true;
      zoomAt(
        transformRef.current.scale * factor,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
    },
    [zoomAt],
  );

  const focusLane = useCallback(
    (boardX: number, boardY: number, scale: number) => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      const rect = viewport.getBoundingClientRect();
      hasInteractedRef.current = true;
      commitView({
        scale,
        x: rect.width / 2 - boardX * scale,
        y: rect.height / 2 - boardY * scale,
      });
    },
    [commitView],
  );

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      hasInteractedRef.current = true;

      if (event.ctrlKey) {
        const zoomFactor = Math.exp(-event.deltaY * 0.012);
        zoomAt(
          transformRef.current.scale * zoomFactor,
          event.clientX,
          event.clientY,
        );
        return;
      }

      commitView({
        ...transformRef.current,
        x: transformRef.current.x - event.deltaX,
        y: transformRef.current.y - event.deltaY,
      });
    }

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [commitView, zoomAt]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    fitToMap();
    const observer = new ResizeObserver(() => {
      if (!hasInteractedRef.current) {
        fitToMap();
      }
    });
    observer.observe(viewport);

    return () => observer.disconnect();
  }, [fitToMap]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (
      event.button !== 0 &&
      event.button !== 1
    ) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest("[data-canvas-control]")) {
      return;
    }

    hasInteractedRef.current = true;
    dragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: transformRef.current.x,
      startY: transformRef.current.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPanning(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    commitView({
      ...transformRef.current,
      x: drag.startX + event.clientX - drag.startClientX,
      y: drag.startY + event.clientY - drag.startClientY,
    });
  }

  function endPointerDrag(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = undefined;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsPanning(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "0") {
      event.preventDefault();
      hasInteractedRef.current = false;
      fitToMap();
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomBy(1.16);
    } else if (event.key === "-") {
      event.preventDefault();
      zoomBy(1 / 1.16);
    }
  }

  return (
    <main className="relative h-[calc(100dvh-7rem)] min-h-[560px] overflow-hidden bg-background-neutral-soft sm:h-[calc(100dvh-8rem)]">
      <div
        ref={viewportRef}
        role="application"
        aria-label="Hiring concierge flow map. Pinch to zoom and use two fingers to pan."
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
        className={[
          "absolute inset-0 touch-none overflow-hidden outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-action-focus-ring",
          isPanning ? "cursor-grabbing select-none" : "cursor-grab",
        ].join(" ")}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.13) 1px, transparent 1px)",
          backgroundPosition: `${view.x}px ${view.y}px`,
          backgroundSize: `${32 * view.scale}px ${32 * view.scale}px`,
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
          }}
        >
          <BoardConnectors />

          <LaneHeader
            eyebrow="Alternate contact path"
            title="Sales callback"
            href="/hiring?contactSales=open"
            x={1560}
            y={120}
          />
          <LaneHeader
            eyebrow="AI concierge entry"
            title="Shared beginning"
            href="/hiring"
            x={1560}
            y={3250}
          />
          <LaneHeader
            eyebrow="Internal routing tier"
            title="AE meeting · High value"
            href="/internal/flows/high"
            x={4460}
            y={1300}
          />
          <LaneHeader
            eyebrow="Internal routing tier"
            title="SDR handoff · Medium value"
            href="/internal/flows/medium/available"
            x={4460}
            y={3250}
          />
          <LaneHeader
            eyebrow="Internal routing tier"
            title="Self-serve · Low value"
            href="/internal/flows/low"
            x={4460}
            y={6250}
          />

          {FLOW_NODES.map((node) => (
            <FlowNode key={node.checkpoint} {...node} />
          ))}

          <StateGallery
            title="Consultant match card states"
            summary="Every meaningful state remains visible without repeating the full shell."
            x={5900}
            y={2520}
          >
            <HighValueStateGallery />
          </StateGallery>
          <StateGallery
            title="Live handoff and fallback card states"
            summary="Availability, connection, failure, and booked outcomes are shown together."
            x={4500}
            y={4300}
          >
            <MediumValueStateGallery />
          </StateGallery>

          <ConnectorLabels />
        </div>

        <div
          data-canvas-control
          className="pointer-events-auto absolute left-4 top-4 z-20 max-w-[min(620px,calc(100%-32px))] rounded-2xl border border-border-faint bg-background/95 p-lg shadow-raised-faint backdrop-blur-xl sm:left-6 sm:top-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-lg">
            <div>
              <p className="text-heading-lg text-text">Hiring flow map</p>
              <p className="mt-xs text-body-sm text-text-meta">
                Two-finger pan · Pinch to zoom · Press 0 to fit
              </p>
            </div>
            <div className="flex flex-wrap gap-xs">
              <button
                data-canvas-control
                type="button"
                onClick={() => focusLane(2600, 450, 0.3)}
                className="h-8 rounded-round bg-background-neutral-soft px-md text-control-sm text-text-meta hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              >
                Callback
              </button>
              <button
                data-canvas-control
                type="button"
                onClick={() => focusLane(6500, 1900, 0.28)}
                className="h-8 rounded-round bg-background-neutral-soft px-md text-control-sm text-text-meta hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              >
                High
              </button>
              <button
                data-canvas-control
                type="button"
                onClick={() => focusLane(6500, 3900, 0.26)}
                className="h-8 rounded-round bg-background-neutral-soft px-md text-control-sm text-text-meta hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              >
                Medium
              </button>
              <button
                data-canvas-control
                type="button"
                onClick={() => focusLane(5600, 6500, 0.32)}
                className="h-8 rounded-round bg-background-neutral-soft px-md text-control-sm text-text-meta hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              >
                Low
              </button>
            </div>
          </div>
        </div>

        <div
          data-canvas-control
          className="pointer-events-auto absolute bottom-5 right-5 z-20 flex items-center gap-xs rounded-round border border-border-faint bg-background/95 p-xs shadow-raised-faint backdrop-blur-xl sm:bottom-6 sm:right-6"
        >
          <CanvasButton label="Fit map to view" onClick={() => {
            hasInteractedRef.current = false;
            fitToMap();
          }}>
            Fit
          </CanvasButton>
          <CanvasButton label="Zoom out" onClick={() => zoomBy(1 / 1.16)}>
            <span aria-hidden="true" className="text-[20px] leading-none">−</span>
          </CanvasButton>
          <span className="min-w-14 px-sm text-center text-control-sm text-text-meta">
            {Math.round(view.scale * 100)}%
          </span>
          <CanvasButton label="Zoom in" onClick={() => zoomBy(1.16)}>
            <span aria-hidden="true" className="text-[20px] leading-none">+</span>
          </CanvasButton>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-20 z-30 rounded-md border border-border-faint bg-background p-lg text-center shadow-raised-faint md:hidden">
        <p className="text-heading-md text-text">Best viewed on desktop</p>
        <p className="mt-xs text-body-sm text-text-meta">
          This review map is intentionally composed for trackpad navigation.
        </p>
      </div>
    </main>
  );
}
