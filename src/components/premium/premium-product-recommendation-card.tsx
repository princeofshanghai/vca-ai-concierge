import Link from "next/link";

import { getButtonClassName } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";

import {
  premiumBusinessSuitePlan,
  premiumPlans,
  type PremiumPlanId,
} from "./premium-plan-data";

export function PremiumProductRecommendationCard({
  displayName,
  planId = "business-suite",
  showAvatar = true,
  showPrice = true,
}: Readonly<{
  displayName?: string;
  planId?: PremiumPlanId;
  showAvatar?: boolean;
  showPrice?: boolean;
}>) {
  const plan =
    premiumPlans.find((premiumPlan) => premiumPlan.id === planId) ??
    premiumBusinessSuitePlan;
  const planName = displayName ?? plan.name;

  return (
    <article className="chat-recommendation-enter flex w-full flex-col rounded-md border border-premium-brand bg-background py-xl pl-xl pr-xl">
      <div className="flex flex-col gap-xxl">
        <div className="flex flex-col gap-lg">
          {showAvatar ? (
            <div
              aria-hidden="true"
              className="flex size-12 items-center justify-center"
            >
              <Entity size={48} label={planName} />
            </div>
          ) : null}

          <div className="flex flex-col gap-xs">
            <h2 className="text-heading-lg text-text">
              {planName}
            </h2>
            <p className="text-body-md text-text">{plan.subtitle}</p>
          </div>

          <div className="flex flex-col gap-sm">
            <p className="text-control-sm text-text">Plan includes:</p>
            <ul className="flex flex-col gap-sm">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-[10px] text-body-sm text-text-meta"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[2px] inline-flex size-4 shrink-0 items-center justify-center text-premium-text-brand"
                  >
                    <Icon name="check" size="small" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-sm">
          {showPrice ? (
            <p className="flex items-baseline gap-xs text-control-sm text-checked">
              <span className="line-through">$76.98</span>
              <span>* 1-month free trial</span>
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-sm">
            <Link
              href="/premium/checkout"
              className={getButtonClassName({
                size: "small",
                className: "px-pill-padding-inline",
              })}
            >
              Start free trial
            </Link>
            <Link
              href="/premium/learn-more"
              className={getButtonClassName({
                size: "small",
                variant: "secondary",
                className: "px-pill-padding-inline",
              })}
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
