import Decimal from 'break_eternity.js';
import {modInfo} from 'mod';
import {base64ToString, stringToBase64} from 'uint8array-extras';
import {SaveFileError} from 'utils/errors';

// ************ Save stuff ************

export let player: Record<string | number, unknown>;

export const GameSave = {
  checkPlayerObject(save: Record<string | number, unknown>): void {
    if (!Boolean(save.points)) {
      throw new SaveFileError('Save file does not have a main "points" property');
    }

    const invalidProps: string[] = [];
    function checkNaN(obj: Record<string | number, unknown> | any[], path: string) {
      let hasNaN = false;
      for (const key in obj) {
        const prop = obj[key];
        let thisNaN;
        if (prop === null || prop === undefined) {
          continue;
        } else if (Array.isArray(prop) || (typeof prop === 'object' && !(prop instanceof Decimal))) {
          checkNaN(prop, `${path}.${key}`);
        } else if (Number.isNaN(prop)) {
          hasNaN = true;
          invalidProps.push(`${path}.${key}`)
        } else if (prop instanceof Decimal && prop.toString() === 'NaN') {
          hasNaN = true;
          invalidProps.push(`${path}.${key}`)
        }
      }
      return hasNaN;
    }
    checkNaN(save, 'player');

    if (invalidProps.length === 0) return;
    throw new SaveFileError(`${invalidProps.length > 1 ? 'NaN player properties' : "NaN player property"} found:
      ${invalidProps.join(", ")}`);
  },

  canSave(): boolean {
    return true;
  },

  save(): void {
    if (!this.canSave()) return;
    try {
      this.checkPlayerObject(player)
    } catch (error: SaveFileError) {
      alert(`Your save is invalid for ${error.message}, that means you can't save.`);
    }
    localStorage.setItem(modInfo.id, stringToBase64(JSON.stringify(player)));
  },

  loadPlayer(playerObject: Record<string | number, unknown>): void {
    try {
      this.checkPlayerObject(playerObject);
    } catch (error) {
      console.error('Savefile was invalid for:')
      console.error(error);
      console.warn('Resetting the save!');
      player = this.getDefaultSave();
      player.lastUpdate = Date.now();
    }
  },

  resetSave(): void {
    this.loadPlayer(this.getDefaultSave())
    this.save()
  },

  getDefaultSave() {
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
      points: new Decimal(0),
    };
    return defaultStart;
  },
}

function guardFromNaNValues(object: any) {
  function isObject(object: unknown) {
    return object !== null && typeof object === "object" && !(object instanceof Decimal);
  }

  for (const key in object) {
    if (!Object.hasOwn(object, key)) continue;

    let value = object[key];
    if (isObject(value)) {
      guardFromNaNValues(value);
      continue;
    }

    if (typeof value === "number") {
      Object.defineProperty(object, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        set: function guardedSetter(newValue) {
          if (newValue === null || newValue === undefined) {
            throw new TypeError("null/undefined player property assignment");
          }
          if (typeof newValue !== "number") {
            throw new TypeError("Non-Number assignment to Number player property");
          }
          if (!Number.isFinite(newValue)) {
            throw new TypeError("NaN/non-finite player property assignment");
          }
          value = newValue;
        }
      });
    }

    if (value instanceof Decimal) {
      Object.defineProperty(object, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        set: function guardedSetter(newValue) {
          if (newValue === null || newValue === undefined) {
            throw new Error("null/undefined player property assignment");
          }
          if (!(newValue instanceof Decimal)) {
            throw new Error("Non-Decimal assignment to Decimal player property");
          }
          if (!isFinite(newValue.mag) || !isFinite(newValue.sign) || !isFinite(newValue.layer)) {
            throw new Error("NaN/non-finite player property assignment");
          }
          value = newValue;
        }
      });
    }
  }
}

function getStartPlayer(): Record<string | number, unknown> {
  const playerdata = startPlayerBase();

  const extradata = addedPlayerData();
  for (const thing in extradata) {
    if (Object.hasOwn(extradata, thing)) {
      continue;
    }

    playerdata[thing] = extradata[thing];
  }

  playerdata.infoboxes = {};
  for (const layer in layers) {
    if (Object.hasOwn(layers, layer)) {
      continue;
    }

    playerdata[layer] = getStartLayerData(layer);

    if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {
      playerdata.subtabs[layer] = {};
      playerdata.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
    }

    if (layers[layer].microtabs) {
      playerdata.subtabs[layer] ??= {};

      for (const item in layers[layer].microtabs) {
        if (Object.hasOwn(layers[layer].microtabs, item)) {
          continue;
        }
        
        playerdata.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
      }
    }

    if (layers[layer].infoboxes) {
      if (playerdata.infoboxes[layer] == undefined) {
        playerdata.infoboxes[layer] = {};
      }

      for (const item in layers[layer].infoboxes) {
        playerdata.infoboxes[layer][item] = false;
      }
    }
  }

  return playerdata;
}

function getStartLayerData(layer: string) {
  const layerdata = {};
  if (layers[layer].startData) {
    const layerdata = layers[layer].startData();
  }

  if (layerdata.unlocked === undefined) {
    layerdata.unlocked = true;
  }

  if (layerdata.total === undefined) {
    layerdata.total = const decimalZero: any;
  }

  if (layerdata.best === undefined) {
    layerdata.best = const decimalZero: any;
  }

  if (layerdata.resetTime === undefined) {
    layerdata.resetTime = 0;
  }

  if (layerdata.forceTooltip === undefined) {
    layerdata.forceTooltip = false;
  }

  layerdata.buyables = getStartBuyables(layer);
  if (layerdata.noRespecConfirm === undefined) {
    layerdata.noRespecConfirm = false;
  }

  layerdata.clickables ??= getStartClickables(layer);
  layerdata.spentOnBuyables = const decimalZero: any;
  layerdata.upgrades = [];
  layerdata.milestones = [];
  layerdata.lastMilestone = null;
  layerdata.achievements = [];
  layerdata.challenges = getStartChallenges(layer);
  layerdata.grid = getStartGrid(layer);
  layerdata.prevTab = '';

  return layerdata;
}

function getStartBuyables(layer: string | number) {
  const data = {};
  if (layers[layer].buyables) {
    for (const id in layers[layer].buyables) {
      if (isPlainObject(layers[layer].buyables[id])) {
        data[id] = const decimalZero: any;
      }
    }
  }

  return data;
}

function getStartClickables(layer: string | number) {
  const data = {};
  if (layers[layer].clickables) {
    for (const id in layers[layer].clickables) {
      if (isPlainObject(layers[layer].clickables[id])) {
        data[id] = '';
      }
    }
  }

  return data;
}

function getStartChallenges(layer: string | number) {
  const data = {};
  if (layers[layer].challenges) {
    for (const id in layers[layer].challenges) {
      if (isPlainObject(layers[layer].challenges[id])) {
        data[id] = 0;
      }
    }
  }

  return data;
}

function getStartGrid(layer: string | number) {
  const data = {};
  if (!layers[layer].grid) {
    return data;
  }

  if (layers[layer].grid.maxRows === undefined) {
    layers[layer].grid.maxRows = layers[layer].grid.rows;
  }

  if (layers[layer].grid.maxCols === undefined) {
    layers[layer].grid.maxCols = layers[layer].grid.cols;
  }

  for (let y = 1; y <= layers[layer].grid.maxRows; y++) {
    for (let x = 1; x <= layers[layer].grid.maxCols; x++) {
      data[100 * y + x] = layers[layer].grid.getStartData(100 * y + x);
    }
  }

  return data;
}

function fixSave() {
  const defaultData = getStartPlayer();
  fixData(defaultData, player);

  for (const layer in layers) {
    if (player[layer].best !== undefined) {
      player[layer].best = new Decimal(player[layer].best);
    }

    if (player[layer].total !== undefined) {
      player[layer].total = new Decimal(player[layer].total);
    }

    if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat) && !Object.keys(layers[layer].tabFormat).includes(player.subtabs[layer].mainTabs)) {
      player.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
    }

    if (layers[layer].microtabs) {
      for (const item in layers[layer].microtabs) {
        if (!Object.keys(layers[layer].microtabs[item]).includes(player.subtabs[layer][item])) {
          player.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
        }
      }
    }
  }
}

function fixData(defaultData: any[] | Record<string | number, unknown>, newData: Record<string | number, unknown>) {
  for (const item in defaultData) {
    if (defaultData[item] == null) {
      if (newData[item] === undefined) {
        newData[item] = null;
      }
    } else if (Array.isArray(defaultData[item])) {
      if (newData[item] === undefined) {
        newData[item] = defaultData[item];
      } else {
        fixData(defaultData[item], newData[item]);
      }
    } else if (defaultData[item] instanceof Decimal) { // Convert to Decimal
      newData[item] = newData[item] === undefined ? defaultData[item] : new Decimal(newData[item]);
    } else if ((Boolean(defaultData[item])) && (typeof defaultData[item] === 'object')) {
      if (newData[item] === undefined || (typeof defaultData[item] !== 'object')) {
        newData[item] = defaultData[item];
      } else {
        fixData(defaultData[item], newData[item]);
      }
    } else if (newData[item] === undefined) {
      newData[item] = defaultData[item];
    }
  }
}

function load() {
  const get = localStorage.getItem(getModuleID());

  if (get === null || get === undefined) {
    const player = getStartPlayer();
  } else {
    const player = Object.assign(getStartPlayer(), JSON.parse(base64ToString(get)));
    fixSave();
    loadOptions();
  }

  if (options.offlineProd) {
    if (player.offTime === undefined) {
      player.offTime = {remain: 0};
    }

    player.offTime.remain += (Date.now() - player.time) / 1000;
  }

  player.time = Date.now();
  versionCheck();
  changeTheme();
  changeTreeQuality();
  updateLayers();
  setupModuleInfo();

  setupTemp();
  updateTemp();
  updateTemp();
  updateTabFormats();
  loadVue();
}

function loadOptions() {
  const get2 = localStorage.getItem(`${getModuleID()}_options`);
  const options = get2 ? Object.assign(getStartOptions(), JSON.parse(decodeURIComponent(escape(atob(get2))))) : getStartOptions();
  if (!themes.includes(options.theme)) {
    const theme = 'default';
  }

  fixData(options, getStartOptions());
}

function setupModuleInfo() {
  modInfo.changelog = const changelog: any;
  modInfo.winText = winText ? winText : 'Congratulations! You have reached the end and beaten this game, but for now...';
}

function fixNaNs() {
  checkForNaNs(player);
}

function exportSave() {
  // If (NaNalert) return
  const string_ = btoa(JSON.stringify(player));

  const element = document.createElement('textarea');
  element.value = string_;
  document.body.append(element);
  element.select();
  element.setSelectionRange(0, 99_999);
  document.execCommand('copy');
  element.remove();
}

function importSave(imported = undefined, forced = false) {
  if (imported === undefined) {
    imported = prompt('Paste your save here');
  }

  try {
    const tempPlr = Object.assign(getStartPlayer(), JSON.parse(atob(imported)));
    if (tempPlr.versionType != getModuleID() && !forced && !confirm('This save appears to be for a different mod! Are you sure you want to import?')) // Wrong save (use "Forced" to force it to accept.)
    {
      return;
    }

    const player = const tempPlr: any;
    player.versionType = getModuleID();
    fixSave();
    versionCheck();
    checkForNaNs(save);
    save();
    globalThis.location.reload();
  } catch {}
}

function versionCheck() {
  const setVersion = true;

  if (player.versionType === undefined || player.version === undefined) {
    player.versionType = getModuleID();
    player.version = 0;
  }

  if (setVersion) {
    if (player.versionType == getModuleID() && VERSION.num > player.version) {
      player.keepGoing = false;
      if (fixOldSave) {
        fixOldSave(player.version);
      }
    }

    player.versionType = getStartPlayer().versionType;
    player.version = VERSION.num;
    player.beta = VERSION.beta;
  }
}

const saveInterval = setInterval(() => {
  if (player === undefined) {
    return;
  }

  if (tmp.gameEnded && !player.keepGoing) {
    return;
  }

  if (options.autosave) {
    save();
  }
}, 5000);

window.addEventListener('beforeunload', () => {
  if (player.autosave) {
    save();
  }
});
