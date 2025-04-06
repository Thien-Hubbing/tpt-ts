import Decimal from "break_eternity.js";
import { Layers } from "layers/layer";
import { player } from "save/save";

let allowedToTick = true;

export function gameLoop(passedDiff: number) {
  const thisUpdate = Date.now();
  const trueDiff = passedDiff ?? Math.clamp(thisUpdate - player.lastUpdate, 1, 8.64e7);
  const realDiff = new Decimal(trueDiff);
  const diff = realDiff;

  Layers.tick(diff, realDiff, trueDiff);
}
