# Run Doc — My Quick Trippers (MQT 2.0)

How to reproduce the dev environment and run the server on this Windows machine
(Git Bash).

## 0. Layout notes

- The shell/workspace root is `C:\Users\vidis\OneDrive\Desktop\MQT2.0`.
- The project lives under **OneDrive Desktop**, so the filesystem is very slow.
  `.next` and `node_modules` are therefore **Windows junctions** pointing
  outside the sync layer (`AppData\Local\mqt-next-cache` and
  `AppData\Local\mqt-node-modules`) — this setup fixed chunk-load timeouts and
  partial-sync corruption. The startup scripts (`dev-prewarm.mjs`,
  `run-next.mjs`, `reinstall.mjs`, `health-check.mjs`) manage and verify it;
  do not bypass them.
- A portable Node lives in `.node/` (fallback); a system Node may also exist.
  Either works — the npm scripts below just need `node` on PATH.

## 1. Reproduce the artifacts

If `.node/` is missing, restore the portable Node (no admin, no PATH changes):

```bash
mkdir -p .node
curl -sL -o .node/node.zip https://nodejs.org/dist/v22.23.2/node-v22.23.2-win-x64.zip
cd .node && unzip -q node.zip && rm node.zip && mv node-v22.23.2-win-x64/* . && rmdir node-v22.23.2-win-x64 && cd ..
.node/node.exe --version   # v22.23.2
```

Install/repair dependencies — **never** run plain `npm install`, `npm ci`, or
`npm prune` from the project: they replace the `node_modules` junction with a
real directory inside OneDrive and corrupt the setup. Use the safe wrapper:

```bash
export PATH="$PWD/.node:$PATH"
npm run reinstall     # installs into the junction target, repairs both
                      # junctions, runs the health check, and rebuilds .next
                      # if the build output is missing/stale (--force to
                      # always rebuild). Refuses to run while a server is up.
```

There are no `.env` files or secrets required for `npm run dev`.

## 2. Run the server

IMPORTANT: `npm run dev -p <port>` does NOT work — npm eats `-p` as its own
`--production` flag. Use the `--` separator:

```bash
export PATH="$PWD/.node:$PATH"
nohup npm run dev -- -p 53143 > .freebuff/dev-server.log 2>&1 &    # dev
nohup npm run start -- -p 53144 > .freebuff/prod-server.log 2>&1 & # prod build
```

- `npm run dev` pre-warms the top routes (home, packages, blog, one package,
  one post, the OG image route) so first clicks are fast.
- `npm run start` probes the OG route after startup and prints a health line.
- Both wrappers run `scripts/health-check.mjs` first and refuse to start a
  broken junction setup, printing exact repair commands.
- Next.js refuses a **second** dev server for the same project directory while
  one is running. If port 53143 already answers, reuse it instead of starting
  another.

## 3. Registering the preview

- Confirm the server answers:
  `curl -s -o /dev/null -w "%{http_code}" http://localhost:53143`
- Warm the routes you care about (first probe can race a cold compile):
  `for p in / /packages /blog; do curl -s -o /dev/null "http://localhost:53143$p"; done`
- Then register the preview with the listener PID:
  `netstat -ano | grep ':53143' | grep LISTEN` → PID, pass it with the URL.

Known warning (cosmetic): "slow filesystem detected" from Next 16 on this
machine. The `middleware.ts` → `proxy` migration is done (`src/proxy.ts`), so
no deprecation warning is expected.
