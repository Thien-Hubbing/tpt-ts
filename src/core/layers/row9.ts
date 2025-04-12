import Decimal from "break_eternity.js";
import { player } from "core/save/save.js";
import { Layer } from "./layer-logic/layer.js";

const hyperPointsLayer = new Layer(true, "HP", {
  layerName: "Hyper Points",
  currencyName: "Hyper Points",
  layerSymbol: "HP",
  nodePosition: 0,
  nodeColor: "#D4FCFa",
  baseRequirement: new Decimal("e5.55e16"),
  layerBaseData: {
    unlocked: false,
    points: new Decimal(0),
    best: new Decimal(0),
    total: new Decimal(0),
  },
  reliesOn: {
    resourceName: "points",
    resourceProperty() {
      return player.points;
    },
  },
  resourceCalculation: {
    type: "normal",
    formula(baseResource: Decimal): Decimal {
      return baseResource.pow("1e-17");
    },
    runThroughEffects(resource: Decimal): Decimal {
      return resource;
    },
    passiveGeneration: () => new Decimal(0),
  },
  layerRow: 9,
  branchesFrom: ["C", "AI", "MA"],
  layerShown: () => false,
  keepFeatures(layer: string): string[] {
    const keep: string[] = [];
    return keep;
  },
  resetsNothing: () => false,
  disabledOnCondition() {
    return true;
  },
});

export const row9Layers = {
  hyperPointsLayer,
};
