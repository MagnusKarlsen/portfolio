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

- `src/data/profile.ts`: name, education, introduction, biography, interests and contact links.
- `config/site.mjs`: all public URL settings (`origin`, `base`), automatic GitHub Pages detection and `withBase()`.
- `src/content/projects/*.md`: project content and validated metadata.
- `templates/project.md`: reusable project template, outside the content collection.
- `src/content.config.ts`: content schema. Optional cover images require alternative text when provided.
- `src/lib/projects.ts`: shared filtering and sorting. Gallery and project routes must use the same draft filter.
- `src/pages/`: home, about, project routes and 404 page.
- `src/layouts/`, `src/components/`, `src/styles/`: layout and presentation.
- `public/images/` and optional `public/files/`: assets copied directly to the build.
- `scripts/`: Windows startup, Markdown URL handling and build/link verification.
- `.github/workflows/deploy.yml`: checks, build and GitHub Pages deployment from `main`.

## Working rules

- Inspect existing files and preserve user content before making changes.
- Use `withBase()` for internal links and assets in Astro. The Markdown plugin prefixes root-relative Markdown URLs automatically.
- Do not hardcode repository names, account URLs or contact details in components or the workflow.
- Preserve the light background, readable contrast, responsive layout, keyboard navigation and restrained design.
- Equations render during the build with remark-math and KaTeX. No external CDN is required.
- Run `npm run check`, `npm run build` and `npm run check:links` after changes. For schema, route, draft or URL changes, run `npm run verify`; it includes these checks and leaves a fresh production build.
- On Windows without Node on PATH: `powershell -ExecutionPolicy Bypass -File .\scripts\local.ps1 -Task verify`.
- `PORTFOLIO_BASE`, `PORTFOLIO_ORIGIN` and `PORTFOLIO_PROJECTS_DIR` are internal test overrides. Keep deployment settings in the central configuration file.
- Create external repositories and publish only when the user explicitly requests it. The current user has requested internet publication via GitHub Pages.
