import Image from "next/image";

const SIZE = 1080; // source art is a 1:1 square

/**
 * KK Create logo lockup.
 *
 * - Default: theme-aware — the black mark on light surfaces, the white mark on
 *   dark surfaces (e.g. the navbar, which sits on `bg-canvas`).
 * - `onDark`: always the white mark, for surfaces that stay dark in both themes
 *   (e.g. the footer's `bg-feature`).
 */
export function Logo({
  onDark = false,
  priority = false,
  className = "",
}: {
  onDark?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const box = `h-12 w-12 ${className}`.trim();

  if (onDark) {
    return (
      <Image
        src="/logo-white.png"
        alt="KK Create"
        width={SIZE}
        height={SIZE}
        priority={priority}
        className={box}
      />
    );
  }

  return (
    <>
      <Image
        src="/logo-black.webp"
        alt="KK Create"
        width={SIZE}
        height={SIZE}
        priority={priority}
        className={`${box} dark:hidden`}
      />
      <Image
        src="/logo-white.png"
        alt="KK Create"
        width={SIZE}
        height={SIZE}
        priority={priority}
        className={`hidden ${box} dark:block`}
      />
    </>
  );
}
