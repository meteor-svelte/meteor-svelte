import { readFileSync } from 'fs';

let config;

// Read compiler configuration from `package.json`.
try {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
  config = pkg['svelte:compiler'];
} catch (e) {
  if (e.code === 'ENOENT') {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      "Warning: Svelte compiler couldn't find a `package.json` file.\n" +
      "Please run `meteor` in the root folder of the application."
    );
  }
} finally {
  config = config || {};
}

Plugin.registerCompiler({
  extensions: config.extensions || ['svelte', 'html'],
}, () => new SvelteCompiler);
