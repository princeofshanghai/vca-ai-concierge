import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";

import { premiumBusinessSuitePlan } from "./premium-plan-data";

const PREMIUM_GOLD_BORDER = "#F9C982";
const PREMIUM_GOLD_ACCENT = "#ce7b00";

export function PremiumProductRecommendationCard() {
  return (
    <article
      className="chat-message-enter flex w-full flex-col rounded-md border bg-background py-xl pl-xl pr-md"
      style={{ borderColor: PREMIUM_GOLD_BORDER }}
    >
      <div className="flex flex-col gap-xxl">
        <div className="flex flex-col gap-lg">
          <div
            aria-hidden="true"
            className="relative flex size-12 items-center justify-center"
          >
            <span
              className="absolute -inset-[2px] rounded-round border-[2px]"
              style={{ borderColor: PREMIUM_GOLD_ACCENT }}
            />
            <Entity size={48} label={premiumBusinessSuitePlan.name} />
          </div>

          <div className="flex flex-col gap-xs">
            <h2 className="text-heading-lg text-text">
              {premiumBusinessSuitePlan.name}
            </h2>
            <p className="text-body-md text-text">
              {premiumBusinessSuitePlan.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-sm">
            <p className="text-control-sm text-text">Plan includes:</p>
            <ul className="flex flex-col gap-sm">
              {premiumBusinessSuitePlan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-[10px] text-body-sm text-text-meta"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[2px] inline-flex size-4 shrink-0 items-center justify-center"
                    style={{ color: PREMIUM_GOLD_ACCENT }}
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
          <p className="text-control-sm text-text">
            <span className="line-through">$76.98</span>
            <span>* 1-month free trial</span>
          </p>
          <div className="flex flex-wrap items-center gap-sm">
            <Button size="small" className="px-pill-padding-inline">
              Start free trial
            </Button>
            <Button
              size="small"
              variant="secondary"
              className="px-pill-padding-inline"
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
