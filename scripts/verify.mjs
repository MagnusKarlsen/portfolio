import { mkdirSync, mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync, readdirSync, copyFileSync } from 'node:fs';
import { resolve, relative, dirname, join, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { checkLinks } from './check-links.mjs';
import { githubPagesDefaults } from '../config/site.mjs';

assert.deepEqual(githubPagesDefaults(), { origin: '', base: '/' });
assert.deepEqual(githubPagesDefaults('User/user.github.io'), { origin: 'https://user.github.io', base: '/' });
assert.deepEqual(githubPagesDefaults('User/portfolio'), { origin: 'https://user.github.io', base: '/portfolio/' });

const astro = resolve('node_modules/astro/bin/astro.mjs');
const qaRoot = resolve('.qa');
mkdirSync(qaRoot, { recursive: true });
const temporary = mkdtempSync(join(qaRoot, 'verify-'));
const fixtures = join(temporary, 'projects');
mkdirSync(fixtures);

function writeProject(name, content) {
  const directory = join(fixtures, name);
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, 'index.md'), content);
  return directory;
}

function clearFixtures() {
  for (const name of readdirSync(fixtures)) {
    const directory = resolve(fixtures, name);
    assert.equal(dirname(directory), fixtures, 'Fixture cleanup must stay inside its temporary directory.');
    rmSync(directory, { recursive: true, force: true });
  }
}

function run(args, env = {}) {
  const result = spawnSync(process.execPath, [astro, ...args], {
    stdio: 'inherit', env: { ...process.env, ...env },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`astro ${args.join(' ')} failed (${result.status}).`);
}

function build(base, contentDirectory, target) {
  const env = { PORTFOLIO_BASE: base, PORTFOLIO_ORIGIN: 'https://portfolio.invalid' };
  if (contentDirectory) env.PORTFOLIO_PROJECTS_DIR = `./${relative(process.cwd(), contentDirectory).split(sep).join('/')}`;
  run(['build', '--outDir', target], env);
  checkLinks(target, base);
}

try {
  run(['check']);
  for (const base of ['/', '/repository/']) {
    const target = join(temporary, base === '/' ? 'root' : 'subpath');
    build(base, undefined, target);
    const html = readFileSync(join(target, 'index.html'), 'utf8');
    assert.ok(html.includes(`https://portfolio.invalid${base}`), 'Canonical URL must include the correct base.');
    assert.ok(html.includes('lang="en"'), 'Page language must be English.');
    const example = join(target, 'projects/example/index.html');
    if (existsSync(example)) {
      const projectHtml = readFileSync(example, 'utf8');
      assert.ok(projectHtml.includes('katex-mathml'), 'Equations must render during the build.');
      assert.ok(projectHtml.includes('noindex, follow'), 'The example must be marked noindex.');
    }
  }

  writeProject('without-optional-fields', `---\ntitle: "Check without optional fields"\ndescription: "Temporary test content"\ndraft: false\n---\n## Overview\nTest content.\n`);
  writeProject('empty-fields', `---\ntitle: "Check empty fields"\ndescription: "Temporary test content"\ndraft: false\ndate: ""\ncover: ""\ncoverAlt: ""\ncoverCaption:\ntags: []\nlinks: []\n---\n## Overview\nTest content.\n`);
  writeProject('with-optional-fields', `---\ntitle: "Check optional fields"\ndescription: "Temporary test content"\ndraft: false\ndate: "2026-10-20"\nstatus: "In progress"\ntags: [Test]\ncover: "/favicon.svg"\ncoverAlt: "Test illustration"\ncoverCaption: "Test caption"\nlinks:\n  - label: Local file\n    url: "/favicon.svg"\n  - label: External link\n    url: "https://example.org/"\n---\n## Overview\n![Test image](/favicon.svg)\n\n[About me](/about/)\n\n$$\nx^2\n$$\n`);
  const imageProject = writeProject('Relative-Images', `---\ntitle: "Check colocated images"\ndescription: "Temporary test content"\ndraft: false\ncover: "./cover illustration.svg"\ncoverAlt: "Test illustration"\n---\n## Overview\n![Local image](<./cover illustration.svg>)\n`);
  copyFileSync('public/favicon.svg', join(imageProject, 'cover illustration.svg'));
  // Without an explicit draft field, new files must be hidden by default.
  writeProject('hidden-draft', `---\ntitle: "UNPUBLISHED_TEST"\ndescription: "Must not appear in dist"\n---\nUNPUBLISHED_TEST\n`);
  for (const name of ['placeholder-slot10', 'placeholder-slot2']) {
    writeProject(name, `---\ntitle: "${name}"\ndescription: "Temporary empty slot"\ndraft: false\nplaceholder: true\n---\n[Project documentation will be added here.]\n`);
  }

  const target = join(temporary, 'optional-fields');
  build('/repository/', fixtures, target);
  assert.ok(!existsSync(join(target, 'projects/hidden-draft')), 'Drafts must not receive a route.');
  const index = readFileSync(join(target, 'index.html'), 'utf8');
  assert.ok(!index.includes('UNPUBLISHED_TEST'), 'Drafts must not appear in the gallery.');
  assert.ok(index.includes('/repository/projects/relative-images/'), 'Folder names must generate stable project routes without /index.');
  assert.ok(index.includes('Photo to come'), 'Imageless project cards must display a clear photo placeholder.');
  assert.ok(index.indexOf('/repository/projects/without-optional-fields/') < index.indexOf('/repository/projects/placeholder-slot2/'), 'Real projects must appear before empty slots.');
  assert.ok(index.indexOf('/repository/projects/placeholder-slot2/') < index.indexOf('/repository/projects/placeholder-slot10/'), 'Empty slots must use numeric ordering.');
  const placeholder = readFileSync(join(target, 'projects/placeholder-slot2/index.html'), 'utf8');
  assert.ok(placeholder.includes('Coming soon') && placeholder.includes('noindex, follow'), 'Published placeholders must have their own clearly labelled page, excluded from indexing.');
  const localImages = readFileSync(join(target, 'projects/relative-images/index.html'), 'utf8');
  assert.match(localImages, /src="\/repository\/_astro\//, 'Colocated images must resolve through Astro with the repository base.');
  const minimal = readFileSync(join(target, 'projects/without-optional-fields/index.html'), 'utf8');
  const withOptionalFields = readFileSync(join(target, 'projects/with-optional-fields/index.html'), 'utf8');
  assert.ok(withOptionalFields.includes('katex-mathml'), 'Equations must render even when the example project is hidden.');
  assert.ok(!minimal.includes('<figure'), 'An imageless project must not contain an empty figure.');
  assert.ok(!minimal.includes('id="project-files"'), 'A project without links must not display an empty resource list.');

  clearFixtures();
  writeProject('only-draft', `---\ntitle: "UNPUBLISHED_TEST"\ndescription: "Test"\ndraft: true\n---\nDraft.\n`);
  const emptyTarget = join(temporary, 'empty');
  build('/repository/', fixtures, emptyTarget);
  assert.ok(readFileSync(join(emptyTarget, 'index.html'), 'utf8').includes('No projects have been published yet.'), 'The empty state must be displayed.');
  assert.ok(!existsSync(join(emptyTarget, 'projects/only-draft')), 'A single draft must remain unpublished.');
  rmSync(join(fixtures, 'only-draft/index.md'));
  const noFilesTarget = join(temporary, 'no-files');
  build('/repository/', fixtures, noFilesTarget);
  assert.ok(readFileSync(join(noFilesTarget, 'index.html'), 'utf8').includes('No projects have been published yet.'), 'The empty state must also work without Markdown files.');
  console.log('\nAll checks passed: both URL layouts, colocated images, optional fields, equations, drafts, visible placeholders and empty states.');
} finally {
  // mkdtempSync creates this unique directory directly inside the verified .qa folder.
  assert.ok(temporary.startsWith(qaRoot + '\\') || temporary.startsWith(qaRoot + '/'));
  rmSync(temporary, { recursive: true, force: true });
}

// Finish with a regular production build using the user's own settings.
run(['build']);
checkLinks();
