import Decimal from "break_eternity.js";
import { Layer } from "./layer-logic";
import { player } from "../save/save";

const prestigeLayer = new Layer(true, "P", {
  layerName: "prestige",
  layerSymbol: "P",
  nodePosition: 0,
  layerBaseData: {
    unlocked: true,
    points: new Decimal(0),
  },
  nodeColor: "#4BDC13",
  baseRequirement: new Decimal(10),
  reliesOn: {
    resourceName: "points",
    resourceProperty() {
      return player.points;
    },
  },
  currencyName: "prestige points",
  resourceCalculation: {
    type: "normal",
    formula(baseResource) {
      return baseResource.pow(0.5);
    },
    runThroughEffects(resource) {
      return resource;
    },
    passiveGeneration() {
      return false;
    },
  },
  layerRow: 0,
  layerTabFormat: null,
  layerShown() {
    return true;
  },
  branchesFrom: null,
  resetsNothing() {
    return false;
  },
  disabledOnCondition() {
    return false;
  },
  keepFeatures(layer) {
    return [];
  },
});

export const row1Layers = {
  p: prestigeLayer,
};
