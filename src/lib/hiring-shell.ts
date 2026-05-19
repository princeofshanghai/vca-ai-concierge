export type HiringShellMode = "default" | "tray" | "hybrid";

export function getHiringShellMode(
  shell: string | ReadonlyArray<string> | undefined,
): HiringShellMode {
  const shellValue = Array.isArray(shell) ? shell[0] : shell;

  if (shellValue === "default" || shellValue === "floating") {
    return "default";
  }

  if (shellValue === "tray") {
    return "tray";
  }

  return "hybrid";
}
