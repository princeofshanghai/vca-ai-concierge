"use client";

import { PremiumConciergeFab } from "@/components/premium/premium-concierge-fab";
import { PremiumSurveyOption } from "@/components/premium/premium-survey-components";

export function PremiumFabReviewPreview() {
  return (
    <div className="relative min-h-28 overflow-hidden rounded-lg border border-border-faint bg-background-neutral-soft">
      <div className="absolute bottom-xl right-xl">
        <PremiumConciergeFab onClick={() => {}} position="static" />
      </div>
    </div>
  );
}

export function PremiumSurveyOptionReviewPreview() {
  return (
    <div className="grid gap-md md:grid-cols-2">
      <PremiumSurveyOption
        checked={false}
        label="I'd use Premium for my personal goals"
        onSelect={() => {}}
      />
      <PremiumSurveyOption
        checked
        label="Find and reach new leads"
        control="checkbox"
        onSelect={() => {}}
      />
    </div>
  );
}
