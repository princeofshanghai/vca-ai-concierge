import { redirect } from "next/navigation";

type HiringEntryLixTestPageProps = Readonly<{
  searchParams: Promise<{
    contactSales?: string | ReadonlyArray<string>;
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

function getFirstValue(value: string | ReadonlyArray<string> | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HiringEntryLixTestPage({
  searchParams,
}: HiringEntryLixTestPageProps) {
  const { contactSales, shell } = await searchParams;
  const params = new URLSearchParams();
  const contactSalesValue = getFirstValue(contactSales);
  const shellValue = getFirstValue(shell);

  if (contactSalesValue) {
    params.set("contactSales", contactSalesValue);
  }

  if (shellValue) {
    params.set("shell", shellValue);
  }

  const queryString = params.toString();

  redirect(`/hiring${queryString ? `?${queryString}` : ""}`);
}
