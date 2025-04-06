import type Decimal from "break_eternity.js";
import { player } from "save/save.js";
import { NotImplementedError } from "utils/errors";
import { row9Layers } from "./row9.js";

export type MilestoneType = {
  requirementDescription: string;
  effectDescription: string;
  completedOn(): boolean;
  effect?(): Decimal;
};

export type LayerUpgradeType = {
  upgradeTitle: string;
  upgradeDescription: string;
  effectFormula?: string;
  cost(): Decimal;
  upgradeEffect?(): Decimal;
  displayEffect?(): string;
  isDisplayed(): boolean;
};

export type LayerBuyableType = {
  buyableTitle: string;
  unlocked(): boolean;
  cost(resource: Decimal): Decimal;
  buyableEffect(): Decimal;
  inverseCost(amount: Decimal): Decimal;
  automated(): boolean;
};

export type StaticCalculationType = {
  type: "static";
  roundCost: boolean;
  formula(baseResource: Decimal): Decimal;
  runThroughEffects(resource: Decimal): Decimal;
  isAutomated(): boolean;
  canBuyMax(): boolean;
};

export type IncrementalCalculationType = {
  type: "normal";
  formula(baseResource: Decimal): Decimal;
  runThroughEffects(resource: Decimal): Decimal;
  passiveGeneration(): boolean | Decimal;
};

export type LayerFeatures = {
  layerName: string;
  currencyName: string;
  layerSymbol: string;
  nodePosition: number;
  nodeColor: string;
  baseRequirement: Decimal;
  layerBaseData: Record<string, Decimal | boolean | string>;
  reliesOn: {
    resourceName: string;
    resourceProperty(): Decimal;
  };
  resourceCalculation: StaticCalculationType | IncrementalCalculationType;
  layerRow: number;
  branchesFrom: string[] | void;
  milestones?: MilestoneType[];
  upgrades?: {
    rows: number;
    coluums: number;
    upgradeArray: Record<number, LayerUpgradeType>;
  };
  buyables?: {
    rows: number;
    coluums: number;
    respectText: string;
    buyableArray: Record<number, LayerBuyableType>;
    showRespecButton(): boolean;
    respec(): void;
  };
  layerShown(): boolean;
  resetsNothing(): boolean;
  keepFeatures(layer: string): string[];
  update?(diff: Decimal, realDiff: Decimal, trueDiff: number): void;
  disabledOnCondition(): boolean;
};

export class Layer {
  config: LayerFeatures;

  constructor(readonly isPlayableLayer: boolean, readonly layerId: string, parameters: LayerFeatures) {
    this.config = parameters;
  }

  get name(): string {
    return this.config.layerName.toLocaleLowerCase();
  }

  get symbol(): string {
    return this.config.layerSymbol;
  }

  get color(): string {
    return this.config.nodeColor;
  }

  get requirementResource(): Decimal | void {
    return this.isPlayableLayer ? this.config.reliesOn.resourceProperty() : undefined;
  }

  get requirementResourceName(): string {
    return this.isPlayableLayer ? this.config.reliesOn.resourceName : "none";
  }

  get row(): number {
    return this.config.layerRow;
  }

  resourceGain(): Decimal | void {
    if (!this.isPlayableLayer) {
      return;
    }

    if (this.config.resourceCalculation.type === "normal") {
      let baseGain = this.config.resourceCalculation.formula(this.requirementResource as Decimal);
      baseGain = this.config.resourceCalculation.runThroughEffects(baseGain);
      return baseGain;
    }

    throw new NotImplementedError("Static cost calculations has not been implemented yet.");
  }

  resetLayer(layer: string) {
    if (Layers.getNode(layer).row > this.row) {
      Layers.resetLayer(this.layerId, this.config.keepFeatures(layer));
    }
  }

  update(diff: Decimal, realDiff: Decimal, trueDiff: number): void {
    this.config.update?.(diff, realDiff, trueDiff);
  }

  isDisabled(): boolean {
    return this.config.disabledOnCondition();
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Layers = {
  nodes: {
    ...row9Layers,
  },
  nodeArray: [],
  getNode(layer: string): Layer {
    return (Layers.nodes as Record<string, Layer>)[layer];
  },
  resetLayer(layerId: string, keepFeatures: string[]): void {
    throw new NotImplementedError("Layer reset function is not implemented yet.");
  },
  tick(diff: Decimal, realDiff: Decimal, trueDiff: number): void {
    for (const layer of this.nodeArray) {
      this.getNode(layer).update(diff, realDiff, trueDiff);
    }
  },
  isDisabled(layer: string): boolean {
    return (Layers.nodes as Record<string, Layer>)[layer].isDisabled();
  },
};
