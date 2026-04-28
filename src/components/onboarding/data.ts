// Onboarding demo data and pure validation helpers.

export type LinkedInPersona = Readonly<{
  firstName: string;
  lastName: string;
  email: string;
  avatarSrc?: string;
}>;

// The dominant demo persona. Email is intentionally a personal address because
// many LinkedIn members use personal email addresses on their profiles.
// See docs/onboarding.md "Mock demo data".
export const JAMIE_CHEN: LinkedInPersona = {
  firstName: "Jamie",
  lastName: "Chen",
  email: "jamie.chen@gmail.com",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WorkEmailValidation =
  | Readonly<{ kind: "empty" }>
  | Readonly<{ kind: "invalid-format" }>
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

  return { kind: "valid", domain };
}
