// Not the same one from Antimatter Dimensions.

import Decimal from "break_eternity.js";
import { strFromU8, strToU8, decompressSync, compressSync } from "fflate";
import { base64ToString, stringToBase64 } from "uint8array-extras";

const metadataGss = {
  startingString: "ModdingTreeSavefileFormatHeader",

  endingString: "EndOfTMTSavefile",

  version: "1.0.0",
};

export const GameSaveSerializer = {
  jsonSerializer: (key: string, value: any) => {
    if (value instanceof Decimal) {
      return [value.toString(), "Decimal"];
    }

    if (value instanceof Set) {
      return [...value.keys()];
    }

    return value;
  },

  jsonDeserializer: (key: string, value: any) => {
    if (Array.isArray(value) && value[1] === "Decimal") {
      return new Decimal(value[0]);
    }

    return value;
  },

  serialize(save: Record<string | number, any>) {
    const json = JSON.stringify(save, this.jsonSerializer);
    return this.decodeText(json);
  },

  deserialize(save: string) {
    try {
      const json = this.decodeText(save);
      return JSON.parse(json, this.jsonDeserializer);
    } catch {
      return;
    };
  },

  encodeText(text: string): string {
    for (const step of this.steps) {
      text = step.encode(text);
    }

    return text;
  },

  decodeText(text: string): string {
    for (const step of this.steps) {
      text = step.decode(text);
    }

    return text;
  },

  steps: [
    {
      encode: (x: string) => strFromU8(compressSync(strToU8(x))),
      decode: (x: string) => strFromU8(decompressSync(strToU8(x))),
    },
    {
      encode: (x: string) => stringToBase64(x),
      decode: (x: string) => base64ToString(x),
    },
    {
      encode: (x: string) => x.replaceAll(/=+$/gu, "").replaceAll("0", "0a").replaceAll("+", "0b").replaceAll("/", "0c"),
      decode: (x: string) => x.replaceAll("0b", "+").replaceAll("0c", "/").replaceAll("0a", "0"),
    },
    {
      encode: (x: string) => {
        return `${x}${metadataGss.endingString}`;
      },
      decode: (x: string) => {
        return x.slice(
          0,
          x.length - metadataGss.endingString.length,
        );
      },
    },
    {
      encode: (x: string) => {
        return `${metadataGss.startingString}Version${metadataGss.version}-${x}`;
      },
      decode: (x: string) => {
        return x.slice(
          metadataGss.startingString.length + 6,
        );
      },
    },
  ],
};
