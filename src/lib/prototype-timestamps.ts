const prototypeMessageTimestamps = [
  "1:00 PM",
  "1:01 PM",
  "1:02 PM",
  "1:03 PM",
  "1:04 PM",
  "1:05 PM",
  "1:06 PM",
  "1:07 PM",
  "1:08 PM",
  "1:09 PM",
  "1:10 PM",
] as const;

export function getPrototypeMessageTimestamp(index: number) {
  return prototypeMessageTimestamps[
    index % prototypeMessageTimestamps.length
  ];
}
