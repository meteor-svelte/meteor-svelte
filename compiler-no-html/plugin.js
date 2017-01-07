Plugin.registerCompiler({
  extensions: ['svelte'],
}, () => new SvelteCompiler);
