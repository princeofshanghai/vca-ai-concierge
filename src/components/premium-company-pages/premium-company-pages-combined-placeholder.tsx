"use client";

import { LinkedInGlobalNavigation } from "@/components/global-navigation";
import { Icon } from "@/components/primitives/icon";

import {
  PCP_MEMBER_ASSET_ROOT,
  pcpVisitorPersona,
} from "./persona";

function assetSrc(path: string) {
  return path.startsWith("/") ? path : `${PCP_MEMBER_ASSET_ROOT}/${path}`;
}

export function PremiumCompanyPagesCombinedPlaceholder() {
  return (
    <main className="min-h-dvh bg-background-neutral-soft text-text">
      <LinkedInGlobalNavigation
        profileSrc={assetSrc(pcpVisitorPersona.memberAvatar)}
        showAdvertise
      />
      <section className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-[1128px] items-center justify-center px-lg py-xxl">
        <div className="flex w-full max-w-[520px] flex-col items-center rounded-sm border border-border-faint bg-background px-xxl py-stack text-center shadow-raised-faint">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-ai-background-soft text-ai-icon">
            <Icon name="signal-ai" size="medium" />
          </span>
          <h1 className="mt-lg text-heading-lg text-text">
            Combined VCA and Admin
          </h1>
          <p className="mt-sm text-body-sm text-text-meta">
            Placeholder
          </p>
        </div>
      </section>
    </main>
  );
}
