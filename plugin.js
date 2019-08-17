import { readFileSync } from 'fs';
import findUp from 'find-up';

let options;
const pkgPath = findUp.sync('package.json');

// Read compiler options from `package.json`. If the file doesn't exist, assume
// that a `meteor publish` is currently in progress.
if (pkgPath) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  options = pkg['svelte:compiler'];
} else {
  options = { isPublishing: true };
}

Plugin.registerCompiler({
  extensions: (options && options.extensions) || ['svelte']
}, () => new SvelteCompiler(options));
