export type PremiumShellMode = "dismissable-tray" | "dockable-tray";

export function getPremiumShellMode(
  shell: string | ReadonlyArray<string> | undefined,
): PremiumShellMode {
  const shellValue = Array.isArray(shell) ? shell[0] : shell;

  if (shellValue === "tray" || shellValue === "dockable-tray") {
    return "dockable-tray";
  }

  return "dismissable-tray";
}
