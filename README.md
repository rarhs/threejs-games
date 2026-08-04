# threejs-games

Monorepo for three.js games using npm workspaces, Vite, and TypeScript.

## Layout

```
packages/shared/   Reusable engine helpers (@games/shared)
games/starter/     Starter game template (@games/starter)
```

## Getting started

```bash
npm install        # once, from the repo root
npm run dev        # runs the starter game at http://localhost:5173
```

## Adding a new game

1. Copy `games/starter` to `games/<your-game>`.
2. In its `package.json`, change `"name"` to `@games/<your-game>`.
3. Run `npm install` from the root (links the new workspace).
4. Run it: `npm run dev -w games/<your-game>`

## Conventions

- **One `three` version for the whole repo** — it lives in the root `package.json`. Game packages declare the same version range so npm hoists a single copy. When upgrading three.js, bump it in the root and in each game together.
- Shared code goes in `packages/shared` and is imported as `@games/shared`. It ships as TypeScript source; Vite compiles it as part of each game's build, so there's no separate build step.
- `npm run build` builds every game; `npm run typecheck` type-checks everything.
