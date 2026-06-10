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
  title: "VP of HR",
  company: "Arbor Retail Group",
  avatar: "member/cheri-sparks.png",
  memberAvatar: "cheri-sparks.png",
  companyContext: "12,000-employee retail organization with seasonal hiring peaks",
  evaluationNeed:
    "Evaluating whether Velora can support a mid-year benefits platform migration before open enrollment.",
  intentTags: [
    "12,000-employee retail organization",
    "Mid-year migration",
    "Multi-carrier open enrollment",
    "Evaluated just now",
  ],
} as const;

export const pcpCompetitorNames = [
  "BrightBenefits",
  "Enrollwise",
  "HavenHR",
] as const;

export const pcpProofSnippets = {
  caseStudyTitle:
    "How Arbor Retail Group reduced open enrollment spreadsheet work",
  caseStudyShort:
    "Arbor Retail Group: how a 12,000-employee retailer simplified carrier coordination before open enrollment",
  implementationProof:
    "Velora supports staged migration, carrier file validation, eligibility audits, and employee communications from one benefits operations workspace.",
  privacyStance:
    "Rose sees Cheri's sent message plus VCA context summary by default, not the full visitor transcript.",
} as const;

export const pcpVcaScenario = {
  heroQuestion:
    "What happens to our benefits enrollment if we switch platforms mid-year?",
  primaryChip: "Can Velora handle a mid-year migration?",
  starterPrompts: [
    "Can Velora handle a mid-year migration?",
    "How do you work with multiple carriers?",
    "How does implementation work?",
  ],
  profilePrompts: [
    "Can Velora handle a mid-year migration?",
    "How do you work with multiple carriers?",
    "How does implementation work?",
    "Can teams manage open enrollment in Velora?",
    "How does pricing work?",
  ],
  profileResponses: {
    "Can Velora handle a mid-year migration?":
      "Yes. Velora supports phased benefits migrations with eligibility validation, carrier file checks, employee communications, and reporting controls so HR teams can move without losing visibility before open enrollment.",
    "How do you work with multiple carriers?":
      "Velora gives benefits teams one place to track carrier feeds, plan rules, open issues, and launch readiness across medical, dental, vision, life, and voluntary benefits.",
    "How does implementation work?":
      "Implementation usually starts with carrier mapping, eligibility cleanup, and a migration calendar. Velora then gives HR, brokers, and carrier partners a shared command center for decisions, files, and employee communications.",
    "Can teams manage open enrollment in Velora?":
      "Yes. Velora helps teams stage plan changes, confirm carrier readiness, schedule employee communications, and monitor enrollment progress by population, location, and plan type.",
    "How does pricing work?":
      "Velora pricing is based on employee population, carrier complexity, and implementation scope. For enterprise HR teams, the goal is predictable platform pricing with clear migration and support expectations.",
  },
  greeting:
    "Hi, I'm Velora's AI assistant. I can help explain what Velora does, answer benefits administration questions, summarize proof, and draft a warm message to the team. What would you like to know?",
  primaryResponse:
    "Yes. This is one of the core scenarios Velora was built for. Velora helps HR teams move benefits administration in phases, validate eligibility data, coordinate carrier files, and keep employee communications on track before open enrollment. Here's a similar enterprise example:",
  caseStudyReturnPrompt:
    "Arbor Retail Group feels close to your world: a large employee population, seasonal hiring spikes, multiple carriers, and open enrollment timing pressure. Want me to turn what you've shared into a warm intro to Velora so Rose has the right context from the start?",
  handoffOffer:
    "Sounds like this might be relevant for your HR team. Want me to put together a message to Velora so they have your context before you connect?",
  handoffMessage:
    "Hi Rose - I lead HR for a 12,000-employee retail organization and we're evaluating whether Velora could support a mid-year benefits migration before open enrollment. I'm especially interested in carrier coordination, eligibility cleanup, and employee communications. Would love to learn how Velora handles this for a team our size.",
} as const;

export const pcpAdminScenario = {
  contextualAnalyticsTitle: "Open enrollment content needs reach",
  contextualAnalyticsDetail:
    "A migration-readiness post has strong engagement but modest impressions.",
  leadSummary:
    "Cheri asked whether Velora can support a mid-year migration, viewed the Arbor Retail Group proof, and sent Rose a drafted message.",
  suggestedReply:
    "Hi Cheri - thanks for reaching out. Velora is designed for enterprise benefits teams moving through exactly this kind of migration window. We can walk through phased implementation, carrier file readiness, eligibility cleanup, and employee communications for a 12,000-person workforce. Happy to compare notes on your open enrollment timeline.",
  suggestedPrep: [
    "Lead with Velora's phased migration approach for enterprise HR teams.",
    "Explain carrier file readiness and eligibility cleanup in plain language.",
    "Ask what open enrollment deadlines and carrier partners Cheri is working against.",
  ],
  inboxThreadPreview:
    "Cheri: Hi Rose - I lead HR for a 12,000-employee retail organization...",
} as const;
