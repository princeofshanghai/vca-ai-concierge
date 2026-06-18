export type HiringShellMode =
  | "default"
  | "tray"
  | "hybrid"
  | "floating-card";

export function getHiringShellMode(
  shell: string | ReadonlyArray<string> | undefined,
): HiringShellMode {
  const shellValue = Array.isArray(shell) ? shell[0] : shell;

  if (shellValue === "floating" || shellValue === "floating-card") {
    return "floating-card";
  }

  if (shellValue === "default" || shellValue === "dismissable-tray") {
    return "default";
  }

  if (shellValue === "tray" || shellValue === "persistent-tray") {
    return "tray";
  }

  if (shellValue === "hybrid") {
    return "hybrid";
  }

  return "hybrid";
}
