import type Decimal from "break_eternity.js";
import { player, type PlayerType } from "@/core/save/save.js";
import { NotImplementedError } from "@/core/utils/errors.js";
import { row9Layers } from "../row9.js";
import type { LayerBuyableType } from "./buyables.js";
import type { MilestoneType } from "./milestone.js";
import type { LayerUpgradeType } from "./upgrades.js";
import type { ClickableType } from "./clickable.js";

export type StaticCalculationType = {
  type: "static"
  roundCost: boolean
  formula(baseResource: Decimal): Decimal
  runThroughEffects(resource: Decimal): Decimal
  isAutomated(): boolean
  canBuyMax(): boolean
};

export type IncrementalCalculationType = {
  type: "normal"
  formula(baseResource: Decimal): Decimal
  runThroughEffects(resource: Decimal): Decimal
  passiveGeneration(): boolean | Decimal
};

export type LayerFeatures = {
  layerName: string
  currencyName: string
  layerSymbol: string
  nodePosition: number
  nodeColor: string
  baseRequirement: Decimal
  layerBaseData: Record<string, Decimal | boolean | string>
  reliesOn: {
    resourceName: string
    resourceProperty(): Decimal
  }
  resourceCalculation: StaticCalculationType | IncrementalCalculationType
  layerRow: number
  branchesFrom: string[] | null
  milestones?: MilestoneType[]
  upgrades?: {
    rows: number
    coluums: number
    upgradeArray: Record<number, LayerUpgradeType>
  }
  buyables?: {
    rows: number
    coluums: number
    respectText: string
    buyableArray: Record<number, LayerBuyableType>
    showRespecButton(): boolean
    respec(): void
  }
  clickables?: {
    rows: number
    coluums: number
    clickableArray: Record<number, ClickableType>
  }
  layerTabFormat: string[] | null
  layerShown(): boolean
  resetsNothing(): boolean
  keepFeatures(layer: string): string[]
  update?(diff: Decimal, realDiff: Decimal, trueDiff: number): void
  disabledOnCondition(): boolean
};

export class Layer {
  config: LayerFeatures;
  buyables?: Record<number, LayerBuyableType>;
  upgrades?: Record<number, LayerUpgradeType>;

  constructor(readonly isPlayableLayer: boolean, readonly layerId: string, parameters: LayerFeatures) {
    this.config = parameters;
    this.upgrades = parameters.upgrades?.upgradeArray;
    this.buyables = parameters.buyables?.buyableArray;
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

  get requirementResource(): Decimal | null {
    return this.isPlayableLayer ? this.config.reliesOn.resourceProperty() : null;
  }

  get requirementResourceName(): string {
    return this.isPlayableLayer ? this.config.reliesOn.resourceName : "none";
  }

  get row(): number {
    return this.config.layerRow;
  }

  get isUnlocked(): boolean {
    return player.nodes[this.layerId].unlocked;
  }

  get playerData() {
    return this.config.layerBaseData;
  }

  get tabFormat() {
    return this.config.layerTabFormat ?? [
      "main-display",
      "prestige-button",
      "blank",
      "milestones",
      "blank",
      "blank",
      "buyables",
      "blank",
      "upgrades",
    ];
  }

  resourceGain(): Decimal | null {
    if (!this.isPlayableLayer) {
      return null;
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

  getUpgradeEffect(upgradeId: number): Decimal | undefined {
    return this.upgrades?.[upgradeId].upgradeEffect?.();
  }
}

export const Layers = {
  nodes: {
    ...row9Layers,
  },
  nodeArray: [
    ["P"],
    ["B", "G"],
    ["SB", "T", "E", "S", "SG"],
    ["O", "H", "Q", "SS"],
    ["EN", "M", "PS", "BA", "NE"],
    ["R", "N", "HN", "HS", "I", "ID"],
    ["AI", "GE", "MA", "MC", "C"],
  ],
  getNode(layer: string): Layer {
    return (Layers.nodes as Record<string, Layer>)[layer];
  },
  resetLayer(layerId: string, keepFeatures: string[]): void {
    throw new NotImplementedError("Layer reset function is not implemented yet.");
  },
  tick(diff: Decimal, realDiff: Decimal, trueDiff: number): void {
    for (const layer2 of this.nodeArray) {
      for (const layer1 of layer2) {
        this.getNode(layer1).update(diff, realDiff, trueDiff);
      }
    }
  },
  isDisabled(layer: string): boolean {
    return (Layers.nodes as Record<string, Layer>)[layer].isDisabled();
  },
  applyOntoPlayer(playerObject: PlayerType, layerObject?: Record<string, Record<string | number, any>>) {
    if (layerObject === undefined) {
      for (const layer1 of this.nodeArray) {
        for (const layer2 of layer1) {
          playerObject.nodes[layer2] = this.getNode(layer2).playerData;
          playerObject.nodes[layer2].upgrades = [];
          playerObject.nodes[layer2].buyables = [];
          playerObject.nodes[layer2].milestones = [];
          playerObject.nodes[layer2].achievements = [];
          playerObject.nodes[layer2].clickables = [];
        }
      }
    } else {
      for (const layer in layerObject) {
        playerObject.nodes[layer] = layerObject[layer];
      }
    }
  },
};
