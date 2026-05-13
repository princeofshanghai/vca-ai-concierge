import { redirect } from "next/navigation";

type MediumFlowRedirectPageProps = Readonly<{
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function MediumFlowRedirectPage({
  searchParams,
}: MediumFlowRedirectPageProps) {
  const { shell } = await searchParams;

  redirect(
    shell === "tray"
      ? "/internal/flows/medium/available?shell=tray"
      : "/internal/flows/medium/available",
  );
}
