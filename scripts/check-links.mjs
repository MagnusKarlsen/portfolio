import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, join, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { base as configuredBase } from '../config/site.mjs';

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

function decode(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&#38;', '&').replaceAll('&quot;', '"');
}

/** Check built HTML/CSS without network requests or additional packages. */
export function checkLinks(directory = 'dist', base = configuredBase) {
  const root = resolve(directory);
  if (!existsSync(root)) throw new Error('Missing dist/ directory. Run npm run build first.');
  const files = filesIn(root);
  const errors = [];
  let checked = 0;

  for (const file of files.filter((path) => /\.(html|css)$/.test(path))) {
    const content = readFileSync(file, 'utf8');
    const route = relative(root, file).split(sep).join('/').replace(/index\.html$/, '');
    const pageUrl = new URL(`${base}${route}`, 'https://local.invalid');
    const references = [];

    if (file.endsWith('.html')) {
      for (const tag of content.matchAll(/<(?:a|img|link|script|source|video|audio)\b[^>]*>/gi)) {
        for (const attr of tag[0].matchAll(/\b(href|src|poster)\s*=\s*["']([^"']*)["']/gi)) {
          references.push(attr[2]);
        }
        const srcset = /\bsrcset\s*=\s*["']([^"']*)["']/i.exec(tag[0]);
        if (srcset && !srcset[1].startsWith('data:')) {
          references.push(...srcset[1].split(',').map((entry) => entry.trim().split(/\s+/)[0]));
        }
      }
      for (const image of content.matchAll(/<img\b[^>]*>/gi)) {
        if (!/\balt\s*=/.test(image[0])) errors.push(`${route}: an image is missing its alt attribute`);
      }
    }
    for (const match of content.matchAll(/url\(\s*["']?([^\s)"']+)["']?\s*\)/g)) references.push(match[1]);

    for (const reference of references) {
      const value = decode(reference);
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) continue;
      if (!value) { errors.push(`${route}: empty link or image URL`); continue; }
      const url = new URL(value, pageUrl);
      if (!url.pathname.startsWith(base)) { errors.push(`${route}: ${value} is missing base ${base}`); continue; }
      let path = resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
      if (path !== root && !path.startsWith(root + sep)) { errors.push(`${route}: invalid file path ${value}`); continue; }
      if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
      if (!existsSync(path)) { errors.push(`${route}: cannot find ${value}`); continue; }
      if (url.hash && path.endsWith('.html')) {
        const id = decodeURIComponent(url.hash.slice(1));
        const target = readFileSync(path, 'utf8');
        if (!target.includes(`id="${id}"`) && !target.includes(`id='${id}'`)) errors.push(`${route}: cannot find fragment ${value}`);
      }
      checked++;
    }
  }
  if (errors.length) throw new Error(`Link check failed:\n${errors.join('\n')}`);
  console.log(`OK: ${files.filter((path) => path.endsWith('.html')).length} HTML pages, ${checked} local links, images, fragments and CSS resources (${base}).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) checkLinks();
