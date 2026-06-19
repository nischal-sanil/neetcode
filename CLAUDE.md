# CLAUDE.md

Reference facts for this project. Design intent and build sequencing live in the kickoff prompt, not here. This file is the source of truth for the data schema, stack, database, and the code-execution contract.

## What this is

A local, single-user web app that turns the **NeetCode 150** into an interactive learning environment: a visual dependency roadmap of the 18 topics, a browsable problem list per topic, and an in-browser code editor where the user solves a subset of problems against real test cases in Python or JavaScript. Progress persists to a local Postgres database. There is no auth and no multi-user concept — it runs only on this machine.

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
  playable: boolean          // true => has an entry in challenges.json with runnable tests
}]
```

### `challenges.json` — the runnable subset (14 problems today)
```
version: number
challenges: [{
  slug: string               // matches a problem with playable:true
  entry_function: string     // function name the user must define (LeetCode-style camelCase, same in both languages)
  params: string[]           // ordered parameter names
  comparison: "exact"|"set"|"nested-unordered"
  starter_code: { python: string, javascript: string }   // function stub the editor opens with
  test_cases: [{ args: any[], expected: any }]            // args spread into entry_function in order
}]
```
Only problems with simple JSON-serializable I/O (arrays/strings/ints/bools) are playable right now. Problems whose `io_kind` is `tree`, `linkedlist`, `graph`, `heap`, or `design` need per-problem build/serialize helpers in the harness before they can become playable; they are intentionally `playable:false` and ship no test cases. Adding more later means: add a `challenges.json` entry, set the problem's `playable:true`, and (for structured I/O) extend the harness with the relevant (de)serializer.

## Code-execution contract

Both languages run **inside a Web Worker**, never on the main thread, and never on the server. The worker receives a message and returns per-case results. It must **not** return the reference solution (there is none stored — only inputs and expected outputs).

Worker input:
```
{ code: string, entryFunction: string, testCases: [{args, expected}], comparison: string }
```
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
npm run db:seed                   # optional: load /data JSON into reference tables if you choose DB-backed content
npm run dev
```

## Conventions and hard constraints

- **Never embed LeetCode problem statements.** They are copyrighted. The app links out via `leetcode_url`. Show only our own short `blurb`/title/metadata. For the 7 `is_premium` problems the LeetCode link is paywalled — surface a small "LeetCode Premium" badge and still link out (do not fabricate alternate URLs).
- `slug` is the join key across all three JSON files and all DB tables. `category` id joins problems to categories.
- Keep all problem **content** in JSON and all **user state** in Postgres — don't blur the two.
- Two languages only for now: `python`, `javascript`. The schema and editor language switch should be data-driven so adding languages later is additive.
- Entry-function names are LeetCode-style camelCase and identical across both languages, so test cases are language-agnostic.
