import type { HTMLAttributes, ReactNode } from "react";

export type TrendAnnotationTone = "negative" | "neutral";

export type TrendAnnotation = Readonly<{
  endIndex?: number;
  index?: number;
  label: ReactNode;
  startIndex?: number;
  tone?: TrendAnnotationTone;
}>;

export type TrendAxisTicks = readonly [ReactNode, ReactNode, ReactNode];

export type TrendProps = HTMLAttributes<HTMLElement> & {
  axisTicks: TrendAxisTicks;
  title?: ReactNode;
  values: ReadonlyArray<number>;
  annotation: TrendAnnotation;
};

export type TrendChartProps = Readonly<{
  annotation: TrendAnnotation;
  axisTicks: TrendAxisTicks;
  values: ReadonlyArray<number>;
}>;

const chartHeight = 56;
const chartBaselineY = 54;
const chartTopY = 8;
const chartRangeY = chartBaselineY - chartTopY;
const annotationBandHeight = `${(chartBaselineY / chartHeight) * 100}%`;

const annotationToneClasses: Record<
  TrendAnnotationTone,
  { band: string; label: string }
> = {
  negative: {
    band: "bg-[var(--figma-color-negative-color-background-negative-soft)]",
    label: "text-negative",
  },
  neutral: {
    band: "bg-background-neutral-soft",
    label: "text-text-meta",
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getTrendPoints(values: ReadonlyArray<number>) {
  if (values.length === 0) {
    return { points: "" };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const lastIndex = Math.max(values.length - 1, 1);
  const points = values.map((value, index) => {
    const x = (index / lastIndex) * 100;
    const y = chartBaselineY - ((value - min) / range) * chartRangeY;

    return { x, y };
  });

  return {
    points: points.map(({ x, y }) => `${x},${y}`).join(" "),
  };
}

function getIndexX(index: number, valuesLength: number) {
  const lastIndex = Math.max(valuesLength - 1, 1);

  return (index / lastIndex) * 100;
}

function getAnnotationSpan(annotation: TrendAnnotation, valuesLength: number) {
  const fallbackIndex = annotation.index ?? 0;
  const startIndex = Math.min(
    Math.max(annotation.startIndex ?? fallbackIndex, 0),
    Math.max(valuesLength - 1, 0),
  );
  const endIndex = Math.min(
    Math.max(annotation.endIndex ?? fallbackIndex, 0),
    Math.max(valuesLength - 1, 0),
  );
  const startX = getIndexX(Math.min(startIndex, endIndex), valuesLength);
  const endX = getIndexX(Math.max(startIndex, endIndex), valuesLength);

  return {
    left: startX,
    width: Math.max(endX - startX, 8),
  };
}

export function TrendChart({
  annotation,
  axisTicks,
  values,
}: TrendChartProps) {
  const { points } = getTrendPoints(values);
  const annotationTone = annotation.tone ?? "neutral";
  const annotationClasses = annotationToneClasses[annotationTone];
  const annotationSpan = getAnnotationSpan(annotation, values.length);

  return (
    <div className="w-full">
      <div className="relative h-[calc(var(--spacing-xxxl)*3)] w-full">
        <div
          className={cx(
            "absolute top-0 rounded-xs",
            annotationClasses.band,
          )}
          style={{
            height: annotationBandHeight,
            left: `${Number.isFinite(annotationSpan.left) ? annotationSpan.left : 0}%`,
            width: `${Number.isFinite(annotationSpan.width) ? annotationSpan.width : 8}%`,
          }}
        >
          {annotation.label ? (
            <span
              className={cx(
                "absolute left-1/2 top-xs -translate-x-1/2 whitespace-nowrap text-body-xs font-semibold",
                annotationClasses.label,
              )}
            >
              {annotation.label}
            </span>
          ) : null}
        </div>
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox={`0 0 100 ${chartHeight}`}
        >
          <line
            className="text-border-faint"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            x1="0"
            x2="100"
            y1={chartBaselineY}
            y2={chartBaselineY}
          />
          <polyline
            className="text-action"
            fill="none"
            points={points}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="mt-xxs flex items-center justify-between text-body-xs text-text-meta">
        {axisTicks.map((tick, index) => (
          <span
            className={cx(
              index === 1 ? "text-center" : "",
              index === 2 ? "text-right" : "",
            )}
            key={`${String(tick)}-${index}`}
          >
            {tick}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Trend({
  axisTicks,
  title,
  values,
  annotation,
  className,
  ...props
}: TrendProps) {
  return (
    <figure
      {...props}
      data-response-block="Trend"
      className={cx(
        "w-full rounded-sm border border-ai-border bg-background p-xl text-text shadow-raised-faint",
        className,
      )}
    >
      {title ? (
        <figcaption className="mb-xl text-control-md text-text">
          {title}
        </figcaption>
      ) : null}
      <TrendChart
        annotation={annotation}
        axisTicks={axisTicks}
        values={values}
      />
    </figure>
  );
}
