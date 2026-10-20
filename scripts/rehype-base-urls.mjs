import { withBase } from '../config/site.mjs';

/** Make root-relative Markdown links and images independent of the repository name. */
export default function rehypeBaseUrls() {
  return (tree) => {
    function walk(node) {
      if (node.type === 'element' && node.properties) {
        for (const key of ['href', 'src', 'poster']) {
          const value = node.properties[key];
          if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
            node.properties[key] = withBase(value);
          }
        }
      }
      node.children?.forEach(walk);
    }
    walk(tree);
  };
}
