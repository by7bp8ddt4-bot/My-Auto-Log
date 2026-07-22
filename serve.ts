// Production server for the static Vite SPA build.
// Serves dist/ on port 3000 — static files handled by Bun.file, SPA fallback
// for client-side routing. Run `bun run build` before starting.
// Restart with `bun run publish`.
//
// Starting a new instance supersedes the old one: it frees the port no matter
// which user owns the current server, so publish never collides with an
// already-running server.
const PORT = 3000;
const HOST = "0.0.0.0";
const DIST_DIR = `${import.meta.dir}/dist`;
const INDEX_HTML = `${DIST_DIR}/index.html`;

// Free PORT regardless of which user owns the current listener.
const freePort =
  `for _ in $(seq 1 25); do ` +
  `pids=$(lsof -t -iTCP:${String(PORT)} -sTCP:LISTEN 2>/dev/null || true); ` +
  `if [ -z "$pids" ]; then exit 0; fi; ` +
  `kill $pids 2>/dev/null || true; sleep 0.2; ` +
  `done`;

// Take over the port, re-freeing and retrying if another publish grabbed it.
for (let attempt = 1; ; attempt++) {
  await Bun.$`sudo sh -c ${freePort}`.quiet().nothrow();
  try {
    Bun.serve({
      port: PORT,
      hostname: HOST,
      async fetch(req) {
        const url = new URL(req.url);
        const filePath = DIST_DIR + url.pathname;

        // Try to serve the exact file
        const file = Bun.file(filePath);
        if (await file.exists()) return new Response(file);

        // Try appending .html for clean URLs
        const htmlFile = Bun.file(filePath + ".html");
        if (await htmlFile.exists()) return new Response(htmlFile);

        // SPA fallback: serve index.html for client-side routing
        return new Response(Bun.file(INDEX_HTML));
      },
    });
    break;
  } catch (err) {
    if (attempt >= 10) throw err;
    await Bun.sleep(200);
  }
}

console.log(`MTXtrkr serving on http://${HOST}:${String(PORT)}`);
