# threejs-games

Monorepo for three.js games using pnpm workspaces, Vite, and TypeScript.

## Layout

```
packages/shared/   Reusable engine helpers (@games/shared)
games/starter/     Starter game template (@games/starter)
```

## Getting started

pnpm is pinned via the `packageManager` field — enable corepack once (`corepack enable`) if you don't have pnpm.

```bash
pnpm install       # once, from the repo root
pnpm dev           # runs the starter game at http://localhost:5173
```

For any other game: `pnpm --filter @games/<name> dev`

## Adding a new game

1. Copy `games/starter` to `games/<your-game>`.
2. In its `package.json`, change `"name"` to `@games/<your-game>` and keep the `"typecheck"` script — the root `pnpm typecheck` (`pnpm -r`) silently skips workspaces without it.
3. Run `pnpm install` from the root (links the new workspace and updates `pnpm-lock.yaml` — commit that too).
4. Run it: `pnpm --filter @games/<your-game> dev`

## Conventions

- **One `three` version for the whole repo** — `three` is a `peerDependency` of `packages/shared`; each game declares its own `three` dependency with the same version range so pnpm dedupes to a single copy (duplicates break `instanceof` checks). When upgrading three.js, bump every declaration together.
- Shared code goes in `packages/shared` and is imported as `@games/shared` (`workspace:*`). It ships as TypeScript source; Vite compiles it as part of each game's build, so there's no separate build step.
- All tsconfigs extend `tsconfig.base.json` (strict, ES2022, `noEmit`).
- `pnpm build` builds every game; `pnpm typecheck` type-checks everything; `pnpm lint` runs ESLint over the whole repo (single flat config at the root).

## Contributing

`main` is protected — no direct pushes. Work on a branch, open a pull request, and merge once the `ci` check passes (lint, typecheck, build). The branch must be up to date with `main`.
