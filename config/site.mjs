/** All deployment URLs live here. GitHub Actions uses the actual repository. */
export const site = {
  // Optional override, for example when using a custom domain.
  // Empty values use local preview or the actual GitHub URL in Actions.
  origin: '',
  // Empty values select '/' locally and the correct repository path in Actions.
  // Override with '/' or '/REPOSITORY/' if needed.
  base: '',
};

export function githubPagesDefaults(repository = '') {
  const parts = repository.split('/');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { origin: '', base: '/' };
  const [owner, name] = parts;
  return {
    origin: `https://${owner.toLowerCase()}.github.io`,
    base: name.toLowerCase() === `${owner.toLowerCase()}.github.io` ? '/' : `/${name}/`,
  };
}

const detected = githubPagesDefaults(process.env.GITHUB_ACTIONS === 'true' ? process.env.GITHUB_REPOSITORY : '');

// Temporary overrides are reserved for the verification script.
export const base = normalizeBase(process.env.PORTFOLIO_BASE ?? (site.base || detected.base));
export const origin = process.env.PORTFOLIO_ORIGIN ?? (site.origin || detected.origin);

function normalizeBase(value) {
  const path = value.replace(/^\/+|\/+$/g, '');
  return path ? `/${path}/` : '/';
}

/** Internal pages and public/ files. External URLs and fragments remain unchanged. */
export function withBase(path = '') {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
  const clean = path.replace(/^\/+/, '');
  if (base !== '/' && (path === base.slice(0, -1) || path.startsWith(base))) return path;
  return `${base}${clean}`;
}
