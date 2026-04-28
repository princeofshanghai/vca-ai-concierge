import type { ReactNode } from "react";

import { ReviewShell } from "@/components/review-shell";

export default function ReviewLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <ReviewShell>{children}</ReviewShell>;
}
