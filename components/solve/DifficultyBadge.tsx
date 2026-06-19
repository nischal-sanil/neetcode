import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/data/types";

const styles: Record<Difficulty, string> = {
  Easy: "text-difficulty-easy bg-difficulty-easy/12 border-difficulty-easy/25",
  Medium:
    "text-difficulty-medium bg-difficulty-medium/12 border-difficulty-medium/25",
  Hard: "text-difficulty-hard bg-difficulty-hard/12 border-difficulty-hard/25",
};

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full border px-2 text-xs font-medium",
        styles[difficulty],
        className,
      )}
    >
      {difficulty}
    </span>
  );
}
