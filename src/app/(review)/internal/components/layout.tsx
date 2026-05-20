import type { ReactNode } from "react";

import { ComponentSidebar } from "./component-sidebar";

export default function InternalComponentsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="component-library-chrome min-h-[calc(100dvh-7rem)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfe_100%)] lg:-mt-16">
      <div className="grid w-full gap-xxxl pt-8 pb-[4.75rem] lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-0 lg:pt-14">
        <ComponentSidebar />
        <div className="min-w-0 px-6 sm:px-10 lg:col-start-2 lg:px-16 xl:px-24">
          <div className="mx-auto max-w-[48rem]">{children}</div>
        </div>
      </div>
    </main>
  );
}
