import type Decimal from "break_eternity.js";

export type MilestoneType = {
  requirementDescription: string
  effectDescription: string
  completedOn(): boolean
  effect?(): Decimal
  effectFormat?(): string
};

export class Milestone {
  config: MilestoneType;

  constructor(parameters: MilestoneType) {
    this.config = parameters;
  }
};
