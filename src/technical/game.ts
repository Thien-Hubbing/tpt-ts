import Decimal from "break_eternity.js";
import { Layers } from "layers/layer";
import { player } from "save/save";

let allowedToTick = true;

function trueTimeMechanics(trueDiff: number): void {}

function realTimeMechanics(realDiff: Decimal): void {}

export function gameLoop(passedDiff: number) {
  const thisUpdate = Date.now();
  const trueDiff = passedDiff ?? Math.clamp(thisUpdate - player.lastUpdate, 1, 8.64e7);
  const realDiff = new Decimal(trueDiff);
  const diff = realDiff;

  trueTimeMechanics(trueDiff);
  realTimeMechanics(realDiff);
  Layers.tick(diff, realDiff);
}
