import { readFileSync } from 'fs';
import findUp from 'find-up';
import semver from 'semver';

const svelteVersion = '3.46.2';

let options;
const pkgPath = findUp.sync('package.json');

// Read compiler options from `package.json`.
if (pkgPath) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  options = pkg['svelte:compiler'];

  if (!pkg.dependencies || !pkg.dependencies.svelte) {
    console.warn(`

WARNING: this package requires svelte to be installed as npm peer dependency, but it is not specified in your package.json.
If you encounter error messages, consider running:

  meteor npm install --save svelte@${svelteVersion}
`);
  }
  else if (!semver.satisfies(svelteVersion, pkg.dependencies.svelte) ||
            semver.intersects(pkg.dependencies.svelte, '<' + svelteVersion)) {
    console.warn(`

WARNING: this package requires svelte@${svelteVersion} to be installed as npm peer dependency, but your package.json specifies:

  "svelte": "${pkg.dependencies.svelte}"

If you encounter error messages, consider running:

  meteor npm install --save svelte@${svelteVersion}
`);
  }
}

Plugin.registerCompiler({
  extensions: (options && options.extensions) || ['svelte']
}, () => new SvelteCompiler(options));
