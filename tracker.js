const { onDestroy } = require('svelte');
const { Tracker } = require('meteor/tracker');

module.exports = {
  createReactiveWrapper() {
    let computation = null;

    onDestroy(() => {
      if (computation) {
        computation.stop();
      }
    });

    return function (func) {
      if (computation) {
        computation.stop();
      }

      computation = Tracker.autorun(func);

      return computation;
    }
  }
}
