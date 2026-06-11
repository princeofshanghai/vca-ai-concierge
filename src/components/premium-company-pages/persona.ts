export const PCP_ASSET_ROOT = "/assets/premium-company-pages";
export const PCP_MEMBER_ASSET_ROOT = `${PCP_ASSET_ROOT}/member`;

export const pcpCompanyProfile = {
  name: "Velora",
  founderName: "Rose Reynolds",
  founderTitle: "Social Media & Communications Manager",
  adminName: "Rose Reynolds",
  adminFirstName: "Rose",
  adminTitle: "Social Media & Communications Manager",
  tagline:
    "Benefits administration software for managing open enrollment, carrier connections, and employee benefits at enterprise scale.",
  industry: "Benefits administration software",
  location: "San Francisco, CA",
  followers: "48,218 followers",
  employees: "1,284 employees",
  clientReach: "Built for enterprise HR and benefits teams",
  ctaLabel: "Ask Velora",
  socialProof: "Maya & 3 other connections follow this",
  logoSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-logo.png`,
  coverSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-hero-background.png`,
  heroSrc: `${PCP_MEMBER_ASSET_ROOT}/velora-hero-background.png`,
  founderAvatarSrc: `${PCP_ASSET_ROOT}/rose-reynolds.png`,
  adminAvatarSrc: `${PCP_ASSET_ROOT}/rose-reynolds.png`,
  testimonial: {
    quote:
      "Velora helped our HR team move open enrollment out of spreadsheets and into one system across carriers, eligibility changes, and employee communications.",
    author: "Dana Kim",
    role: "VP of People Operations at Arbor Retail Group",
    avatarSrc: `${PCP_ASSET_ROOT}/avatar-2.png`,
  },
} as const;

export const pcpAdminPersona = {
  name: pcpCompanyProfile.adminName,
  firstName: pcpCompanyProfile.adminFirstName,
  title: pcpCompanyProfile.adminTitle,
  avatarSrc: pcpCompanyProfile.adminAvatarSrc,
  responsibility:
    "Owns Velora's LinkedIn presence, executive reporting, visitor follow-up, and content performance.",
} as const;

export const pcpVisitorPersona = {
  name: "Cheri Sparks",
  firstName: "Cheri",
  title: "VP of HR",
  company: "Arbor Retail Group",
  avatar: "member/cheri-sparks.png",
  memberAvatar: "cheri-sparks.png",
  companyContext: "12,000-employee retail organization with seasonal hiring peaks",
  evaluationNeed:
    "Exploring whether Velora is relevant for HR and benefits operations after viewing a Velora Page post.",
  intentTags: [
    "12,000-employee retail organization",
    "Viewed Velora post",
    "HR and benefits operations",
    "Evaluated just now",
  ],
} as const;

export const pcpCompetitorNames = [
  "BrightBenefits",
  "Enrollwise",
  "HavenHR",
] as const;

const pcpArborPostTitle =
  "How Arbor Retail Group simplified carrier coordination before open enrollment";
const pcpArborPostSummary =
  "Arbor Retail Group: how a 12,000-employee retailer simplified carrier coordination before open enrollment";

export const pcpProofSnippets = {
  postTitle: pcpArborPostTitle,
  postSummary: pcpArborPostSummary,
  postImage: "media-1.png",
  postImageAlt: "Benefits operations dashboard showing carrier coordination tasks",
  postTimestamp: "2d",
  postDateLabel: "June 2, 2026 · Edited",
  postEngagement: "1,284",
  postCommentCount: "36",
  postCommentLabel: "36 comments",
  postRepostCount: "18",
  postBody: [
    "Arbor Retail Group was preparing open enrollment for 12,000 employees across stores, distribution centers, and corporate teams. Eligibility cleanup and carrier file readiness used to send the benefits team into a spreadsheet scramble.",
    "With Velora, Dana's team mapped each plan change to the populations, carrier files, and employee communications behind it. When one carrier feed changed, only the affected launch tasks moved into review. Everyone else stayed on schedule.",
    "HR leaders could see what was approved, queued, or blocked. Once enrollment opened, Velora showed which employee groups needed follow-up automatically.",
  ],
  caseStudyTitle: pcpArborPostTitle,
  caseStudyShort: pcpArborPostSummary,
  implementationProof:
    "Velora supports staged migration, carrier file validation, eligibility audits, and employee communications from one benefits operations workspace.",
  privacyStance:
    "Rose sees Cheri's sent message plus VCA context summary by default, not the full visitor transcript.",
} as const;

export const pcpVcaScenario = {
  heroQuestion:
    "What happens to our benefits enrollment if we switch platforms mid-year?",
  openingTitle: `Hi ${pcpVisitorPersona.firstName}`,
  openingSubcopy:
    "I can help you explore Velora and decide what to do next.",
  visitorPrompts: [
    {
      id: "overview",
      label: "What should I know about Velora?",
    },
    {
      id: "fit",
      label: "Is Velora relevant to me?",
    },
    {
      id: "posts",
      label: "Show me recent posts",
    },
  ],
  pageExplorerPrompts: {
    overview: "What should I know about Velora?",
    fit: "Is Velora relevant to me?",
    posts: "Show me recent posts",
    people: "Who are the top people here?",
    jobs: "Are there open roles?",
  },
  pageExplorerResponses: {
    overview:
      "Velora is a benefits administration platform for enterprise HR teams. It helps teams coordinate open enrollment, carrier readiness, eligibility changes, and employee communications in one shared workflow.",
    fit:
      "Based on your HR leadership role and company context, Velora looks relevant if your team manages benefits operations across employee populations, carriers, locations, or enrollment windows.",
    posts:
      "Here are recent posts from Velora. This one shows how a large retail HR team simplified carrier coordination before open enrollment.",
    people:
      "A few leaders stand out on Velora's Page. Rose Reynolds manages Page communications, Avery Chen leads carrier integrations, and Marcus Lee focuses on benefits implementation.",
    jobs:
      "Velora is hiring across benefits implementation and carrier integrations. The open roles suggest the team is investing in customer operations and benefits workflow expertise.",
  },
  caseStudyReturnPrompt:
    "Want me to draft a message to Velora based on the post you viewed and what you're exploring?",
  handoffOffer:
    "I can draft a short message to Velora so Rose knows what caught your attention and why you're reaching out.",
  handoffMessage:
    "Hi Rose - I'm exploring Velora for HR and benefits operations and saw your post about how Arbor Retail Group simplified carrier coordination before open enrollment. I'm interested in whether Velora could be relevant for a team like mine. Would love to connect.",
} as const;

export const pcpAdminScenario = {
  contextualAnalyticsTitle: "Open enrollment content needs reach",
  contextualAnalyticsDetail:
    "A migration-readiness post has strong engagement but modest impressions.",
  leadSummary:
    "Cheri viewed Velora's Arbor Retail Group post, explored whether Velora is relevant for HR and benefits operations, and sent Rose a drafted message.",
  suggestedReply:
    "Hi Cheri - thanks for reaching out. Glad the Arbor Retail Group post was useful. Velora is built for HR and benefits teams managing carrier coordination, eligibility cleanup, and employee communications at scale. Happy to compare notes on what your team is exploring.",
  suggestedPrep: [
    "Reference the Arbor Retail Group post Cheri viewed.",
    "Explain carrier coordination and eligibility cleanup in plain language.",
    "Ask what HR and benefits operations questions Cheri is exploring.",
  ],
  inboxThreadPreview:
    "Cheri: Hi Rose - I'm exploring Velora for HR and benefits operations...",
} as const;
