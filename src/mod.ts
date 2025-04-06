import Decimal from "break_eternity.js";

export enum DevelopmentStages {
  Indev = "Indev",
  PreAlpha = "Pre-Alpha",
  Alpha = "Alpha",
  Unstable = "Unstable",
  Beta = "Beta",
  Testing = "Testing",
  ReleaseCandidate = "RC",
  Stable = "Stable",
}

// Prestige Tree mod information, add your stuff here.
// eslint-disable-next-line unicorn/prevent-abbreviations
export const modInfo = {
  name: "The Typescript Tree",
  id: "tpt-ts",
  author: "Bored Thien",
  pointsName: "points",
  discordName: "thienum",
  discordLink: "https://discord.gg/a3VfXRfMdA",
  changelogLink: "https://github.com/Thien-Hubbing/Extended-Tree/blob/master/changelog.md",
  offlineLimit: 24, // In hours
  initialStartPoints: new Decimal(100), // Used for hard resets and new players
  endgame: new Decimal("e3.140e16"),
  specialEndgameText: "v2.0 Endgame: Reach e3.140e16 points to beat the game!",
  modVersion: "2.0-indev1",
  developmentStage: DevelopmentStages.Indev,
  modVersionName: "The Typescript Port",
} as const;

function canGeneratePoints(): boolean {
  return false;
}

function basePointGain(): Decimal {
  const base = new Decimal(1);
  return base;
}

function applyPointGainMultipliers(gain: Decimal): Decimal {
  return gain;
}

function applyPointGainPowerers(gain: Decimal): Decimal {
  return gain;
}

export function calculatePointsGain(): Decimal {
  if (!canGeneratePoints()) {
    return new Decimal(0);
  }

  let gain = basePointGain();
  gain = applyPointGainMultipliers(gain);
  gain = applyPointGainPowerers(gain);
  return gain;
}
