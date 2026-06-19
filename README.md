# Neetpath 150

A local, single-user web app that turns the **NeetCode 150** into an interactive learning environment: a visual dependency roadmap of the 18 topics, a browsable problem list per topic, and an in-browser code editor that runs your Python/JavaScript solutions against real test cases — entirely client-side (Pyodide + JS web workers), with progress persisted to a local Postgres database.

## Stack

Next.js 16 (App Router, React 19, TS) · Tailwind v4 + shadcn/ui · @xyflow/react (roadmap) · Monaco editor · Pyodide + JS web workers (execution) · Drizzle ORM + Postgres · zustand.

Content (150 problems, 18 topics, 14 runnable challenges) lives in `/data` as JSON and is the source of truth. Postgres holds **only** user state (progress, drafts, submissions).

## Setup

```bash
brew services start postgresql@17
createdb neetcode_local              # once
cp .env.example .env.local           # confirm DATABASE_URL=postgresql://localhost:5432/neetcode_local
npm install
npm run db:push                      # create the 3 tables
npm run dev                          # http://localhost:3000
```

## Using it

- **/** — the roadmap. Topics laid out top-down by prerequisite; each node shows a progress ring. Click a node to enter it.
- **/topic/[id]** — the problem list for a topic, in recommended order, with difficulty colors and solved/attempted/starred state.
- **/problem/[slug]** — the solve view. 14 problems are playable (editor + tests); the rest link out to LeetCode. Pick a language, write your solution, and **Run** (Cmd/Ctrl+Enter). Drafts autosave per problem+language; all-pass marks the problem solved and the roadmap rings update.

The first Python run boots Pyodide from the CDN (a few seconds, once per session); JavaScript runs instantly.

## Scripts

| command | does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` / `npm start` | production build / serve |
| `npm run db:push` | push the Drizzle schema to Postgres |
| `npm run db:studio` | Drizzle Studio |
| `npm run lint` | eslint |

## Layout

```
app/            routes: / (roadmap), /topic/[id], /problem/[slug]
components/     roadmap/, topic/, solve/, ui/ (shadcn), brand/, shell/
lib/
  data/         typed JSON loaders (content)
  db/           drizzle client + schema + queries
  actions/      server actions: progress transitions, draft autosave
  workers/      js.worker, python.worker, comparison + 5s-timeout client
data/           categories.json, problems.json, challenges.json (seed content)
```
