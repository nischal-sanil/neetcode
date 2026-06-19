import Link from "next/link"
import { Wordmark } from "@/components/brand/Wordmark"

/**
 * AppNav — the persistent top navigation.
 *
 * Server component. Intentionally minimal: the roadmap is the hero, so the
 * chrome stays out of the way. A hairline border + faint backdrop blur lets
 * the graph scroll under it without losing the wordmark.
 */
export function AppNav() {
  return (
    <header className="sticky top-0 z-40 h-14 w-full border-b border-border/80 bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex h-full w-full max-w-[1600px] items-center gap-6 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Neetpath 150 — roadmap"
          className="rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Wordmark />
        </Link>

        <div className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-md px-2.5 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Roadmap
          </Link>
        </div>

        <div className="ml-auto" />
      </nav>
    </header>
  )
}
