# Magnus Karlsen's project portfolio

A static Astro website in English, prepared for GitHub Pages. Keep the implementation simple and content separate from presentation. No backend, database, sign-in or client framework is needed.

## Facts and content

- AI must **never invent facts** about Magnus, his projects, results, measurements, contact details, education beyond supplied information, experience, responsibilities or skills.
- Use clear `[Placeholders]` when information is missing. Ask the user when factual details are necessary.
- Confirmed education: MSc in Physics and Mathematics (Norwegian sivilingeniør). Areas of interest do not establish experience or completed projects.
- Keep the example clearly labelled. Never describe its placeholder illustration as a real project.
- New projects must use `draft: true` until the user wants them published. Drafts receive no public route.
- Explain each project in accessible terms first. Put technical details, theory and equations further down.

## Structure

- `src/data/profile.ts`: name, education, portrait settings, introduction, biography, interests and contact links. The portrait lives in `src/assets/profile/portrait.jpg` and uses Astro's image pipeline.
- `config/site.mjs`: all public URL settings (`origin`, `base`), automatic GitHub Pages detection and `withBase()`.
- `projects/<project>/index.md`: project content and validated metadata. Keep project images in that same folder and use relative paths such as `./image.png`.
- `projects/tesla-coil/`, `tesla-coil-spark-gap/`, `taser-spark-stick/`, `robot-hand/`, `solar-panel/`, `fuel-cell/`, `electrolysis/` and `night-vision/`: visible projects named by the user. Some have user-supplied photos; their notes are still incomplete. The example remains visible too. Keep `placeholder: true` until real notes replace the template. Do not hide these entries unless explicitly asked; styling changes must not change publication state.
- `projects/Tom9/` and `projects/Tom10/`: visible empty project slots restored for future uploads. Keep them available alongside the named projects unless the user explicitly requests removal.
- `templates/project.md`: reusable project template, outside the content collection.
- `src/content.config.ts`: content schema. Optional cover images require alternative text when provided.
- Optional `gallery` metadata lists additional images as `src`, required `alt` and optional `caption`. `src/components/ProjectGallery.astro` shows the cover and gallery together, with an accessible native-dialog photo viewer and direct image links as a fallback. Keep all images beside their project's Markdown.
- `src/lib/projects.ts`: shared filtering and sorting. Gallery and project routes must use the same draft filter.
- `src/pages/`: home, about, project routes and 404 page.
- `src/layouts/`, `src/components/`, `src/styles/`: layout and presentation.
- `src/components/ProjectImage.astro`: local cover images use Astro's image pipeline; optional public/remote URLs remain supported.
- `public/` and optional `public/files/`: shared static resources copied directly to the build. Project images belong in their own project folders.
- `scripts/`: Windows startup, Markdown URL handling and build/link verification.
- `.github/workflows/deploy.yml`: checks, build and GitHub Pages deployment from `main`.

## Working rules

- Inspect existing files and preserve user content before making changes.
- Use `withBase()` for internal links and assets in Astro. The Markdown plugin prefixes root-relative Markdown URLs automatically.
- Let Astro resolve relative project images through Markdown and the content schema's `image()` helper. Do not reintroduce separate content and image folders or copy project Markdown into `public/`.
- Keep uploaded media originals unchanged. The spark-gap project uses `video-frame.jpg`, extracted from the supplied `IMG_1779.MOV`, as a still image; builds do not require video conversion software.
- Do not hardcode repository names, account URLs or contact details in components or the workflow.
- Preserve the user's plain white background, compact portrait/name/About me introduction, dark text, subtle blue links and Arial typography. The home page proceeds directly to the project gallery, with three columns on desktop, two on tablets and one on phones. Do not display tags, badges, interest panels, coursework or internship sections. Empty contact links must render nothing; GitHub, LinkedIn and other links will be added later by the user.
- Equations render during the build with remark-math and KaTeX. No external CDN is required.
- Run `npm run check`, `npm run build` and `npm run check:links` after changes. For schema, route, draft or URL changes, run `npm run verify`; it includes these checks and leaves a fresh production build.
- On Windows without Node on PATH: `powershell -ExecutionPolicy Bypass -File .\scripts\local.ps1 -Task verify`.
- `PORTFOLIO_BASE`, `PORTFOLIO_ORIGIN` and `PORTFOLIO_PROJECTS_DIR` are internal test overrides. Keep deployment settings in the central configuration file.
- Create external repositories and publish only when the user explicitly requests it. The current user has requested internet publication via GitHub Pages.
