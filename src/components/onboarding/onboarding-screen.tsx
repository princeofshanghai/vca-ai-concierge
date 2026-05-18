"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";

import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";
import { TextInput } from "@/components/primitives/text-input";
import { HIRING_CONCIERGE_TITLE } from "@/lib/concierge-copy";

import {
  JAMIE_CHEN,
  isLikelyPersonalEmailDomain,
  validateWorkEmail,
  type LinkedInPersona,
  type WorkEmailValidation,
} from "./data";

// Simulated LinkedIn auth latency for the prototype. See
// docs/onboarding.md "Click behavior (simulated sign-in)".
const LINKEDIN_SIGN_IN_DELAY_MS = 600;

const HEADLINE = HIRING_CONCIERGE_TITLE;
const SUBCOPY =
  "Discuss your hiring needs with our AI assistant, then connect with a sales expert.";
const PERSONAL_EMAIL_HELPER_TEXT =
  "Use work email to help tailor the chat.";

export type OnboardingResult = Readonly<{
  firstName: string;
  lastName: string;
  workEmail: string;
  company: string;
}>;

type OnboardingScreenProps = Readonly<{
  isSignedIn: boolean;
  onSubmit: (result: OnboardingResult) => void;
  persona?: LinkedInPersona;
}>;

type FormState = Readonly<{
  firstName: string;
  lastName: string;
  workEmail: string;
  // Tracks whether the visible email came from LinkedIn or from the user.
  // This lets "Not Jamie?" discard profile-owned data while preserving
  // anything the user typed manually.
  workEmailSource: "empty" | "profile" | "manual";
  company: string;
}>;

type VisualState = "signed-in" | "signed-out";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function buildInitialFormState(
  isSignedIn: boolean,
  persona: LinkedInPersona,
): FormState {
  const profileEmail = persona.email.trim();
  const shouldPrefillProfileEmail = isSignedIn && profileEmail.length > 0;

  return {
    firstName: isSignedIn ? persona.firstName : "",
    lastName: isSignedIn ? persona.lastName : "",
    workEmail: shouldPrefillProfileEmail ? profileEmail : "",
    workEmailSource: shouldPrefillProfileEmail ? "profile" : "empty",
    company: "",
  };
}

function getEmailErrorText(validation: WorkEmailValidation): string | null {
  switch (validation.kind) {
    case "invalid-format":
      return "Enter a valid email address.";
    default:
      return null;
  }
}

export function OnboardingScreen({
  isSignedIn,
  onSubmit,
  persona = JAMIE_CHEN,
}: OnboardingScreenProps) {
  const [form, setForm] = useState<FormState>(() =>
    buildInitialFormState(isSignedIn, persona),
  );
  const [hasDismissedLinkedInIdentity, setHasDismissedLinkedInIdentity] =
    useState(false);
  const [hasSignedInRuntime, setHasSignedInRuntime] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  // Errors are surfaced only after the user has either tried to submit or
  // typed something in a field. This keeps the empty signed-out form quiet
  // on first load.
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const signInTimeoutRef = useRef<number | null>(null);

  const visualState: VisualState = hasDismissedLinkedInIdentity
    ? "signed-out"
    : hasSignedInRuntime
      ? "signed-in"
      : isSignedIn
        ? "signed-in"
        : "signed-out";

  const emailValidation = validateWorkEmail(form.workEmail);
  const isFirstNameMissing = form.firstName.trim().length === 0;
  const isLastNameMissing = form.lastName.trim().length === 0;
  const isCompanyMissing = form.company.trim().length === 0;
  const isEmailValid = emailValidation.kind === "valid";
  const shouldShowPersonalEmailHelper =
    emailValidation.kind === "valid" &&
    isLikelyPersonalEmailDomain(emailValidation.domain);

  const showEmailError = emailValidation.kind === "invalid-format";
  const emailErrorText = getEmailErrorText(emailValidation);

  const isSubmitDisabled =
    isAuthenticating ||
    isFirstNameMissing ||
    isLastNameMissing ||
    !isEmailValid ||
    isCompanyMissing;

  // Focus on entry, and on visual-state flips driven by Not Jamie? or
  // Continue with LinkedIn. Signed-in lands on Company name because LinkedIn
  // fills identity/email; signed-out lands on First name.
  useEffect(() => {
    if (visualState === "signed-in") {
      companyRef.current?.focus();
    } else {
      firstNameRef.current?.focus();
    }
  }, [visualState]);

  useEffect(() => {
    return () => {
      if (signInTimeoutRef.current !== null) {
        window.clearTimeout(signInTimeoutRef.current);
      }
    };
  }, []);

  const handleFirstNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      setForm((prev) => ({ ...prev, firstName: value }));
    },
    [],
  );

  const handleLastNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      setForm((prev) => ({ ...prev, lastName: value }));
    },
    [],
  );

  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      setForm((prev) => ({
        ...prev,
        workEmail: value,
        workEmailSource: value.trim().length > 0 ? "manual" : "empty",
      }));
    },
    [],
  );

  const handleCompanyChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      setForm((prev) => ({
        ...prev,
        company: value,
      }));
    },
    [],
  );

  const handleDismissLinkedIn = useCallback(() => {
    setHasDismissedLinkedInIdentity(true);
    setForm((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      workEmail: prev.workEmailSource === "profile" ? "" : prev.workEmail,
      workEmailSource:
        prev.workEmailSource === "profile" ? "empty" : prev.workEmailSource,
    }));
  }, []);

  const handleSignInWithLinkedIn = useCallback(() => {
    if (isAuthenticating) {
      return;
    }
    setIsAuthenticating(true);
    signInTimeoutRef.current = window.setTimeout(() => {
      signInTimeoutRef.current = null;
      const profileEmail = persona.email.trim();
      setForm((prev) => ({
        ...prev,
        firstName: persona.firstName,
        lastName: persona.lastName,
        workEmail:
          prev.workEmailSource === "manual" || profileEmail.length === 0
            ? prev.workEmail
            : profileEmail,
        workEmailSource:
          prev.workEmailSource === "manual" || profileEmail.length === 0
            ? prev.workEmailSource
            : "profile",
      }));
      setHasSignedInRuntime(true);
      setIsAuthenticating(false);
    }, LINKEDIN_SIGN_IN_DELAY_MS);
  }, [isAuthenticating, persona]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitDisabled) {
        setHasAttemptedSubmit(true);
        return;
      }
      onSubmit({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        workEmail: form.workEmail.trim(),
        company: form.company.trim(),
      });
    },
    [form, isSubmitDisabled, onSubmit],
  );

  const inputsDisabled = isAuthenticating;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex w-full max-w-[384px] flex-col px-xxl pt-xxl pb-xxxl"
      >
        <div className="flex flex-col text-left">
          <Icon
            name="signal-ai"
            label="AI Concierge"
            className="concierge-ai-mark text-ai-icon !size-8"
          />
          <h2 className="mt-md text-display-md text-text">{HEADLINE}</h2>
          <p className="mt-sm text-body-md-open text-text-meta">
            {SUBCOPY}
          </p>
        </div>

        {visualState === "signed-out" ? (
          <>
            <Button
              type="button"
              size="medium"
              variant="primary"
              loading={isAuthenticating}
              loadingLabel="Continue with LinkedIn"
              leadingIcon={
                <Image
                  src="/assets/linkedin-bug.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
              }
              onClick={handleSignInWithLinkedIn}
              className="mt-stack w-full !gap-2 [&>span:first-child]:size-6"
            >
              Continue with LinkedIn
            </Button>
            <OrDivider className="my-lg" />
          </>
        ) : null}

        {visualState === "signed-in" ? (
          <ProfileChip
            persona={persona}
            onDismiss={handleDismissLinkedIn}
            className="mt-stack"
          />
        ) : null}

        <div
          className={cx(
            "flex flex-col gap-lg",
            visualState === "signed-in" && "mt-xl",
          )}
        >
          <TextInput
            ref={firstNameRef}
            label="First name"
            name="firstName"
            autoComplete="given-name"
            size="large"
            trailingIcon={null}
            value={form.firstName}
            onChange={handleFirstNameChange}
            disabled={inputsDisabled}
            error={hasAttemptedSubmit && isFirstNameMissing}
            errorText={
              hasAttemptedSubmit && isFirstNameMissing
                ? "Enter your first name."
                : undefined
            }
          />
          <TextInput
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            size="large"
            trailingIcon={null}
            value={form.lastName}
            onChange={handleLastNameChange}
            disabled={inputsDisabled}
            error={hasAttemptedSubmit && isLastNameMissing}
            errorText={
              hasAttemptedSubmit && isLastNameMissing
                ? "Enter your last name."
                : undefined
            }
          />
          <TextInput
            label="Email"
            name="workEmail"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@company.com"
            size="large"
            trailingIcon={null}
            value={form.workEmail}
            onChange={handleEmailChange}
            disabled={inputsDisabled}
            error={showEmailError}
            errorText={emailErrorText ?? undefined}
            helperText={
              shouldShowPersonalEmailHelper
                ? PERSONAL_EMAIL_HELPER_TEXT
                : undefined
            }
          />
          <TextInput
            ref={companyRef}
            label="Company name"
            name="company"
            autoComplete="organization"
            size="large"
            trailingIcon={null}
            value={form.company}
            onChange={handleCompanyChange}
            disabled={inputsDisabled}
            error={hasAttemptedSubmit && isCompanyMissing}
            errorText={
              hasAttemptedSubmit && isCompanyMissing
                ? "Enter your company name."
                : undefined
            }
          />
        </div>

        <Button
          type="submit"
          size="medium"
          variant="primary"
          disabled={isSubmitDisabled}
          className="mt-stack w-full"
        >
          Start chat
        </Button>
      </form>
    </div>
  );
}

type ProfileChipProps = Readonly<{
  persona: LinkedInPersona;
  onDismiss: () => void;
  className?: string;
}>;

function ProfileChip({ persona, onDismiss, className }: ProfileChipProps) {
  const fullName = `${persona.firstName} ${persona.lastName}`.trim();

  return (
    <div className={cx("flex items-center gap-md", className)}>
      <Entity
        size={24}
        shape="circle"
        src={persona.avatarSrc}
        label={fullName}
      />
      <span className="min-w-0 flex-1 truncate text-supportive-s text-text-meta">
        Signed in as {persona.email}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-xs text-supportive-s text-action transition-colors duration-150 ease-out hover:text-action-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring active:text-action-active"
      >
        Switch
      </button>
    </div>
  );
}

type OrDividerProps = Readonly<{
  className?: string;
  children?: ReactNode;
}>;

function OrDivider({ className, children = "or" }: OrDividerProps) {
  return (
    <div
      className={cx(
        "flex items-center gap-md text-supportive-s text-text-meta",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px flex-1 bg-border-faint" />
      <span>{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-border-faint" />
    </div>
  );
}
