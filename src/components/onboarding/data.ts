// Onboarding demo data and pure validation helpers. Keep all string lists and
// validation logic here so docs/onboarding.md edits map to a single file.

export type LinkedInPersona = Readonly<{
  firstName: string;
  lastName: string;
  email: string;
  avatarSrc?: string;
}>;

// The dominant demo persona. Email is intentionally a personal address so the
// signed-in screen visibly demonstrates why "Work email" is still required.
// See docs/onboarding.md "Mock demo data".
export const JAMIE_CHEN: LinkedInPersona = {
  firstName: "Jamie",
  lastName: "Chen",
  email: "jamie.chen@gmail.com",
};

// Personal email providers, treated as not-work-email. Mirrors the explicit
// list in docs/onboarding.md "Personal-email blocklist".
const PERSONAL_EMAIL_DOMAINS: ReadonlySet<string> = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
]);

// Yahoo has many country TLDs (yahoo.com, yahoo.co.uk, yahoo.fr, yahoo.de...).
// Match by base label rather than enumerating every variant.
const PERSONAL_EMAIL_BASE_LABELS: ReadonlyArray<string> = ["yahoo"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WorkEmailValidation =
  | Readonly<{ kind: "empty" }>
  | Readonly<{ kind: "invalid-format" }>
  | Readonly<{ kind: "personal-email" }>
  | Readonly<{ kind: "valid"; domain: string }>;

export function validateWorkEmail(rawEmail: string): WorkEmailValidation {
  const email = rawEmail.trim();

  if (email.length === 0) {
    return { kind: "empty" };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { kind: "invalid-format" };
  }

  const domain = email.slice(email.indexOf("@") + 1).toLowerCase();

  if (PERSONAL_EMAIL_DOMAINS.has(domain)) {
    return { kind: "personal-email" };
  }

  const baseLabel = domain.split(".")[0];
  if (PERSONAL_EMAIL_BASE_LABELS.includes(baseLabel)) {
    return { kind: "personal-email" };
  }

  return { kind: "valid", domain };
}

// A small, hand-authored map for demo domains where simple title-casing
// produces an awkward name (e.g., "northstarhealth.com" should display as
// "Northstar Health", not "Northstarhealth"). Anything not listed falls back
// to the generic transformation below.
const COMPANY_NAME_OVERRIDES: Readonly<Record<string, string>> = {
  "northstarhealth.com": "Northstar Health",
};

export function deriveCompanyFromEmail(rawEmail: string): string {
  const validation = validateWorkEmail(rawEmail);
  if (validation.kind !== "valid") {
    return "";
  }

  const override = COMPANY_NAME_OVERRIDES[validation.domain];
  if (override) {
    return override;
  }

  const root = validation.domain.split(".")[0];
  return root
    .split(/[-_]+/)
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
