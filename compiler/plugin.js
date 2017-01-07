Plugin.registerCompiler({
  extensions: ['svelte', 'html'],
}, () => new SvelteCompiler);
