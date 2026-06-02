export const PCP_ASSET_ROOT = "/assets/premium-company-pages";
export const PCP_MEMBER_ASSET_ROOT = `${PCP_ASSET_ROOT}/member`;

export const pcpCompanyProfile = {
  name: "Velora",
  founderName: "Ning Hu",
  founderTitle: "Founder & CEO",
  tagline:
    "Invoicing and payments built for agencies managing rotating contractor teams.",
  industry: "Financial services software",
  location: "San Francisco Bay Area",
  followers: "6,842 followers",
  employees: "25 employees",
  clientReach: "Built for small agencies and contractor teams",
  ctaLabel: "Ask Velora",
  socialProof: "Tia & 3 other connections follow this",
  logoSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-logo.png`,
  coverSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-hero-background.png`,
  heroSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-hero-background.png`,
  founderAvatarSrc: `${PCP_MEMBER_ASSET_ROOT}/ning-hu.png`,
  testimonial: {
    quote:
      "Velora gave us one place to track client payments, contractor schedules, and what still needed approval. The late-payment chaos finally stopped running the business.",
    author: "Maya Patel",
    role: "Managing Partner at Studio Northline",
    avatarSrc: `${PCP_ASSET_ROOT}/avatar-1.png`,
  },
} as const;
