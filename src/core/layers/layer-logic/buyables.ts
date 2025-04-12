import type Decimal from "break_eternity.js";

export type LayerBuyableType = {
  buyableTitle: string
  baseResource: Decimal
  unlocked(): boolean
  cost(resource: Decimal): Decimal
  buyableEffect(): Decimal
  inverseCost(amount: Decimal): Decimal
  automated(): boolean
};

export class Buyable {
  config: LayerBuyableType;

  constructor(parameters: LayerBuyableType) {
    this.config = parameters;
  }

  get effectValue() {
    return this.config.buyableEffect();
  }

  get cost() {
    return this.config.cost(this.config.baseResource);
  }
}
