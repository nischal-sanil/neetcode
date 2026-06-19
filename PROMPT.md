# Kickoff prompt — paste this into Claude Code

Read `CLAUDE.md` first. It has the data schema, the chosen stack, the database schema, and the code-execution contract — treat all of that as settled and don't relitigate it. The `/data` folder already contains the full content (150 problems, 18 topics with a dependency graph, and 14 runnable challenges with verified test cases). Your job is to build the app around it. What follows is intent and priorities — the things I care about that you won't find in the schema.

## The point of this app

I'm using this to actually learn the NeetCode 150 by solving problems in the browser, not to passively read. So the solve loop has to feel good: open a problem, see a clean editor with a sensible stub, write a solution, hit run, get fast and legible pass/fail feedback against real cases, and watch my progress fill in across the roadmap. The roadmap is the soul of the product — it should make the dependency structure between topics feel tangible and make me want to clear the next node.

## Design direction

Make it look like a tool someone with taste built for themselves, not a bootstrapped admin dashboard. Specifics I care about:

- **Dark, focused, high-contrast.** This is a place to concentrate. Pick one confident accent color and a real type scale; avoid the default shadcn-gray-everything look. Give it a small amount of personality (a considered logotype/wordmark, a consistent visual motif tying the roadmap and the problem views together).
- **The roadmap is the hero screen.** Render the topic dependency graph as the landing view. Each node is a topic showing its name, problem count, and a progress ring/fill that reflects how many problems I've solved in it. Edges should read clearly as "this unlocks that." Lay it top-down following the prerequisite flow. It should be pannable/zoomable but legible at first paint without fiddling. Hovering or selecting a node should preview the topic; clicking enters it. Consider subtly de-emphasizing topics whose prerequisites I haven't started, so the path forward is obvious — but never hard-lock anything; I can jump anywhere.
- **Motion with restraint.** Progress rings animate when they change, a solved problem gets a satisfying confirmation, transitions between roadmap → topic → problem feel connected. No gratuitous spinners or bouncing.
- **Density done right.** The problem list should be scannable at a glance: difficulty as color, solved/attempted/starred state obvious, the recommended order preserved. I should be able to move through a topic without friction.
- **The solve view is two panes:** problem context + editor/tests. Keep my eyes on the code. Test results should show per-case pass/fail with the input, my output, and the expected output on failure — readable at a glance, not a wall of JSON. Make "Run" a first-class action with a keyboard shortcut, and surface a clear all-pass moment that records the solve.

## Things to get right that are easy to get wrong

- **Code runs in a Web Worker with a timeout, client-side only.** Don't reach for a Docker judge, a Python subprocess, or any server-side execution — the whole point is zero-backend execution. Pyodide boots slowly; warm it once and keep it alive, and never touch it during SSR. The execution and comparison contract in `CLAUDE.md` is exact — implement it faithfully, including the deep-copy of args and the three comparison modes.
- **Only 14 problems are playable right now.** The other 136 are real catalogue entries with metadata and a LeetCode link but no editor/tests yet. Design both states deliberately: a non-playable problem should still feel intentional (context, "open on LeetCode", a clear "no in-app tests yet" affordance), not broken. Don't fake test cases for them.
- **Autosave my code per problem+language, debounced, to Postgres** through a server action — losing a draft on refresh would be the most annoying possible bug. Restore it when I reopen the problem. Switching language swaps to that language's draft (or the stub).
- **Progress is derived, not hand-managed.** First run flips a problem to "attempted"; an all-pass flips it to "solved" and stamps the time; the roadmap rings recompute from those rows. Don't scatter status logic across components — centralize the transitions.
- **Respect the content/state split and the copyright rule in `CLAUDE.md`.** Never paste in problem statements; link out.

## Suggested build order

1. Scaffold Next.js + Tailwind + Drizzle, wire up the local Postgres connection, push the schema, and confirm a round-trip read/write before any UI polish.
2. Load the JSON content and build the **roadmap graph** with live solved-counts — get this feeling great first, since it's the spine.
3. Topic view → problem list with state.
4. The **solve view**: Monaco + the two execution workers + the test panel, end-to-end on a playable problem, including autosave and the status transitions.
5. The non-playable problem state, starring, and any stats (a solved-over-time view or streak is a nice touch if time allows).
6. Polish pass: motion, empty states, keyboard shortcuts, responsive behavior down to a laptop screen.

After step 1 and again after step 4, pause and tell me how to run it so I can sanity-check before you keep going. If something in the data or contract is ambiguous, ask rather than guessing. Make it something I'm glad to open every day.
