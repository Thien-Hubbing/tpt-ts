import Decimal from "break_eternity.js";
import { Layers } from "layers-logic";
import { player } from "@/core/save/save.js";

const allowedToTick = true;

export function gameLoop(passedDiff: number) {
  const thisUpdate = Date.now();
  let trueDiff = passedDiff;
  trueDiff *= player.dev.speedMult;

  const realDiff = new Decimal(trueDiff);
  const diff = realDiff;

  Layers.tick(diff, realDiff, trueDiff);
}
