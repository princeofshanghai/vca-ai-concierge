import Image from "next/image";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function LinkedInBugSdui({
  className,
}: Readonly<{
  className?: string;
}>) {
  return (
    <Image
      alt="LinkedIn"
      className={cx("size-[34px] shrink-0", className)}
      height={34}
      src="/assets/global-navigation/linkedin-bug-sdui.svg"
      width={34}
    />
  );
}
