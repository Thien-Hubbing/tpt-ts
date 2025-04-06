import { player } from "save/save";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Intervals = (function() {
  const interval = (handler: () => void, timeout: number | (() => number)) => {
    let id: NodeJS.Timeout | undefined;
    return {
      start() {
        // This starts the interval if it isn't already started,
        // and throws an error if it is.
        if (this.isStarted) {
          throw new Error("An already started interval cannot be started again.");
        } else {
          id = setInterval(handler, typeof timeout === "function" ? timeout() : timeout);
        }
      },
      get isStarted() {
        return id !== undefined;
      },
      stop() {
        // This stops the interval if it isn't already stopped,
        // and does nothing if it is already stopped.
        clearInterval(id);
        id = undefined;
      },
      restart() {
        this.stop();
        this.start();
      },
    };
  };

  return {
    // Not a getter because getter will cause stack overflow
    all(): any {
      return Object.values(Intervals)
        .filter(i =>
          Object.hasOwn(i, "start")
          && Object.hasOwn(i, "stop"),
        );
    },
    startAll() {
      for (const interval of this.all()) {
        interval.start();
      }
    },
    stopAll() {
      for (const interval of this.all()) {
        interval.stop();
      }
    },
    resetAll() {
      for (const interval of this.all()) {
        interval.restart();
      }
    },
    gameLoop: interval(() => realGameLoop(), 33),
    save: interval(() => GameSave.save(), 30 * 1000),
  };
})();
