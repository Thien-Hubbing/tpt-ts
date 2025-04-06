import Decimal, { type DecimalSource } from "break_eternity.js";

export enum SoftcapModes {
  Exponential = "pow",
  Multiplicative = "mul",
  BaseExponent = "exp",
  Logarithmic = "log",
  LogarithmicExponential = "logExp",
  RepeatedLogarithm = "itrLog",
  SuperLogarithmic = "slog",
}

export enum ScalingTypes {
  Exponential = "pow",
  BaseExponent = "exp",
  Dilation = "dil",
  DilationTier2 = "dil_2",
  RepeatedExponentiation = "itrExp",
  Tetration = "tetr",
}

export function softcap(parameters: {
  BaseResource: Decimal;
  SoftcapStart: DecimalSource;
  SoftcapPower: DecimalSource;
  SoftcapType: SoftcapModes;
  IsDisabled?: boolean;
}): Decimal {
  const start = new Decimal(parameters.SoftcapStart);
  const power = new Decimal(parameters.SoftcapPower);
  if (!parameters.IsDisabled && parameters.BaseResource.lt(start)) {
    return parameters.BaseResource;
  }

  switch (parameters.SoftcapType) {
    case SoftcapModes.Exponential: {
      return parameters.BaseResource.div(start).max(1).pow(power).mul(start);
    }

    case SoftcapModes.Multiplicative: {
      return parameters.BaseResource.sub(start).div(power).plus(start);
    }

    case SoftcapModes.BaseExponent: {
      return Decimal.pow10(parameters.BaseResource.div(start).log10().pow(power)).mul(start);
    }

    case SoftcapModes.Logarithmic: {
      return parameters.BaseResource.div(start).log(power).plus(1).mul(start);
    }

    case SoftcapModes.LogarithmicExponential: {
      return Decimal.pow10(parameters.BaseResource.div(start).log(power).log10().pow(power)).mul(start);
    }

    case SoftcapModes.RepeatedLogarithm: {
      return Decimal.iteratedlog(parameters.BaseResource.div(start), 10, power.toNumber()).plus(1).mul(start);
    }

    case SoftcapModes.SuperLogarithmic: {
      return Decimal.slog(parameters.BaseResource.div(start), power).plus(1).mul(start);
    }
  }
}

export function scale(parameters: {
  BaseResource: Decimal;
  ScaleStart: DecimalSource;
  ScalePower: DecimalSource;
  ScaleMode: ScalingTypes;
  IsInverted: boolean;
}): Decimal {
  const start = new Decimal(parameters.ScaleStart);
  const power = new Decimal(parameters.ScalePower);
  if (parameters.BaseResource.lt(start)) {
    return parameters.BaseResource;
  }

  switch (parameters.ScaleMode) {
    case ScalingTypes.Exponential: {
      return parameters.IsInverted
        ? parameters.BaseResource.div(start).root(power).mul(start)
        : parameters.BaseResource.div(start).pow(power).mul(start);
    }

    case ScalingTypes.BaseExponent: {
      return parameters.IsInverted
        ? parameters.BaseResource.div(start).max(1).log(power).plus(1).mul(start)
        : Decimal.pow(power, parameters.BaseResource.div(start).sub(1)).mul(start);
    }

    case ScalingTypes.Dilation: {
      const s10: Decimal = Decimal.log10(start);
      return parameters.IsInverted
        ? Decimal.pow10(parameters.BaseResource.log10().div(s10).root(power).mul(s10))
        : Decimal.pow10(parameters.BaseResource.log10().div(s10).pow(power).mul(s10));
    }

    case ScalingTypes.DilationTier2: {
      const s10: Decimal = Decimal.log10(start).plus(1).log10();
      return parameters.IsInverted
        ? parameters.BaseResource.log10().plus(1).log10().div(s10).root(power).mul(s10).pow10().pow10()
        : parameters.BaseResource.log10().plus(1).log10().div(s10).pow(power).mul(s10).pow10().pow10();
    }

    case ScalingTypes.RepeatedExponentiation: {
      return parameters.IsInverted
        ? Decimal.iteratedlog(parameters.BaseResource.div(start).max(1), 10, new Decimal(power).toNumber()).plus(1).mul(start)
        : Decimal.iteratedexp(parameters.BaseResource.div(start), new Decimal(power).toNumber()).plus(1).mul(start);
    }

    case ScalingTypes.Tetration: {
      return parameters.IsInverted
        ? parameters.BaseResource.div(start).slog(power).plus(1).mul(start)
        : parameters.BaseResource.div(start).tetrate(new Decimal(power).toNumber()).mul(start);
    }
  }
}
