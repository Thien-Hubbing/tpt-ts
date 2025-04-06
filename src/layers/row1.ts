import Decimal from "break_eternity.js";
import { player } from "save/save.js";
import { calculatePointsGain } from "mod.js";
import { format, formatMult } from "format.js";
import { softcap, SoftcapModes } from "sc.js";
import { Layer } from "./layer.js";

const prestigeLayer = new Layer(true, "P", {
  layerName: "prestige",
  layerSymbol: "P",
  nodePosition: 0,
  nodeColor: "#31AEB0",
  baseRequirement: new Decimal(10),
  reliesOn: {
    resourceName: "points",
    resourceProperty() {
      return player.points;
    },
  },
  resourceCalculation: {
    type: "normal",
    formula(baseResource) {
      return baseResource.pow(0.75);
    },
    runThroughEffects(resource) {
      return resource;
    },
    passiveGeneration() {
      return false;
    },
  },
  layerRow: 0,
  layerShown() {
    return true;
  },
  keepFeatures(layer) {
    const keep: string[] = [];
    return keep;
  },
  layerBaseData: {
    unlocked: true,
    points: new Decimal(0),
    best: new Decimal(0),
    total: new Decimal(0),
  },
  disabledOnCondition() {
    return false;
  },
  upgrades: {
    rows: 4,
    coluums: 4,
    // Disabled as upgrades can only have numerical indexes but this requires camelCase indexes which uses strings.
    /* eslint-disable @typescript-eslint/naming-convention */
    upgradeArray: {
      11: {
        upgradeTitle: "Begin",
        upgradeDescription: "Generate 1 point every second.",
        cost() {
          return new Decimal(1);
        },
        displayEffect() {
          return `+${format(calculatePointsGain())}/s`;
        },
        isDisplayed() {
          return true;
        },
      },
      12: {
        upgradeTitle: "Prestige Boost",
        upgradeDescription: "Prestige Points boost Point generation.",
        cost() {
          return new Decimal(1);
        },
        upgradeEffect() {
          let eff = player.p.points.plus(2).sqrt();
          eff = softcap({
            BaseResource: eff,
            SoftcapStart: new Decimal("1e3500"),
            SoftcapPower: 10,
            SoftcapType: SoftcapModes.Logarithmic,
            IsDisabled: false,
          });
          return eff;
        },
        displayEffect() {
          return formatMult(this.upgradeEffect());
        },
        isDisplayed() {
          return hasUpgrade("P", 11);
        },
      },
    },
    /* eslint-enable @typescript-eslint/naming-convention */
  },
});
