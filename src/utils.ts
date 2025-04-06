import type Decimal from "break_eternity.js";
import { Layers } from "layers/layer";
import { player } from "save/save";

export function hasUpgrade(layer: string, id: string): boolean {
  return (player[layer].upgrades.includes(id) && !Layers.isDisabled(layer));
}

export function hasMilestone(layer: string, id: string): boolean {
  return (player[layer].milestones.includes(id) && !Layers.isDisabled(layer));
}

export function hasAchievement(layer: string, id: string): boolean {
  return (player[layer].achievements.includes(id) && !Layers.isDisabled(layer));
}

export function hasChallenge(layer: string, id: string): boolean {
  return ((player[layer].challenges[id]) && !Layers.isDisabled(layer));
}

function maxedChallenge(layer: string, id: string): boolean {
  return ((player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit) && !Layers.isDisabled(layer));
}

function challengeCompletions(layer: string, id: string): boolean {
  return (player[layer].challenges[id]);
}

function canEnterChallenge(layer: string, id: string): boolean {
  return tmp[layer].challenges[id].canEnter ?? true;
}

function canExitChallenge(layer: string, id: string): boolean {
  return tmp[layer].challenges[id].canExit ?? true;
}

function getBuyableAmount(layer: string, id: string): boolean {
  return (player[layer].buyables[id]);
}

function setBuyableAmount(layer: string, id: string, amt: Decimal): void {
  player[layer].buyables[id] = amt;
}

function addBuyables(layer: string, id, amt): void {
  player[layer].buyables[id] = player[layer].buyables[id].add(amt);
}

function getClickableState(layer: string, id: string): unknown {
  return (player[layer].clickables[id]);
}

function setClickableState(layer: string, id, state): void {
  player[layer].clickables[id] = state;
}

function getGridData(layer: string, id: string): unknown {
  return (player[layer].grid[id]);
}

function setGridData(layer: string, id, data): void {
  player[layer].grid[id] = data;
}

function upgradeEffect(layer: string, id: string): unknown {
  return (tmp[layer].upgrades[id].effect);
}

function challengeEffect(layer: string, id: string): unknown {
  return (tmp[layer].challenges[id].rewardEffect);
}

function buyableEffect(layer: string, id: string): unknown {
  return (tmp[layer].buyables[id].effect);
}

function clickableEffect(layer: string, id: string): unknown {
  return (tmp[layer].clickables[id].effect);
}

function achievementEffect(layer: string, id: string): unknown {
  return (tmp[layer].achievements[id].effect);
}

function gridEffect(layer: string, id: string): unknown {
  return (gridRun(layer, "getEffect", player[layer].grid[id], id));
}
