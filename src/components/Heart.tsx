/**
 * The heart from the app icon, drawn as artwork rather than typed as `♥`.
 *
 * U+2665 is a text-default emoji: no font we ship covers it, so it always falls
 * back to a system font. Desktop lands on Helvetica and renders a monochrome
 * glyph that honours CSS `color`; iOS lands on Apple Color Emoji, whose glyphs
 * carry baked-in colour and ignore `color` entirely — so the same heart came
 * out paper-white on a laptop and Apple red on a phone. Drawing it ourselves
 * gives one heart on every platform, and `currentColor` keeps every existing
 * text-colour class working untouched.
 *
 * Sized in `em`, so it tracks the surrounding font-size like the character did.
 * The default is under 1em because this heart is rounder and wider than the
 * Helvetica glyph it replaces, and would otherwise sit heavy in running text.
 * Size goes through inline style so callers can override it — a utility class
 * would tie with the base one on specificity and lose.
 */
export function Heart({ className = '', size = '0.85em' }: { className?: string; size?: string }) {
  return (
    <svg
      viewBox="152 190 208 198"
      aria-hidden="true"
      focusable="false"
      style={{ width: size, height: size }}
      className={`inline-block fill-current align-[-0.11em] ${className}`}
    >
      <path d="M256 388c0 0-104-70-104-140 0-42 34-66 66-54 19 7 32 25 38 39 6-14 19-32 38-39 32-12 66 12 66 54 0 70-104 140-104 140z" />
    </svg>
  )
}
