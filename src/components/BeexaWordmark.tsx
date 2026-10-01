// Wordmark "BeexA": texto en currentColor (adapta a modo claro/oscuro),
// "A" personalizada en amarillo abeja. Se usa en Auth y LoadingScreen.
export function BeexaWordmark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 430 180"
      className={className}
      role="img"
      aria-label="Beexa"
    >
      <text
        x="20"
        y="125"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="120"
        fontWeight="700"
        letterSpacing="-5"
        fill="currentColor"
      >
        Beex
      </text>

      {/* A personalizada */}
      <path
        d="M305 125 L350 25 L395 125"
        fill="none"
        stroke="#F6B300"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="350" cy="92" r="8" fill="#F6B300" />
    </svg>
  );
}
