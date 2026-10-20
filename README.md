# Magnus Karlsen · Project portfolio

A responsive static Astro template with Markdown content. The labelled example contains placeholders only. No backend, sign-in, tracking or external fonts.

## Open locally

Open this folder in VS Code. On Windows, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\local.ps1
```

Open **http://127.0.0.1:4321/**. The script uses installed Node.js 24+, or downloads the version in `.node-version` into ignored `.tools/` and checks its SHA256 checksum. It installs dependencies when needed. Stop with `Ctrl+C`; first setup requires internet access.

With Node installed normally on Windows, macOS or Linux:

```sh
npm ci
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the exact locked dependency versions |
| `npm run dev` | Start development with automatic reload |
| `npm run check` | Check Astro and TypeScript |
| `npm run build` | Generate the static production site in `dist/` |
| `npm run preview` | Preview the production build at http://127.0.0.1:4321/ |
| `npm run check:links` | Check built links, images, fragments and CSS assets |
| `npm run verify` | Verify both URL layouts, optional fields, equations, drafts and empty states; finish with a production build |

Without global Node, use `powershell -ExecutionPolicy Bypass -File .\scripts\local.ps1 -Task build`, replacing `build` with `install`, `check`, `preview` or `verify` as needed. Run `-Task install` again after dependency changes. Verification uses temporary files in ignored `.qa/`, without editing your content. External link availability is not tested over the network.

## Edit your profile

Edit **`src/data/profile.ts`** for your name, education, introduction, biography, interests and contact links. An empty contact list displays a placeholder. Add real addresses only:

```ts
contactLinks: [
  // { label: 'GitHub', href: 'https://YOUR-ACTUAL-ADDRESS' },
],
```

## Add a project

Each project has one folder in **`projects/`**, containing `index.md` and its images together. See `projects/README.md` for a quick guide. `Tom1`–`Tom10` are visible empty slots marked **Coming soon**, ready to fill in.

```text
projects/
  underwater-scooter/
    index.md
    image.png
  my-project/
    index.md
    result.webp
```

1. Use one of the `Tom` folders, or create `projects/my-project/` and copy `templates/project.md` into it as `index.md`.
2. Fill in the title, description and relevant sections. The folder name defines `/projects/my-project/`. Use lowercase folder names with hyphens, preferably ASCII.
3. Set `draft: true` to hide a project while writing. Drafts are absent from the gallery and receive no route, including locally. Set `draft: false` to display the project. The `Tom` slots already use `draft: false` and `placeholder: true`; remove `placeholder: true` when you replace the template with your real project content.
4. Date, status, tags, images and links are optional. Dates use `"YYYY-MM-DD"`. Status can be `Not specified`, `Planned`, `In progress`, `Completed` or `On hold`. Real projects appear first, newest dated projects first. Empty slots follow in numeric order, with the example last.

**Remove the example:** Delete `projects/example/`, or set `draft: true` in its `index.md`. The gallery displays an empty state when nothing is published.

### Images and files

Place an image beside the project's `index.md`, for example `projects/my-project/result.webp`. Reference it by its relative filename:

```yaml
cover: "./result.webp"
coverAlt: "Describe what the image actually shows."
coverCaption: "An optional caption and any photo credits."
```

All image fields may be omitted. `coverAlt` is required when `cover` is provided. In the body, use ordinary Markdown:

```md
![Describe the image](./build.webp)

*An optional caption.*
```

PNG, WebP, JPEG and SVG images are supported. Local images are processed by Astro and their dimensions are inferred automatically. Subfolders such as `./photos/build.webp` work too. Internal links use root-relative URLs such as `[About me](/about/)`; the repository prefix is automatic. Prefer Markdown to raw HTML for images.

Optional code, CAD and file links go in metadata. Local files belong in `public/files/my-project/`:

```yaml
links:
  - label: "CAD model"
    url: "/files/my-project/model.step"
  # Add a full https:// URL for real source-code links when available.
```

### Equations

Use `$...$` for inline LaTeX, or `$$` on separate lines:

```md
An inline formatting example is $x^2$.

$$
f(x) = x^2
$$
```

KaTeX generates HTML/MathML during the build, with local fonts and styles. Define symbols and units. `package.json` uses `overrides` to keep the Markdown tools and stylesheet on one current KaTeX version; retain the lockfile.

## Publish to GitHub Pages

GitHub Actions detects the correct account URL and repository path automatically. Local development uses the root path. Optional overrides live in **`config/site.mjs`**:

| Deployment | `origin` | `base` |
| --- | --- | --- |
| `USERNAME.github.io` | `'https://USERNAME.github.io'` | `'/'` |
| `USERNAME.github.io/REPOSITORY/` | `'https://USERNAME.github.io'` | `'/REPOSITORY/'` |

Leave both fields empty for automatic detection. For a custom domain, set its actual origin and `base: '/'`.

1. Keep or hide the example as desired, then run `npm run verify`.
2. Push the source to a GitHub repository on `main`, including `package-lock.json` and `.github/`. Do not upload `node_modules/`, `.tools/`, `.qa/` or `dist/`.
3. Select **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The workflow verifies, builds and publishes `dist/` after a push to `main`, or when started manually from **Actions**. Adjust the workflow if you use another branch.

`draft: true` prevents HTML generation but does not hide Markdown files in a public repository. Keep private material out of public repositories.

## Working with AI

`AGENTS.md` documents the structure and forbids invented facts. `CLAUDE.md` points to those same instructions. Layout lives in `src/layouts/` and `src/components/`; styles in `src/styles/global.css`. Keep project content in Markdown.

References: [Astro on GitHub Pages](https://docs.astro.build/en/guides/deploy/github/), [Astro Markdown content](https://docs.astro.build/en/guides/markdown-content/) and [images in content collections](https://docs.astro.build/en/guides/images/#images-in-content-collections).
