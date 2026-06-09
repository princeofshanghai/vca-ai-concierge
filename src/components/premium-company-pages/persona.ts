export const PCP_ASSET_ROOT = "/assets/premium-company-pages";
export const PCP_MEMBER_ASSET_ROOT = `${PCP_ASSET_ROOT}/member`;

export const pcpCompanyProfile = {
  name: "Velora",
  founderName: "Ning Hu",
  founderTitle: "Founder & CEO",
  tagline:
    "Restaurant growth software for managing online orders, delivery promotions, and local campaigns.",
  industry: "Restaurant technology software",
  location: "San Francisco, CA",
  followers: "6,842 followers",
  employees: "32 employees",
  clientReach: "Built for restaurant groups and franchise marketing teams",
  ctaLabel: "Ask Velora",
  socialProof: "Tia & 3 other connections follow this",
  logoSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-logo.png`,
  coverSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-hero-background.png`,
  heroSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-hero-background.png`,
  founderAvatarSrc: `${PCP_MEMBER_ASSET_ROOT}/ning-hu.png`,
  testimonial: {
    quote:
      "Velora gave us one place to manage menu updates, delivery promotions, and campaign reporting across locations. We finally stopped rebuilding the same launch plan every week.",
    author: "Maya Patel",
    role: "Managing Partner at Northline Kitchen Group",
    avatarSrc: `${PCP_ASSET_ROOT}/avatar-1.png`,
  },
} as const;
