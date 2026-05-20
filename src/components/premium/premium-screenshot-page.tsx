import Image from "next/image";

type PremiumScreenshotPageProps = Readonly<{
  alt: string;
  height: number;
  src: string;
  width: number;
}>;

export function PremiumScreenshotPage({
  alt,
  height,
  src,
  width,
}: PremiumScreenshotPageProps) {
  return (
    <main className="min-h-dvh bg-background-neutral-soft px-3 py-4 text-text sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto w-full overflow-x-auto">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
          sizes={`${width}px`}
          className="mx-auto h-auto max-w-none rounded-sm shadow-[0_1px_8px_rgba(0,0,0,0.12)]"
        />
      </div>
    </main>
  );
}
