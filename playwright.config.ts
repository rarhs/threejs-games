import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// Every games/* workspace gets a Playwright project and its own dev server.
// A game without an e2e/ directory fails here so the smoke-test convention
// can't be skipped silently.
const gamesRoot = path.join(__dirname, "games");
const games = fs
  .readdirSync(gamesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const game of games) {
  if (!fs.existsSync(path.join(gamesRoot, game, "e2e"))) {
    throw new Error(
      `games/${game} has no e2e/ directory — every game needs a smoke test (copy games/starter/e2e).`,
    );
  }
}

const basePort = 4173;
const port = (index: number) => basePort + index;

export default defineConfig({
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  projects: games.map((game, i) => ({
    name: game,
    testDir: path.join(gamesRoot, game, "e2e"),
    use: {
      ...devices["Desktop Chrome"],
      baseURL: `http://localhost:${port(i)}`,
      // Allow software WebGL so three.js renders in headless CI runners.
      launchOptions: { args: ["--enable-unsafe-swiftshader"] },
    },
  })),
  webServer: games.map((game, i) => ({
    command: `pnpm --filter @games/${game} exec vite --port ${port(i)} --strictPort`,
    url: `http://localhost:${port(i)}`,
    reuseExistingServer: !process.env.CI,
  })),
});
