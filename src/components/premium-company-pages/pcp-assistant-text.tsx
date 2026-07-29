"use client";

import {
  splitTextBlocks,
  StreamingEmphasizedText,
  type StreamingTextLink,
} from "./streaming-emphasized-text";

export type PcpAssistantTextLink = StreamingTextLink;

type PcpAssistantBulletItem = Readonly<{
  children: ReadonlyArray<string>;
  text: string;
}>;

type PcpAssistantList = Readonly<{
  items: ReadonlyArray<PcpAssistantBulletItem>;
  kind: "ordered" | "unordered";
}>;

function parseList(block: string): PcpAssistantList | null {
  const lines = block
    .split("\n")
    .filter((line) => line.trim().length > 0);
  const kind = /^-\s*/u.test(lines[0] ?? "")
    ? "unordered"
    : /^\d+\.\s*/u.test(lines[0] ?? "")
      ? "ordered"
      : null;

  if (!lines.length || !kind) {
    return null;
  }

  const items: Array<{
    children: Array<string>;
    text: string;
  }> = [];

  for (const line of lines) {
    const nestedItem = line.match(/^\s{2,}-\s*(.*)$/u);

    if (nestedItem) {
      const currentItem = items.at(-1);

      if (!currentItem) {
        return null;
      }

      currentItem.children.push(nestedItem[1]);
      continue;
    }

    const item =
      kind === "ordered"
        ? line.match(/^\d+\.\s*(.*)$/u)
        : line.match(/^-\s*(.*)$/u);

    if (!item) {
      return null;
    }

    items.push({
      children: [],
      text: item[1],
    });
  }

  return { items, kind };
}

export function PcpAssistantText({
  emphasis = [],
  isStreaming,
  links = [],
  text,
}: Readonly<{
  emphasis?: ReadonlyArray<string>;
  isStreaming: boolean;
  links?: ReadonlyArray<PcpAssistantTextLink>;
  text: string;
}>) {
  const blocks = splitTextBlocks(text);

  return (
    <>
      {blocks.map((block, index) => {
        const list = parseList(block);

        if (list) {
          const List = list.kind === "ordered" ? "ol" : "ul";

          return (
            <List
              className={`${index > 0 ? "mt-md " : ""}${list.kind === "ordered" ? "list-decimal" : "list-disc"} space-y-xs pl-xl`}
              key={index}
            >
              {list.items.map((item, itemIndex) => (
                <li className="pl-xs" key={`${item.text}-${itemIndex}`}>
                  <StreamingEmphasizedText
                    highlights={emphasis}
                    isStreaming={isStreaming}
                    links={links}
                    text={item.text}
                  />
                  {item.children.length ? (
                    <ul className="mt-xs list-disc space-y-xs pl-xl">
                      {item.children.map((child, childIndex) => (
                        <li className="pl-xs" key={`${child}-${childIndex}`}>
                          <StreamingEmphasizedText
                            highlights={emphasis}
                            isStreaming={isStreaming}
                            links={links}
                            text={child}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </List>
          );
        }

        return (
          <p className={index > 0 ? "mt-md" : undefined} key={index}>
            <StreamingEmphasizedText
              highlights={emphasis}
              isStreaming={isStreaming}
              links={links}
              text={block}
            />
          </p>
        );
      })}
    </>
  );
}
