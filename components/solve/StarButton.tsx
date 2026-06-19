"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";

import { toggleStar } from "@/lib/actions/progress";
import { cn } from "@/lib/utils";

export function StarButton({
  slug,
  initialStarred,
}: {
  slug: string;
  initialStarred: boolean;
}) {
  const [starred, setStarred] = useState(initialStarred);
  const [, startTransition] = useTransition();

  const onClick = () => {
    // Optimistic flip; server reconciles the authoritative value.
    setStarred((prev) => !prev);
    startTransition(async () => {
      const next = await toggleStar(slug);
      setStarred(next);
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={starred}
      aria-label={starred ? "Unstar problem" : "Star problem"}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg border border-edge transition-colors",
        starred
          ? "border-primary/40 bg-primary/10 text-primary"
          : "text-muted-foreground hover:border-edge hover:text-foreground",
      )}
    >
      <Star className={cn("size-4", starred && "fill-current")} />
    </button>
  );
}
