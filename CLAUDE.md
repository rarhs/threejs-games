# threejs-games

pnpm workspaces monorepo for three.js games (workspaces defined in `pnpm-workspace.yaml`). Two workspace groups: `packages/*` (shared code) and `games/*` (one directory per game). Use pnpm, not npm — the pnpm version is pinned via the `packageManager` field (corepack).

## Commands

- `pnpm dev` — dev server for `games/starter`; for any other game: `pnpm --filter @games/<name> dev`
- `pnpm build` — builds every workspace (`pnpm -r build`, skips workspaces without the script)
- `pnpm typecheck` — typechecks every workspace; each workspace has its own `"typecheck": "tsc -p ."` script. When adding a new game or package, include that script so the root aggregate picks it up.

## Conventions

- Shared code lives in `packages/shared` (`@games/shared`) and is consumed as **raw TypeScript**: its `exports`/`main`/`types` point at `src/index.ts` — no build step. Vite transpiles it when bundling each game; `moduleResolution: "bundler"` makes tsc resolve it the same way.
- Games depend on it with `"@games/shared": "workspace:*"` in `dependencies`.
- `three` is a `peerDependency` of `packages/shared`; each game declares its own `three` dependency. Keep versions aligned so npm dedupes to a single three.js instance (duplicates break `instanceof` checks).
- All tsconfigs extend `tsconfig.base.json` (strict, ES2022, `noEmit`).
- Line endings are LF everywhere, enforced by `.gitattributes`.

## Git

- Never add "Co-Authored-By: Claude" or any similar AI-attribution trailer to commit messages. Write plain commit messages describing the change only.
