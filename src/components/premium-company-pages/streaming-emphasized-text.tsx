"use client";

import { StreamingText } from "./response-blocks/Text";

export type StreamingTextLink = Readonly<{
  href?: string;
  label: string;
  onSelect?: () => void;
}>;

type StreamingTextSegment = Readonly<{
  kind: "highlight" | "link" | "text";
  link?: StreamingTextLink;
  text: string;
}>;

type TextMatch = Readonly<{
  index: number;
  kind: "highlight" | "link";
  label: string;
  link?: StreamingTextLink;
}>;

export function splitTextBlocks(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function findNextMatch(
  text: string,
  highlights: ReadonlyArray<string>,
  links: ReadonlyArray<StreamingTextLink>,
) {
  const matches: Array<TextMatch> = [
    ...links
      .filter((link) => link.label.length > 0)
      .map((link) => ({
        index: text.indexOf(link.label),
        kind: "link" as const,
        label: link.label,
        link,
      })),
    ...highlights
      .filter((label) => label.length > 0)
      .map((label) => ({
        index: text.indexOf(label),
        kind: "highlight" as const,
        label,
      })),
  ];

  return matches.reduce<TextMatch | null>((currentMatch, match) => {
    if (match.index === -1) {
      return currentMatch;
    }

    if (currentMatch === null || match.index < currentMatch.index) {
      return match;
    }

    if (match.index > currentMatch.index) {
      return currentMatch;
    }

    if (match.kind === "link" && currentMatch.kind !== "link") {
      return match;
    }

    if (
      match.kind === currentMatch.kind &&
      match.label.length > currentMatch.label.length
    ) {
      return match;
    }

    return currentMatch;
  }, null);
}

export function segmentStreamingText({
  highlights = [],
  links = [],
  text,
}: Readonly<{
  highlights?: ReadonlyArray<string>;
  links?: ReadonlyArray<StreamingTextLink>;
  text: string;
}>): ReadonlyArray<StreamingTextSegment> {
  const segments: Array<StreamingTextSegment> = [];
  let remainingText = text;

  while (remainingText.length > 0) {
    const nextMatch = findNextMatch(remainingText, highlights, links);

    if (!nextMatch) {
      segments.push({ kind: "text", text: remainingText });
      break;
    }

    if (nextMatch.index > 0) {
      segments.push({
        kind: "text",
        text: remainingText.slice(0, nextMatch.index),
      });
    }

    segments.push({
      kind: nextMatch.kind,
      link: nextMatch.link,
      text: nextMatch.label,
    });
    remainingText = remainingText.slice(nextMatch.index + nextMatch.label.length);
  }

  return segments;
}

export function InlineStreamingText({
  isStreaming,
  text,
}: Readonly<{
  isStreaming: boolean;
  text: string;
}>) {
  return isStreaming ? <StreamingText text={text} /> : <>{text}</>;
}

export function StreamingEmphasizedText({
  highlights = [],
  isStreaming,
  links = [],
  text,
}: Readonly<{
  highlights?: ReadonlyArray<string>;
  isStreaming: boolean;
  links?: ReadonlyArray<StreamingTextLink>;
  text: string;
}>) {
  const segments = segmentStreamingText({ highlights, links, text });

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.kind === "link" && segment.link) {
          const linkContent = (
            <InlineStreamingText
              isStreaming={isStreaming}
              text={segment.text}
            />
          );

          if (segment.link.onSelect) {
            return (
              <button
                className="inline font-semibold text-action hover:text-action-hover hover:underline"
                key={index}
                onClick={segment.link.onSelect}
                type="button"
              >
                {linkContent}
              </button>
            );
          }

          return (
            <a
              className="font-semibold text-action hover:text-action-hover hover:underline"
              href={segment.link.href ?? "#"}
              key={index}
            >
              {linkContent}
            </a>
          );
        }

        return segment.kind === "highlight" ? (
          <strong className="font-semibold text-text" key={index}>
            <InlineStreamingText
              isStreaming={isStreaming}
              text={segment.text}
            />
          </strong>
        ) : (
          <InlineStreamingText
            isStreaming={isStreaming}
            key={index}
            text={segment.text}
          />
        );
      })}
    </>
  );
}
