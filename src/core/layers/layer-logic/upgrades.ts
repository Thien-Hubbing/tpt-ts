import type Decimal from "break_eternity.js";

export type LayerUpgradeType = {
  upgradeTitle: string
  upgradeDescription: string
  effectFormula?: string
  cost(): Decimal
  upgradeEffect?(): Decimal
  displayEffect?(): string
  isDisplayed(): boolean
};

export class Upgrade {
  config: LayerUpgradeType;

  constructor(parameters: LayerUpgradeType) {
    this.config = parameters;
  }
}

export const Upgrades = {};
