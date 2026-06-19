import { cn } from "@/lib/utils"

/**
 * Wordmark — the product identity.
 *
 * "150" lockup: a small amber node-glyph (echoing the roadmap nodes) sitting
 * next to a tight, display-weight logotype. The dot in the glyph is the same
 * motif used for solved nodes on the graph, so the brand and the product read
 * as one thing.
 */
export function Wordmark({
  className,
  showMark = true,
}: {
  className?: string
  showMark?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display select-none",
        className
      )}
    >
      {showMark && <WordmarkGlyph className="size-6 shrink-0" />}
      <span className="text-[1.0625rem] font-semibold leading-none tracking-tight">
        <span className="text-foreground">Neet</span>
        <span className="text-muted-foreground">path</span>
        <span className="ml-1 align-top text-[0.6875rem] font-semibold tracking-normal text-primary tabular-nums">
          150
        </span>
      </span>
    </span>
  )
}

/**
 * The standalone mark: a node within a ring — the atomic unit of the roadmap.
 * Usable on its own (favicons, compact nav, loading states).
 */
export function WordmarkGlyph({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid place-items-center rounded-[0.4rem] bg-card glow-accent",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-[68%]"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          className="stroke-primary/35"
          strokeWidth="2"
        />
        {/* the "filled" arc — the satisfying-progress motif */}
        <path
          d="M12 3 a9 9 0 0 1 7.79 13.5"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3" className="fill-primary" />
      </svg>
    </span>
  )
}
