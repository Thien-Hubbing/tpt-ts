import { player } from "core/save/save";

export type GameInterval = {
  readonly isStarted: boolean
  start(): void
  stop(): void
  restart(): void
};

export const Intervals = (function () {
  const interval = (handler: () => void, timeout: number | (() => number)): GameInterval => {
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
    get all(): GameInterval[] {
      return Intervals.intervalsArray;
    },
    startAll() {
      for (const interval of this.all) {
        interval.start();
      }
    },
    stopAll() {
      for (const interval of this.all) {
        interval.stop();
      }
    },
    resetAll() {
      for (const interval of this.all) {
        interval.restart();
      }
    },
    intervalsArray: [
      interval(() => realGameLoop(), 33),
      interval(() => GameSave.save(), 30 * 1000),
    ],
    get gameLoop() {
      return this.intervalsArray[0];
    },
    get autosaveLoop() {
      return this.intervalsArray[1];
    },
  };
})();
