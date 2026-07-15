import { Icon } from "@/components/primitives/icon";

type MicrophoneVoiceBannerProps = Readonly<{
  message?: string;
}>;

export function MicrophoneVoiceBanner({
  message = "Allow microphone access to use voice.",
}: MicrophoneVoiceBannerProps) {
  return (
    <div
      role="alert"
      className="flex w-full items-center gap-sm rounded-sm border border-border-faint bg-background px-md py-sm text-body-sm-open font-medium text-text shadow-raised-faint"
    >
      <Icon
        name="signal-error"
        size="small"
        className="shrink-0 text-negative"
      />
      <span>{message}</span>
    </div>
  );
}
