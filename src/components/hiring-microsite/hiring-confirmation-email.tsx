import Image from "next/image";

type HiringConfirmationEmailProps = Readonly<{
  compact?: boolean;
  meetingFormat?: "online" | "phone";
  theme?: "dark" | "light";
}>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function MicrosoftTeamsMeetingDetails({
  theme,
}: Readonly<{ theme: "dark" | "light" }>) {
  const isDark = theme === "dark";

  return (
    <section
      id="mock-microsoft-teams-meeting"
      aria-label="Microsoft Teams meeting details"
      className={cx(
        "border-t pt-xxl text-[13px] leading-5",
        isDark
          ? "border-white/40 text-[#cfcfcf]"
          : "border-border-subtle text-text-meta",
      )}
    >
      <h3
        className={cx(
          "text-[16px] font-semibold leading-6",
          isDark ? "text-[#e6e6e6]" : "text-text",
        )}
      >
        Microsoft Teams meeting
      </h3>
      <p className="mt-sm">
        <span
          className={cx(
            "font-semibold",
            isDark ? "text-[#e6e6e6]" : "text-text",
          )}
        >
          Join:{" "}
        </span>
        <a
          href="#mock-microsoft-teams-meeting"
          className={cx(
            "break-all underline underline-offset-2",
            isDark ? "text-[#70b5f9]" : "text-action",
          )}
        >
          https://teams.microsoft.com/meet/279959600397106?p=nFQowY3OK72e82cY3g
        </a>
      </p>
      <dl className="mt-xs">
        <div className="flex flex-wrap gap-xs">
          <dt>Meeting ID:</dt>
          <dd>279 959 600 397 106</dd>
        </div>
        <div className="flex flex-wrap gap-xs">
          <dt>Passcode:</dt>
          <dd>SN2qu3G9</dd>
        </div>
      </dl>

      <div
        className={cx(
          "mt-xl border-t pt-lg",
          isDark ? "border-white/40" : "border-border-subtle",
        )}
      >
        <a
          href="#mock-microsoft-teams-meeting"
          className={cx(
            "underline underline-offset-2",
            isDark ? "text-[#70b5f9]" : "text-action",
          )}
        >
          Need help?
        </a>
        <span aria-hidden="true"> | </span>
        <a
          href="#mock-microsoft-teams-meeting"
          className={cx(
            "underline underline-offset-2",
            isDark ? "text-[#70b5f9]" : "text-action",
          )}
        >
          Meeting options
        </a>
      </div>
    </section>
  );
}

export function HiringConfirmationEmail({
  compact = false,
  meetingFormat = "phone",
  theme = "light",
}: HiringConfirmationEmailProps) {
  const isPhoneCall = meetingFormat === "phone";
  const isDark = theme === "dark";
  const emailTextClassName = isDark ? "text-[#e6e6e6]" : "text-text";

  return (
    <article
      aria-label={`${isDark ? "Dark" : "Light"} theme hiring specialist meeting confirmation email`}
      className={cx(
        "overflow-hidden border",
        isDark
          ? "border-white/70 bg-[#333333] text-[#e6e6e6]"
          : "border-border-subtle bg-background text-text",
        compact ? "w-[22.5rem]" : "w-[40rem]",
      )}
    >
      <div aria-hidden="true" className="h-[6px] bg-action" />

      <div className={compact ? "px-xxl py-xxxl" : "px-12 py-10"}>
        <header className="flex justify-end">
          <Image
            src="/assets/linkedin-bug-blue.svg"
            alt="LinkedIn"
            width={26}
            height={26}
            className={compact ? "size-8" : "size-10"}
          />
        </header>

        <main
          className={cx(
            "text-[16px] leading-[26px]",
            emailTextClassName,
            compact ? "mt-xxxl space-y-xl" : "mt-10 space-y-xxl",
          )}
        >
          <p>Hi Jamie,</p>

          <p>
            Thanks for booking time with us! You&apos;re confirmed to speak with a
            LinkedIn hiring specialist.
          </p>

          <p>
            This will be a quick 15–30 minute conversation focused on your
            hiring and business goals.
          </p>

          <section aria-label="Meeting format">
            <h3 className={cx("font-semibold", emailTextClassName)}>
              {isPhoneCall ? "Phone call" : "Online meeting"}
            </h3>
            <p className={cx("mt-xs", emailTextClassName)}>
              {isPhoneCall
                ? "A LinkedIn hiring specialist will call you at (982) 710-9369 at the scheduled time."
                : "Use the Microsoft Teams link below to join."}
            </p>
          </section>

          <section aria-label="Additional notes">
            <h3 className={cx("font-semibold", emailTextClassName)}>
              Additional notes
            </h3>
            <p className="mt-xs">This is my message.</p>
          </section>

          <p>
            If you&apos;re unable to attend, you can{" "}
            <a
              href="#cancel-meeting"
              className={cx(
                "font-semibold no-underline",
                isDark ? "text-[#70b5f9]" : "text-action",
              )}
            >
              cancel your meeting here
            </a>
            .
          </p>

          <div>
            <p>Looking forward to speaking with you!</p>
            <p className="font-semibold">— LinkedIn Hiring Team</p>
          </div>

          {isPhoneCall ? null : (
            <MicrosoftTeamsMeetingDetails theme={theme} />
          )}
        </main>
      </div>
    </article>
  );
}
