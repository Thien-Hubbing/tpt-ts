import Decimal from "break_eternity.js";
import { Layers } from "layers-logic";
import { modInfo } from "tree-mod";
import { Intervals } from "@/core/technical/intervals";
import { base64ToString, stringToBase64 } from "uint8array-extras";
import { SaveFileError } from "@/utilities/errors.js";

// ************ Save stuff ************

export const GameSave = {
  checkPlayerObject(save: Record<string | number, unknown>): void {
    if (!save.points) {
      throw new SaveFileError("Save file does not have a main \"points\" property");
    }

    const invalidProperties: string[] = [];
    function checkNaN(object: Record<string | number, unknown> | unknown[], path: string) {
      for (const key in object) {
        if (!Object.hasOwn(object, key)) {
          continue;
        }

        const property = object[key];
        if (property === null || property === undefined) {
          continue;
        } else if (Array.isArray(property)) {
          checkNaN(property, `${path}.${key}`);
        } else if (Number.isNaN(property)) {
          invalidProperties.push(`${path}.${key}`);
        } else if (property instanceof Decimal && property.toString() === "NaN") {
          invalidProperties.push(`${path}.${key}`);
        } else if (typeof property === "object") {
          checkNaN(property as Record<string | number, unknown>, `${path}.${key}`);
        }
      }
    }

    checkNaN(save, "player");

    if (invalidProperties.length === 0) {
      return;
    }

    throw new SaveFileError(`${invalidProperties.length > 1 ? "NaN player properties" : "NaN player property"} found:
      ${invalidProperties.join(", ")}`);
  },

  canSave(): boolean {
    return true;
  },

  save(): void {
    if (!this.canSave()) {
      return;
    }

    try {
      this.checkPlayerObject(player);
    } catch (error) {
      if (error instanceof SaveFileError) {
        alert(`Your save is invalid for ${error.message}, that means you can't save.`);
      }
    }

    localStorage.setItem(modInfo.id, stringToBase64(JSON.stringify(player)));
  },

  applyPlayer(playerObject: PlayerType, layerObject?: Record<string, Record<string | number, any>>) {
    try {
      this.checkPlayerObject(playerObject);
    } catch (error) {
      console.error("Savefile was invalid for:");
      console.error(error);
      console.warn("Resetting the save!");
      playerObject = this.getDefaultSave();
      playerObject.lastUpdate = Date.now();
    }

    Layers.applyOntoPlayer(playerObject, layerObject);

    return playerObject;
  },

  resetSave(): void {
    player = this.applyPlayer(this.getDefaultSave());
    this.save();
  },

  getDefaultSave(): PlayerType {
    const defaultStart = {
      lastUpdate: Date.now(),
      config: {
        automaticSaving: true,
        offlineProduction: true,
        updateRate: 33,
      },
      version: modInfo.modVersion,
      timePlayed: 0,
      points: modInfo.initialStartPoints,
      ui: {
        currentTab: "",
      },
      nodes: {},
      dev: {
        speedMult: 1,
      },
    };
    return defaultStart;
  },

  load() {
    const playerStorage = localStorage.getItem(modInfo.id);
    const layerStorage = localStorage.getItem(`${modInfo.id}.layer-data`);
    // First play, load the default save.
    if (playerStorage === null) {
      player = this.applyPlayer(this.getDefaultSave());
      // TempStore.setup();
      Intervals.startAll();
    } else {
      // Not our first play, decode and import.
      const decodedPlayer = JSON.parse(base64ToString(playerStorage));
      const decodedLayers = JSON.parse(base64ToString(layerStorage ?? "e30="));
      player = this.applyPlayer(decodedPlayer, decodedLayers);
      Intervals.startAll();
    }
  },
};

export type PlayerType = {
  lastUpdate: number
  config: {
    automaticSaving: boolean
    offlineProduction: boolean
    updateRate: number
  }
  version: string
  timePlayed: number
  points: Decimal
  ui: {
    currentTab: string
  }
  nodes: Record<string, Record<string | number, any>>
  dev: {
    speedMult: number
  }
};

export let player: PlayerType = GameSave.applyPlayer(GameSave.getDefaultSave());
