---
name: new-game
description: Scaffold a new three.js game workspace in games/<name> following repo conventions, verify it, and take it through the protected-main PR flow
argument-hint: <game-name> [short description of the game]
---

# New game scaffold

Creates a new game workspace at `games/<name>`, wires it into the monorepo, verifies it, and merges it via pull request. Follow the steps in order; every file below is mandatory.

## Steps

### 1. Validate

- The name must be kebab-case (`[a-z][a-z0-9-]*`). Reject anything else.
- Fail if `games/<name>` already exists.

### 2. Branch

`main` is protected — never commit to it directly.

```
git switch main
git pull
git switch -c game/<name>
```

### 3. Scaffold

Read the `three` version from `games/starter/package.json` and reuse it **verbatim** — all games must share one three.js version so pnpm dedupes to a single instance (duplicates break `instanceof` checks).

**`games/<name>/package.json`** — the `typecheck` script is mandatory; without it, CI's `pnpm -r typecheck` silently skips this workspace:

```json
{
  "name": "@games/<name>",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc -p ."
  },
  "dependencies": {
    "@games/shared": "workspace:*",
    "three": "<version copied from games/starter>"
  }
}
```

**`games/<name>/tsconfig.json`**:

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
```

**`games/<name>/index.html`** — same shell as `games/starter/index.html`, with `<title>` set to the game's display name.

**`games/<name>/src/main.ts`** — bootstrap through `createGame` from `@games/shared` (never hand-roll renderer/scene/camera/resize). If the user described gameplay, start from that; otherwise copy the starter's shape: lights, ground, one placeholder mesh, `game.start((dt, elapsed) => ...)`.

**`games/<name>/e2e/smoke.spec.ts`** — mandatory. Copy `games/starter/e2e/smoke.spec.ts` as-is (page loads, canvas visible, no console errors after a few frames). The root `playwright.config.ts` auto-discovers `games/*` and **throws if this directory is missing**, so skipping it breaks `pnpm test` for the whole repo. Extend it with game-specific assertions if the gameplay warrants.

### 4. Verify

```
pnpm install
pnpm --filter @games/<name> typecheck
pnpm --filter @games/<name> build
pnpm test:e2e --project <name>
```

`pnpm install` links the new workspace and updates `pnpm-lock.yaml` — that lockfile change must be committed with the scaffold. The `test:e2e` run needs Playwright's browser once per machine: `pnpm exec playwright install chromium`.

### 5. Pull request

Commit everything (including `pnpm-lock.yaml`), push, and merge once CI is green:

```
git push -u origin game/<name>
gh pr create --title "Add <name> game" --body "<one-paragraph summary>"
gh pr checks --watch
gh pr merge --squash --delete-branch
```

Repo rules apply: plain commit messages, no AI-attribution trailers.
