export const PCP_ASSET_ROOT = "/assets/premium-company-pages";
export const PCP_MEMBER_ASSET_ROOT = `${PCP_ASSET_ROOT}/member`;

export const pcpCompanyProfile = {
  name: "Velora Consulting",
  founderName: "Skylar Truong",
  founderTitle: "Owner-founder",
  tagline:
    "Product strategy and UX research for mid-market teams making high-stakes product bets.",
  industry: "Product strategy and UX consultancy",
  location: "San Francisco Bay Area",
  followers: "6,842 followers",
  employees: "11-50 employees",
  clientReach: "National clients via remote delivery",
  ctaLabel: "Book a call",
  socialProof: "Priya Shah and 8 other product leaders follow this",
  logoSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-logo.png`,
  coverSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-hero-background.png`,
  heroSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-hero-background.png`,
  founderAvatarSrc: `${PCP_MEMBER_ASSET_ROOT}/beta-entity.png`,
  testimonial: {
    quote:
      "Velora Consulting turned a messy product bet into a clear, testable roadmap. In six weeks, our team had sharper positioning, a validated prototype, and a decision we trusted.",
    author: "Maya Patel",
    role: "VP Product at LumaWorks",
    avatarSrc: `${PCP_MEMBER_ASSET_ROOT}/avatar-2.png`,
  },
} as const;
