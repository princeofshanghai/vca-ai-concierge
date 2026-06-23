import { redirect } from "next/navigation";

import { getHiringShellMode } from "@/lib/hiring-shell";

type MediumFlowRedirectPageProps = Readonly<{
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function MediumFlowRedirectPage({
  searchParams,
}: MediumFlowRedirectPageProps) {
  const { shell } = await searchParams;
  const shellMode = getHiringShellMode(shell);

  if (shellMode === "tray") {
    redirect("/internal/flows/medium/available");
  }

  if (shellMode === "default") {
    redirect("/internal/flows/medium/available?shell=default");
  }

  if (shellMode === "floating-card") {
    redirect("/internal/flows/medium/available?shell=floating-card");
  }

  redirect("/internal/flows/medium/available?shell=hybrid");
}
