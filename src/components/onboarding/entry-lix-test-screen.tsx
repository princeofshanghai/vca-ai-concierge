"use client";

import {
  useCallback,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

import Link from "next/link";

import { Button } from "@/components/primitives/button";
import { Icon } from "@/components/primitives/icon";
import { TextInput } from "@/components/primitives/text-input";
import { HIRING_CONCIERGE_TITLE } from "@/lib/concierge-copy";

import { validateWorkEmail } from "./data";

type EntryLixChoiceScreenProps = Readonly<{
  onChatWithAi: () => void;
  onFillOutForm: () => void;
}>;

type EntryLixLeadFormScreenProps = Readonly<{
  onSubmit: () => void;
}>;

type EntryLixSuccessScreenProps = Readonly<{
  onChatWithAi: () => void;
  onDone: () => void;
}>;

type SelectOption = Readonly<{
  label: string;
  value: string;
}>;

type EntryLixFormState = Readonly<{
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phoneNumber: string;
  country: string;
  stateProvince: string;
  role: string;
}>;

type EntryLixSelectFieldProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className" | "size"
> & {
  label: ReactNode;
  options: ReadonlyArray<SelectOption>;
  placeholder: string;
  error?: boolean;
  errorText?: ReactNode;
  helperText?: ReactNode;
};

const initialFormState: EntryLixFormState = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phoneNumber: "",
  country: "",
  stateProvince: "",
  role: "",
};

const countryOptions: ReadonlyArray<SelectOption> = [
  { value: "united-states", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "united-kingdom", label: "United Kingdom" },
  { value: "australia", label: "Australia" },
];

const stateProvinceOptionsByCountry: Readonly<
  Record<string, ReadonlyArray<SelectOption>>
> = {
  "united-states": [
    { value: "california", label: "California" },
    { value: "new-york", label: "New York" },
    { value: "texas", label: "Texas" },
    { value: "washington", label: "Washington" },
    { value: "other", label: "Other / not listed" },
  ],
  canada: [
    { value: "alberta", label: "Alberta" },
    { value: "british-columbia", label: "British Columbia" },
    { value: "ontario", label: "Ontario" },
    { value: "quebec", label: "Quebec" },
    { value: "other", label: "Other / not listed" },
  ],
};

const roleOptions: ReadonlyArray<SelectOption> = [
  { value: "talent-acquisition", label: "Talent acquisition/recruiting" },
  { value: "hr-people", label: "HR/People" },
  { value: "hiring-manager", label: "Hiring manager" },
  { value: "business-owner-executive", label: "Business owner/executive" },
  { value: "other", label: "Other" },
];

const HIRING_HELP_SUPPORT_HREF =
  "https://www.linkedin.com/help/recruiter/solve?src=direct%2Fnone&veh=direct%2Fnone%7Cdirect%2Fnone&_gl=1*1x56f7h*_gcl_aw*R0NMLjE3NzY4Nzk3ODUuQ2p3S0NBanc0NkhQQmhBTUVpd0FTWnBMUkdLLXV4U2NlNVlxS3ZESm9CcWNrM0hjeVhNUjdMdE5PYmR2djM3ZEFmN0FiQzdvZmhtTWN4b0N0VFVRQXZEX0J3RQ..*_gcl_dc*R0NMLjE3NzY4Nzk3ODUuQ2p3S0NBanc0NkhQQmhBTUVpd0FTWnBMUkdLLXV4U2NlNVlxS3ZESm9CcWNrM0hjeVhNUjdMdE5PYmR2djM3ZEFmN0FiQzdvZmhtTWN4b0N0VFVRQXZEX0J3RQ..*_gcl_au*NDU2NDI0MjMzLjE3NzQ4ODgwNTYuMTE1Njg3Nzc0MS4xNzgwNTAzMjY5LjE3ODA1MDMyNjk.";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isPresent(value: string) {
  return value.trim().length > 0;
}

function getEmailErrorText(email: string) {
  if (!isPresent(email)) {
    return "Enter your email.";
  }

  if (validateWorkEmail(email).kind === "invalid-format") {
    return "Enter a valid email address.";
  }

  return null;
}

function getStateProvinceOptions(country: string) {
  return stateProvinceOptionsByCountry[country] ?? [];
}

function EntryLixOptionCard({
  badge,
  description,
  icon,
  onClick,
  title,
}: Readonly<{
  badge?: ReactNode;
  description: string;
  icon: "person" | "signal-ai";
  onClick: () => void;
  title: string;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[112px] w-full flex-col items-start gap-sm rounded-sm border border-border-faint bg-background p-lg text-left outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:border-ai-border hover:bg-ai-background-soft focus-visible:border-ai-border focus-visible:ring-4 focus-visible:ring-action-focus-ring active:bg-background-transparent-active"
    >
      <Icon name={icon} size="small" className="text-ai-icon" />
      <span className="flex min-w-0 flex-wrap items-center gap-xs">
        <span className="text-heading-md text-text">{title}</span>
        {badge}
      </span>
      <span className="text-body-sm text-text-meta">{description}</span>
    </button>
  );
}

export function EntryLixChoiceScreen({
  onChatWithAi,
  onFillOutForm,
}: EntryLixChoiceScreenProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[384px] flex-1 flex-col px-xxl pb-xxxl pt-xxl">
        <div className="flex flex-col text-left">
          <h2 className="text-display-md text-text">
            {HIRING_CONCIERGE_TITLE}
          </h2>
          <p className="mt-sm text-body-md text-text-meta">
            Choose how you want to connect.
          </p>
        </div>

        <div className="mt-stack flex flex-col gap-md">
          <EntryLixOptionCard
            icon="signal-ai"
            title="Chat with AI assistant"
            description="Get immediate answers and connect with a sales rep when you're ready."
            badge={
              <span className="rounded-round bg-ai-background-strong px-sm py-xxs text-supportive-s-strong text-action">
                New
              </span>
            }
            onClick={onChatWithAi}
          />
          <EntryLixOptionCard
            icon="person"
            title="Have someone contact me"
            description="Share your details and a sales rep will contact you."
            onClick={onFillOutForm}
          />
        </div>

        <Link
          href={HIRING_HELP_SUPPORT_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex h-12 shrink-0 select-none items-center justify-center border border-transparent bg-transparent text-action outline-none transition-[color,box-shadow] duration-150 ease-out hover:text-action-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring active:text-action-active"
        >
          <span className="inline-flex h-6 items-center justify-center gap-xs rounded-xs px-sm text-control-sm transition-[background-color,color] duration-150 ease-out hover:bg-action-background-transparent-hover active:bg-action-background-transparent-active">
            Looking for help &amp; support?
          </span>
        </Link>
      </div>
    </div>
  );
}

function EntryLixSelectField({
  disabled = false,
  error = false,
  errorText,
  helperText,
  id,
  label,
  options,
  placeholder,
  required,
  value,
  "aria-describedby": ariaDescribedBy,
  ...props
}: EntryLixSelectFieldProps) {
  const selectId = id ?? String(props.name);
  const messageId = `${selectId}-message`;
  const isInvalid = error || Boolean(errorText);
  const statusText = isInvalid ? errorText : helperText;
  const describedBy = [ariaDescribedBy, statusText ? messageId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex w-full flex-col gap-xxs font-sans">
      <label
        htmlFor={selectId}
        className={cx(
          "text-body-xs text-label",
          disabled && "text-label-disabled",
        )}
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="text-negative">
            *
          </span>
        ) : null}
      </label>

      <div
        className={cx(
          "flex h-[var(--design-layout-input-large-height)] w-full items-center rounded-xs border bg-background px-md text-body-md transition-[background-color,border-color] duration-150 ease-out",
          disabled
            ? "border-transparent bg-background-disabled text-text-disabled"
            : isInvalid
              ? "border-negative text-text hover:border-negative-hover active:border-negative-active focus-within:border-negative-active focus-within:hover:border-negative-active"
              : "border-border text-text hover:border-border-hover active:border-border-active focus-within:border-border-active focus-within:hover:border-border-active",
        )}
      >
        <select
          {...props}
          id={selectId}
          disabled={disabled}
          required={required}
          value={value}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy || undefined}
          className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-inherit outline-none disabled:cursor-not-allowed"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size="small"
          className={cx("text-icon", disabled && "text-icon-disabled")}
        />
      </div>

      {statusText ? (
        <p
          id={messageId}
          className={cx(
            "min-h-[15px] text-supportive-s",
            disabled
              ? "text-text-disabled"
              : isInvalid
                ? "text-negative"
                : "text-text-meta",
          )}
        >
          {statusText}
        </p>
      ) : null}
    </div>
  );
}

export function EntryLixLeadFormScreen({
  onSubmit,
}: EntryLixLeadFormScreenProps) {
  const [form, setForm] = useState<EntryLixFormState>(initialFormState);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const stateProvinceOptions = getStateProvinceOptions(form.country);
  const isStateProvinceRequired = stateProvinceOptions.length > 0;
  const emailErrorText = getEmailErrorText(form.email);
  const showEmailError = hasAttemptedSubmit && Boolean(emailErrorText);

  const handleTextInputChange = useCallback(
    (field: keyof Pick<
      EntryLixFormState,
      "firstName" | "lastName" | "company" | "email" | "phoneNumber"
    >) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setForm((prev) => ({ ...prev, [field]: value }));
      },
    [],
  );

  const handleCountryChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.currentTarget.value;
      setForm((prev) => ({
        ...prev,
        country: value,
        stateProvince: "",
      }));
    },
    [],
  );

  const handleStateProvinceChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.currentTarget.value;
      setForm((prev) => ({
        ...prev,
        stateProvince: value,
      }));
    },
    [],
  );

  const handleRoleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.currentTarget.value;
      setForm((prev) => ({
        ...prev,
        role: value,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setHasAttemptedSubmit(true);

      const isValid =
        isPresent(form.firstName) &&
        isPresent(form.lastName) &&
        isPresent(form.company) &&
        emailErrorText === null &&
        isPresent(form.phoneNumber) &&
        isPresent(form.country) &&
        (!isStateProvinceRequired || isPresent(form.stateProvince)) &&
        isPresent(form.role);

      if (!isValid) {
        return;
      }

      onSubmit();
    },
    [emailErrorText, form, isStateProvinceRequired, onSubmit],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex w-full max-w-[384px] flex-col px-xxl pb-xxxl pt-xxl"
      >
        <div className="flex flex-col text-left">
          <Icon
            name="person"
            label="Have someone contact me"
            className="!size-7 text-ai-icon"
          />
          <h2 className="mt-md text-display-md text-text">
            Have someone contact me
          </h2>
          <p className="mt-sm text-body-xs text-text-meta">
            Forms submitted between 9:00 AM and 12:00 PM PST Monday-Friday will
            receive a response within 2 hours. Forms submitted after 12:00 PM
            PST may receive a response on the next business day (excluding
            weekends and holidays).
          </p>
        </div>

        <div className="mt-stack flex flex-col gap-lg">
          <TextInput
            label="First name"
            name="firstName"
            autoComplete="given-name"
            required
            size="large"
            trailingIcon={null}
            value={form.firstName}
            onChange={handleTextInputChange("firstName")}
            error={hasAttemptedSubmit && !isPresent(form.firstName)}
            errorText={
              hasAttemptedSubmit && !isPresent(form.firstName)
                ? "Enter your first name."
                : undefined
            }
          />
          <TextInput
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            required
            size="large"
            trailingIcon={null}
            value={form.lastName}
            onChange={handleTextInputChange("lastName")}
            error={hasAttemptedSubmit && !isPresent(form.lastName)}
            errorText={
              hasAttemptedSubmit && !isPresent(form.lastName)
                ? "Enter your last name."
                : undefined
            }
          />
          <TextInput
            label="Company"
            name="company"
            autoComplete="organization"
            required
            size="large"
            trailingIcon={null}
            value={form.company}
            onChange={handleTextInputChange("company")}
            error={hasAttemptedSubmit && !isPresent(form.company)}
            errorText={
              hasAttemptedSubmit && !isPresent(form.company)
                ? "Enter your company."
                : undefined
            }
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@company.com"
            required
            size="large"
            trailingIcon={null}
            value={form.email}
            onChange={handleTextInputChange("email")}
            error={showEmailError}
            errorText={showEmailError ? emailErrorText ?? undefined : undefined}
          />
          <TextInput
            label="Phone number"
            name="phoneNumber"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            size="large"
            trailingIcon={null}
            value={form.phoneNumber}
            onChange={handleTextInputChange("phoneNumber")}
            error={hasAttemptedSubmit && !isPresent(form.phoneNumber)}
            errorText={
              hasAttemptedSubmit && !isPresent(form.phoneNumber)
                ? "Enter your phone number."
                : undefined
            }
          />
          <EntryLixSelectField
            label="Country/Region"
            name="country"
            placeholder="Select country/region"
            options={countryOptions}
            value={form.country}
            onChange={handleCountryChange}
            required
            error={hasAttemptedSubmit && !isPresent(form.country)}
            errorText={
              hasAttemptedSubmit && !isPresent(form.country)
                ? "Select your country/region."
                : undefined
            }
          />
          {isStateProvinceRequired ? (
            <EntryLixSelectField
              label="State/Province"
              name="stateProvince"
              placeholder="Select state/province"
              options={stateProvinceOptions}
              value={form.stateProvince}
              onChange={handleStateProvinceChange}
              required
              error={hasAttemptedSubmit && !isPresent(form.stateProvince)}
              errorText={
                hasAttemptedSubmit && !isPresent(form.stateProvince)
                  ? "Select your state/province."
                  : undefined
              }
            />
          ) : null}
          <EntryLixSelectField
            label="Your role"
            name="role"
            placeholder="Select your role"
            options={roleOptions}
            value={form.role}
            onChange={handleRoleChange}
            required
            error={hasAttemptedSubmit && !isPresent(form.role)}
            errorText={
              hasAttemptedSubmit && !isPresent(form.role)
                ? "Select your role."
                : undefined
            }
          />
        </div>

        <Button
          type="submit"
          size="medium"
          variant="primary"
          className="mt-stack w-full"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export function EntryLixSuccessScreen({
  onChatWithAi,
  onDone,
}: EntryLixSuccessScreenProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[384px] flex-1 flex-col px-xxl pb-xxxl pt-xxl">
        <div className="flex flex-1 flex-col justify-center text-left">
          <span className="inline-flex size-12 items-center justify-center rounded-round bg-ai-background-soft text-ai-icon">
            <Icon name="check" size="medium" label="Success" />
          </span>
          <h2 className="mt-xl text-display-md text-text">
            You&apos;re all set
          </h2>
          <p className="mt-sm text-body-md text-text-meta">
            Someone from LinkedIn will contact you soon by email or phone.
          </p>
        </div>

        <Button
          type="button"
          size="medium"
          variant="primary"
          className="mt-stack w-full"
          onClick={onDone}
        >
          Done
        </Button>

        <div className="mt-lg flex flex-col gap-sm">
          <p className="text-center text-body-md text-text">
            Want answers now?
          </p>
          <Button
            type="button"
            size="medium"
            variant="secondary"
            className="w-full"
            onClick={onChatWithAi}
          >
            Chat with AI
          </Button>
        </div>
      </div>
    </div>
  );
}
