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

const BOARD_WIDTH = 8340;
const BOARD_HEIGHT = 5750;
const MIN_SCALE = 0.075;
const MAX_SCALE = 1.6;
const FIT_TOP_INSET = 112;
const FIT_EDGE_GAP = 24;

const FLOW_NODES: ReadonlyArray<FlowNodeProps> = [
  {
    checkpoint: "entry-choice",
    title: "Choose how to connect",
    summary: "The visitor opens Contact sales and chooses AI chat or a callback.",
    x: 180,
    y: 2700,
  },
  {
    checkpoint: "callback-form",
    title: "Share contact details",
    summary: "The visitor completes the existing sales callback form.",
    x: 1180,
    y: 280,
  },
  {
    checkpoint: "callback-success",
    title: "Contact request confirmed",
    summary: "LinkedIn confirms the request and still offers immediate AI help.",
    x: 2260,
    y: 280,
  },
  {
    checkpoint: "onboarding-signed-in",
    title: "Confirm lead details",
    summary: "Signed-in identity prefills the form; company context is still required.",
    x: 1180,
    y: 2700,
  },
  {
    checkpoint: "onboarding-signed-out",
    compact: true,
    title: "Signed-out variant",
    summary: "LinkedIn sign-in is offered before the same required form.",
    x: 1310,
    y: 3310,
  },
  {
    checkpoint: "welcome",
    title: "Begin the conversation",
    summary: "The concierge welcomes Jamie and offers clear starter prompts.",
    x: 2260,
    y: 2700,
  },
  {
    checkpoint: "high-qualification",
    title: "Urgent hiring ramp",
    summary: "Jamie shares large volume, specialized roles, and sourcing pressure.",
    x: 3350,
    y: 900,
  },
  {
    checkpoint: "high-recommendation",
    title: "Recommend an AE meeting",
    summary: "The concierge commits to a consultant-led hiring plan.",
    x: 4380,
    y: 900,
  },
  {
    checkpoint: "high-schedule",
    title: "Choose a meeting time",
    summary: "Jamie selects the meeting format, date, and time.",
    x: 6500,
    y: 900,
  },
  {
    checkpoint: "high-booked",
    title: "AE meeting booked",
    summary: "The confirmed meeting becomes the clear terminal outcome.",
    x: 7500,
    y: 900,
  },
  {
    checkpoint: "medium-qualification",
    title: "Manager-led hiring need",
    summary: "Jamie describes a few urgent roles without a dedicated recruiter.",
    x: 3350,
    y: 2800,
  },
  {
    checkpoint: "medium-recommendation",
    title: "Recommend an SDR handoff",
    summary: "Hiring Pro fits, and Jamie asks to speak with someone.",
    x: 4380,
    y: 2800,
  },
  {
    checkpoint: "medium-connected",
    title: "Specialist joins live chat",
    summary: "An available specialist enters the thread and continues in context.",
    x: 6500,
    y: 2800,
  },
  {
    checkpoint: "medium-schedule",
    title: "Schedule the fallback",
    summary: "Unavailable or failed live chat resolves to the same scheduling path.",
    x: 6500,
    y: 4050,
  },
  {
    checkpoint: "medium-booked",
    title: "SDR meeting booked",
    summary: "The fallback ends with a confirmed specialist conversation.",
    x: 7500,
    y: 4050,
  },
  {
    checkpoint: "low-qualification",
    title: "One role for now",
    summary: "Jamie describes a one-off need and a preference to move independently.",
    x: 3350,
    y: 5100,
  },
  {
    checkpoint: "low-resources",
    title: "Recommend self-serve resources",
    summary: "The concierge provides a useful next step without a sales handoff.",
    x: 4380,
    y: 5100,
  },
];

const CONNECTORS: ReadonlyArray<ConnectorProps> = [
  {
    label: "Have someone contact me",
    path: "M 900 2990 C 1040 2990 980 570 1180 570",
    labelX: 930,
    labelY: 1620,
  },
  {
    label: "Chat with AI assistant",
    path: "M 900 2990 L 1180 2990",
    labelX: 930,
    labelY: 2945,
  },
  {
    label: "Submit",
    path: "M 1900 570 L 2260 570",
    labelX: 2010,
    labelY: 525,
  },
  {
    dashed: true,
    label: "Chat with AI",
    path: "M 2980 570 C 3220 570 3070 2490 1900 2990",
    labelX: 2920,
    labelY: 1710,
  },
  {
    label: "Start chat",
    path: "M 1900 2990 L 2260 2990",
    labelX: 2015,
    labelY: 2945,
  },
  {
    label: "Large hiring ramp",
    path: "M 2980 2990 C 3180 2990 3150 1190 3350 1190",
    labelX: 3060,
    labelY: 2030,
  },
  {
    label: "A few manager-led roles",
    path: "M 2980 2990 L 3350 3090",
    labelX: 3030,
    labelY: 2980,
  },
  {
    label: "One role for now",
    path: "M 2980 2990 C 3180 2990 3150 5390 3350 5390",
    labelX: 3060,
    labelY: 4220,
  },
  {
    label: "Shares urgency and sourcing needs",
    path: "M 4070 1190 L 4380 1190",
    labelX: 4090,
    labelY: 1145,
  },
  {
    label: "Find a consultant",
    path: "M 5100 1190 L 6500 1190",
    labelX: 5600,
    labelY: 1145,
  },
  {
    label: "Confirm meeting",
    path: "M 7220 1190 L 7500 1190",
    labelX: 7260,
    labelY: 1145,
  },
  {
    label: "Asks to speak with someone",
    path: "M 4070 3090 L 4380 3090",
    labelX: 4090,
    labelY: 3045,
  },
  {
    label: "Chat now",
    path: "M 5100 3090 L 6500 3090",
    labelX: 5640,
    labelY: 3045,
  },
  {
    label: "Live chat unavailable or interrupted",
    path: "M 5100 3150 C 5940 3150 5900 4340 6500 4340",
    labelX: 5500,
    labelY: 3690,
  },
  {
    label: "Confirm meeting",
    path: "M 7220 4340 L 7500 4340",
    labelX: 7260,
    labelY: 4295,
  },
  {
    label: "Moves at their own pace",
    path: "M 4070 5390 L 4380 5390",
    labelX: 4090,
    labelY: 5345,
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
      <figcaption className="mb-lg min-h-[76px] max-w-[640px]">
        <h3 className="text-[24px] font-semibold leading-tight text-text">
          {title}
        </h3>
        <p className="mt-xs text-[16px] leading-relaxed text-text-meta">
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
      className="absolute flex w-[720px] items-end justify-between border-b-2 border-action/25 pb-md"
      style={{ left: x, top: y }}
    >
      <div>
        <p className="text-[14px] font-semibold tracking-[0.08em] text-action uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-xs text-[32px] font-semibold leading-tight text-text">
          {title}
        </h2>
      </div>
      <Link
        data-canvas-control
        href={href}
        className="pointer-events-auto inline-flex h-10 items-center gap-xs rounded-round border border-action bg-background px-lg text-control-sm text-action shadow-sm transition-colors hover:bg-action-background-transparent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
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
          className="pointer-events-none absolute rounded-round border border-border-faint bg-background px-md py-sm text-[14px] font-medium leading-none text-text-meta shadow-sm"
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
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 12 6 L 0 12 z" fill="rgba(0, 0, 0, 0.45)" />
        </marker>
      </defs>
      {CONNECTORS.map((connector) => (
        <path
          key={connector.path}
          d={connector.path}
          fill="none"
          stroke="rgba(0, 0, 0, 0.32)"
          strokeWidth="4"
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
        <h3 className="text-[22px] font-semibold leading-tight text-text">
          {title}
        </h3>
        <p className="mt-xs text-[15px] text-text-meta">{summary}</p>
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
            x={1140}
            y={90}
          />
          <LaneHeader
            eyebrow="AI concierge entry"
            title="Shared beginning"
            href="/hiring"
            x={1140}
            y={2500}
          />
          <LaneHeader
            eyebrow="Internal routing tier"
            title="AE meeting · High value"
            href="/internal/flows/high"
            x={3310}
            y={690}
          />
          <LaneHeader
            eyebrow="Internal routing tier"
            title="SDR handoff · Medium value"
            href="/internal/flows/medium/available"
            x={3310}
            y={2590}
          />
          <LaneHeader
            eyebrow="Internal routing tier"
            title="Self-serve · Low value"
            href="/internal/flows/low"
            x={3310}
            y={4890}
          />

          {FLOW_NODES.map((node) => (
            <FlowNode key={node.checkpoint} {...node} />
          ))}

          <StateGallery
            title="Consultant match card states"
            summary="Every meaningful state remains visible without repeating the full shell."
            x={4380}
            y={1510}
          >
            <HighValueStateGallery />
          </StateGallery>
          <StateGallery
            title="Live handoff and fallback card states"
            summary="Availability, connection, failure, and booked outcomes are shown together."
            x={3350}
            y={3470}
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
                onClick={() => focusLane(1800, 750, 0.2)}
                className="h-8 rounded-round bg-background-neutral-soft px-md text-control-sm text-text-meta hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              >
                Callback
              </button>
              <button
                data-canvas-control
                type="button"
                onClick={() => focusLane(5250, 1500, 0.16)}
                className="h-8 rounded-round bg-background-neutral-soft px-md text-control-sm text-text-meta hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              >
                High
              </button>
              <button
                data-canvas-control
                type="button"
                onClick={() => focusLane(5250, 3600, 0.16)}
                className="h-8 rounded-round bg-background-neutral-soft px-md text-control-sm text-text-meta hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              >
                Medium
              </button>
              <button
                data-canvas-control
                type="button"
                onClick={() => focusLane(4300, 5350, 0.2)}
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
