/** Stacked isometric diamonds from the FullStack Studio mark. */
export function LogoMark({
  className = "h-8 w-8",
  tone = "neon",
}: {
  className?: string;
  tone?: "neon" | "ink" | "white";
}) {
  const fill =
    tone === "neon" ? "var(--color-neon)" : tone === "white" ? "#ffffff" : "var(--color-ink)";

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M16 3.5 26.5 9.5 16 15.5 5.5 9.5 16 3.5Z"
        stroke={fill}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 14.2 16 20.2 26.5 14.2"
        stroke={fill}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 18.9 16 24.9 26.5 18.9"
        stroke={fill}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
