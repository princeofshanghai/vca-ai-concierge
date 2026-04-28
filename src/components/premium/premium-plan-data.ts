export const premiumBusinessSuitePlan = {
  id: "business-suite",
  name: "Business Suite",
  subtitle: "Sell, market, and hire in one tool",
  features: [
    "Find new clients with daily prospect suggestions and exclusive client insights",
    "Expand your profile reach with monthly post boosts and 30 InMails per month",
    "Get qualified applicants with monthly job promotions",
  ],
} as const;

export const premiumPlans = [
  {
    id: "career",
    name: "Career",
    subtitle: "Get hired and get ahead",
    features: [
      "See jobs where you'll be a top applicant based on your skills",
      "Boost your chances of hearing back by marking your top choice jobs",
      "Directly message hiring managers with 5 InMails per month",
    ],
  },
  {
    id: "business",
    name: "Business",
    subtitle: "Job search with confidence and grow your network",
    features: [
      "Find key industry contacts and decision-makers with unlimited people browsing",
      "Stand out with exclusive profile customizations and add a custom call to action",
      "Access exclusive growth and hiring trends with company insights",
    ],
  },
  premiumBusinessSuitePlan,
] as const;

export type PremiumPlan = (typeof premiumPlans)[number];
