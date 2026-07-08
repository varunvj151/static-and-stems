Static & Stems — Local copy

This repository is a small static site (HTML/CSS) styled around a vinyl listening bar concept. Changes made in this working copy:

- Converted `assets/js/main.js` → `assets/js/main.ts` and added a TypeScript build.
- Added `tsconfig.json` and `package.json` (dev dependency: `typescript`).
- Compiled output is written to `assets/js/build/main.js` and all HTML pages are updated to load that compiled bundle as a `type="module"` script.
- Enhanced styling in `assets/css/style.css` (gallery/team cards, feature panels, hero visual refinements).
- Added premium content blocks and richer copy in `index.html`, `about.html`, and `contact.html`.

Quick start (Windows)

Prerequisites

- Node.js and npm installed (recommended Node 24+).

Install dependencies and build

```powershell

npm install
npm run build
```

> Note: the build script uses `node ./node_modules/typescript/bin/tsc --project tsconfig.json` to avoid permission issues when Vercel runs the build.

During development you can run the TypeScript compiler in watch mode:

```powershell
npm run watch
```

Start a local preview server and get the localhost link in the terminal:

```powershell
npm run serve
# open http://127.0.0.1:8080 or http://localhost:8080
```

Or run build + serve in one command:

```powershell
npm run dev
# compiles TypeScript, then starts the local server at http://127.0.0.1:8080
```

Use `npm run dev` when you want one command to both build the project and open it locally. If you only need to serve existing build files, use `npm run serve` instead.

If port `8080` is already in use, pick an alternate port, for example `8081`:

```powershell
npx http-server -c-1 . -p 8081
# open http://127.0.0.1:8081
```

Option B — Python (if installed):

```powershell
# Python 3
python -m http.server 8080
# open http://127.0.0.1:8080
```

Common issue: port already in use

If `http-server` fails with `EADDRINUSE` (address already in use), find the process using the port and stop it.

PowerShell commands to inspect and stop the process (example for port 8080):

```powershell
netstat -ano | findstr ":8080"
# output includes a PID (last column). Then:
Get-Process -Id <PID>
# to stop:
Stop-Process -Id <PID> -Force
```

Or use the Windows Task Manager to stop the program that holds the port.

On successful start, `http-server` prints the available URLs (e.g. `http://127.0.0.1:8081`). Open one of those in your browser. To stop the server, press Ctrl+C in the terminal running it.

Notes about the build

- The compiled JS bundle is `assets/js/build/main.js`. Make sure to run `npm run build` after editing `assets/js/main.ts` (or use `npm run watch` for live compilation).
- The HTML pages load the compiled file as a `type="module"` script, so modern browsers are required for ES module support.

Deploying to Vercel (step-by-step)

Option 1 — Deploy from your Git provider (recommended)

1. Push this repository to GitHub, GitLab or Bitbucket.
2. Go to https://vercel.com and import the repository (New Project → Import).
3. On the import settings:
   - Framework Preset: choose `Other` or `Static`.
   - Build Command: `npm run build`
   - Output Directory: leave empty or set to `.` (we're serving root HTML files).

If you use `vercel.json`, the project is configured to publish the repository root after build via `"outputDirectory": "."`.
4. Deploy. Vercel will run `npm install` then `npm run build` and publish the static files.

Option 2 — Vercel CLI (quick deploy from your machine)

```powershell
npm i -g vercel
cd "c:\Users\varun\OneDrive\Documents\flutter1\static-and-stems"
vercel           # follow interactive prompts to link or create a project
vercel --prod --confirm  # quick production deploy
```

Recommended Vercel additions

- Add an `engines` field to `package.json` to pin Node version (example):

```json
"engines": { "node": "18.x" }
```

- Optionally add a `vercel.json` to control build settings. Example `vercel.json`:

```json
{
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build" }
  ],
  "cleanUrls": true
}
```

Notes on committing build output

- If you want Vercel to skip running the TypeScript build, you can commit the compiled files under `assets/js/build/` and remove the build command in the Vercel settings. That is optional — running the build on Vercel is fine and recommended.

Files of interest

- [index.html](index.html)
- [about.html](about.html)
- [contact.html](contact.html)
- [assets/css/style.css](assets/css/style.css)
- [assets/js/main.ts](assets/js/main.ts)
- [assets/js/build/main.js](assets/js/build/main.js)
- [tsconfig.json](tsconfig.json)
- [package.json](package.json)

Troubleshooting & tips

- If the browser shows an error about loading `main.js` as a module, make sure `assets/js/build/main.js` exists (run `npm run build`) and that the HTML pages reference it as `type="module"`.
- To test different ports, change the `-p` value when starting `http-server`.

If you want, I can:

- add the `engines` field to `package.json` and commit it;
- add a `vercel.json` with the example above;
- run `vercel` from this machine to create a deployment (requires you to authenticate the CLI interactively).

Tell me which of those you'd like me to do next.
