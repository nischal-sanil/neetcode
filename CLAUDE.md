# CLAUDE.md

Reference facts for this project. Design intent and build sequencing live in the kickoff prompt, not here. This file is the source of truth for the data schema, stack, database, and the code-execution contract.

## What this is

A local, single-user web app that turns the **NeetCode 150** into an interactive learning environment: a visual dependency roadmap of the 18 topics, a browsable problem list per topic, and an in-browser code editor where the user solves all 150 problems against real test cases in Python or JavaScript. Progress persists to a local Postgres database. There is no auth and no multi-user concept — it runs only on this machine.

## Stack (decided — do not substitute without reason)

- **Next.js 15** (App Router, React 19, TypeScript). One process. All database access happens in **Server Actions / Route Handlers** — there is no separate backend service. This is what "direct combination with the local DB" means here.
- **Tailwind CSS v4** + **shadcn/ui** for components, **lucide-react** for icons.
- **motion** (Framer Motion) for animation.
- **@xyflow/react** (React Flow) for the roadmap graph.
- **@monaco-editor/react** for the code editor.
- **Pyodide** (CPython → WASM) loaded **from the CDN inside a Web Worker** for Python execution.
- A second **Web Worker** for JavaScript execution.
- **Drizzle ORM** + **postgres** (porsager driver) for Postgres access.
- **zustand** for transient client editor state (current language, run status, output).

## Repository layout (target)

```
/app                Next.js routes (App Router)
  /roadmap          the graph view (home)
  /topic/[id]       problem list for one category
  /problem/[slug]   the solve view (editor + tests)
/components          UI components (RoadmapGraph, ProblemList, CodeEditor, TestPanel, ...)
/lib
  /db               drizzle client + schema + queries
  /workers          python.worker.ts, js.worker.ts (execution)
  /actions          server actions for progress + drafts
/data               static content, copied from this repo's /data (see below)
/drizzle            generated migrations
```

The `/data` folder in this repo is the seed content. Load it at build/runtime from JSON (import or `fs`), or seed it into Postgres once — either is fine, but the JSON is the canonical content and Postgres holds only user state.

## Data files (in `/data`)

### `categories.json`
```
version: number
categories: [{
  id: string                 // e.g. "arrays-hashing" (stable key, used everywhere)
  name: string               // "Arrays & Hashing"
  order: number              // 1..18, the recommended linear study order
  blurb: string              // one-line description of the pattern
  default_io: string         // coarse I/O shape hint for the topic
  prerequisites: string[]    // category ids that should come first
  position: {x, y}           // suggested coordinates for the roadmap graph
}]
graph: {
  nodes: [{ id, label, position:{x,y} }]
  edges: [{ id, source, target }]   // source is the prerequisite, target depends on it
}
```

### `problems.json` — all 150
```
version: number
count: number
problems: [{
  slug: string               // LeetCode slug, unique id for a problem
  title: string
  difficulty: "Easy"|"Medium"|"Hard"
  category: string           // category id
  order_in_category: number
  global_order: number       // 1..150 across the whole list
  leetcode_url: string       // canonical, always present and correct
  is_premium: boolean        // 7 problems are LeetCode-premium; the LeetCode link hits a paywall
  io_kind: string            // "array"|"string"|"tree"|"linkedlist"|"graph"|"heap"|"design"|"matrix"|"bit"
  playable: boolean          // derived: true iff data/challenges/<slug>.json exists (see sync-playable)
}]
```
`io_kind` is a coarse display hint and is NOT authoritative — several "array"/"heap" problems are actually stateful design classes. Classify a challenge from its real signature, not `io_kind`.

### `data/challenges/<slug>.json` — one bare Challenge object per problem (all 150 playable)
Challenges live as one file per slug under `data/challenges/`. `scripts/gen-challenge-index.mjs` builds the static barrel `data/challenges/index.ts` that `lib/data/content.ts` imports; `scripts/sync-playable.mjs` sets `problems.json.playable` from which files exist. (This per-file layout lets many authors add challenges in parallel without merge conflicts.)
```
{
  slug: string
  kind?: "function" | "design"        // default "function"
  entry_function: string              // LeetCode camelCase, same in both languages (design: the class name)
  params: string[]
  arg_types?: IoType[]                 // per-param encoding, parallel to a case's args[]; default all "plain"
  return_type?: IoType                 // encoding of the return; default "plain"
  mutates_arg?: number | null          // index of an in-place-mutated arg used AS the result (void problems)
  class_name?: string                  // kind:"design" only — operations[0] === class_name
  comparison: "exact"|"set"|"nested-unordered"|"float"
  starter_code: { python: string, javascript: string }
  test_cases: [{ args, expected }]                       // function kind
              | [{ operations, args, expected }]         // design kind (constructor/void slots => null)
}
// IoType = "plain"|"tree"|"linkedlist"|"linkedlist-cycle"|"linkedlist-random"|"graph-node"
```
Structured I/O crosses the worker boundary as plain JSON and is (de)serialized inside the worker by `lib/workers/serde.ts` (JS) and `lib/workers/py_harness.py` (Python, embedded via the generated `py-harness.generated.ts`): trees as LeetCode level-order arrays, linked lists as value arrays, clone-graph as 1-indexed adjacency, etc. Adding a problem: write `data/challenges/<slug>.json` + a reference under `/refsol`, run `npm run verify`, then `npm run gen`.

### `/refsol` and the verification gate
`/refsol/<slug>.{py,js}` (+ optional `.adversarial.*`) hold reference solutions used ONLY by the offline verifier — they are never imported by app code (eslint-banned) and never ship. `scripts/verify-challenge.mjs` runs every reference for a slug through the SAME serde/compare logic the workers use and asserts each reproduces every `expected`; `npm run verify` runs `serde-parity` (JS↔Python parity) + all 150. Every challenge must have ≥2 independent references that agree before it is trusted.

## Code-execution contract

Both languages run **inside a Web Worker**, never on the main thread, and never on the server. The worker receives a message and returns per-case results. It must **not** return the reference solution (there is none stored — only inputs and expected outputs).

Worker input:
```
{ code, entryFunction, testCases, comparison,
  mode?: "function"|"design", argTypes?, returnType?, mutatesArg?, className? }
```
For structured I/O the worker deserializes tagged args (via `argTypes`) into TreeNode/ListNode/graph-Node before the call and serializes the tagged return (`returnType`) back to plain JSON before comparing. `mode:"design"` instantiates `className` and replays the `operations` sequence, collecting each call's result.
Worker output:
```
{ results: [{ index, passed, got?, expected, error? }], summary: { passed, total, runtimeMs } }
```

Execution steps (identical logic in both workers):
1. Evaluate `code` so the user's `entryFunction` is defined (JS: `new Function(code + "; return " + entryFunction)`; Python via Pyodide: `exec` into a namespace, then fetch the function).
2. For each case: **deep-copy** the args (so a mutating solution can't corrupt later cases), call the function, capture the return value or the thrown error.
3. Compare `got` vs `expected` using the mode:
   - `exact` — deep structural equality.
   - `set` — compare the two top-level arrays as order-independent (sort both, then equal).
   - `nested-unordered` — sort each inner array, then sort the outer list, then equal (for results like 3Sum / Group Anagrams where neither inner nor outer order matters).
4. Guard against infinite loops: run with a **timeout (~5s)**; if exceeded, terminate the worker and report a timeout error for the remaining cases.

Pyodide specifics: load it from the CDN once per session and cache the interpreter in the worker; booting is slow (a few seconds) so show a one-time "starting Python" state and keep the worker warm. Never import or initialize Pyodide in a Server Component or during SSR.

## Database (local Postgres)

Connection: `DATABASE_URL=postgresql://localhost:5432/neetcode_local` in `.env.local`. Postgres holds **only user state**; all problem content comes from the JSON.

Schema (Drizzle):
```
problem_progress
  slug         text primary key
  status       text not null default 'not_started'   -- 'not_started' | 'attempted' | 'solved'
  starred      boolean not null default false
  attempts     integer not null default 0
  solved_at    timestamptz
  updated_at   timestamptz not null default now()

code_drafts
  slug         text not null
  language     text not null                          -- 'python' | 'javascript'
  code         text not null
  updated_at   timestamptz not null default now()
  primary key (slug, language)

submissions            -- run history (optional but useful for stats/heatmap)
  id           serial primary key
  slug         text not null
  language     text not null
  passed       boolean not null
  passed_cases integer not null
  total_cases  integer not null
  runtime_ms   integer
  created_at   timestamptz not null default now()
```

Writes from the client go through server actions: draft autosave (debounced), status transitions (`not_started`→`attempted` on first run, →`solved` when all cases pass), star toggles, and submission rows. Reads hydrate the roadmap (solved counts per category) and the problem list.

## Setup commands

```
brew services start postgresql@17
createdb neetcode_local
cp .env.example .env.local        # then confirm DATABASE_URL
npm install
npm run db:push                   # drizzle-kit push to create tables
npm run dev                       # predev runs gen (harness + challenge index + playable sync)
```

Content/verification scripts:
```
npm run gen        # regenerate py-harness.generated.ts, data/challenges/index.ts, problems.json playable
npm run verify     # serde JS↔Python parity + run every challenge's references through the harness
npm run verify:one <slug>
```

## Conventions and hard constraints

- **Never embed LeetCode problem statements.** They are copyrighted. The app links out via `leetcode_url`. Show only our own short `blurb`/title/metadata. For the 7 `is_premium` problems the LeetCode link is paywalled — surface a small "LeetCode Premium" badge and still link out (do not fabricate alternate URLs).
- `slug` is the join key across all three JSON files and all DB tables. `category` id joins problems to categories.
- Keep all problem **content** in JSON and all **user state** in Postgres — don't blur the two.
- Two languages only for now: `python`, `javascript`. The schema and editor language switch should be data-driven so adding languages later is additive.
- Entry-function names are LeetCode-style camelCase and identical across both languages, so test cases are language-agnostic.
