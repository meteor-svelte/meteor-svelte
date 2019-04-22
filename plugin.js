import { readFileSync } from 'fs';
import findUp from 'find-up';

let options;
const pkgPath = findUp.sync('package.json');

// Read compiler options from `package.json`.
if (pkgPath) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  options = pkg['svelte:compiler'];
}

Plugin.registerCompiler({
  extensions: (options && options.extensions) || ['svelte']
}, () => new SvelteCompiler(options));
