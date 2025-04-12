// ************ Number formatting ************

import Decimal, { type DecimalSource } from "break_eternity.js";

function exponentialFormat(number_: Decimal, precision: number): string {
  let exp: number = number_.exponent;
  let m: number = number_.mantissa;
  if (Number(new Decimal(m).toStringWithDecimalPlaces(precision)) === 10) {
    m = 1;
    exp++;
  }

  const f: string = ((exp >= 1000) ? commaFormat(new Decimal(exp), 0) : new Decimal(exp).toStringWithDecimalPlaces(0));
  return `${new Decimal(m).toStringWithDecimalPlaces(precision)}e${f}`;
}

function commaFormat(number_: DecimalSource, precision: number): string {
  number_ = new Decimal(number_);
  if (Decimal.isNaN(number_)) {
    return "NaN";
  }

  if (number_.lt(0.001)) {
    return (0).toFixed(precision);
  }

  return number_.toStringWithDecimalPlaces(precision).replaceAll(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function regularFormat(number_: DecimalSource, precision: number): string {
  number_ = new Decimal(number_);
  if (Decimal.isNaN(number_)) {
    return "NaN";
  }

  if (number_.lt(0.001)) {
    return (0).toFixed(precision);
  }

  return number_.toStringWithDecimalPlaces(precision);
}

export function format(decimal: DecimalSource, precision = 2, whole = false): string {
  decimal = new Decimal(decimal);
  if (Decimal.isNaN(decimal)) {
    return "NaN";
  }

  if (decimal.sign < 0) {
    return `-${format(decimal.neg(), precision)}`;
  }

  if (decimal.mag === Number.POSITIVE_INFINITY) {
    return "Infinity";
  }

  if (decimal.eq(0)) {
    return "0";
  }

  if (decimal.gte("eeee1000")) {
    const slog = decimal.slog();
    if (slog.gte(1e3)) {
      return `10^^${formatWhole(slog)}`;
    }

    return `10^^${regularFormat(slog, 3)}`;
  }

  if (decimal.gte("eee100000")) {
    return `eee${format(decimal.log10().log10().log10(), 3)}`;
  }

  if (decimal.gte("ee100000")) {
    return `ee${format(decimal.log10().log10(), 3)}`;
  }

  if (decimal.gte("1e100000")) {
    return `e${format(decimal.log10(), 3)}`;
  }

  if (decimal.gte("1e1000")) {
    return exponentialFormat(decimal, 0);
  }

  if (decimal.gte(1e9)) {
    return exponentialFormat(decimal, precision);
  }

  if (decimal.gte(1e3)) {
    return commaFormat(decimal, 0);
  }

  if (decimal.gte(Decimal.pow(0.1, precision)) || whole) {
    return regularFormat(decimal, precision);
  }

  if (decimal.gt("1e-100000")) {
    return exponentialFormat(decimal, decimal.gte("1e-1000") ? precision : 0);
  }

  return `1/(${format(decimal.pow(-1), precision)})`;
}

export function formatWhole(decimal: DecimalSource, reallyWhole = false) {
  decimal = new Decimal(decimal);
  if (decimal.gte(1e9)) {
    return format(decimal, 2);
  }

  if (decimal.lte(0.95) && !decimal.eq(0) && !reallyWhole) {
    return format(decimal, 2);
  }

  return format(decimal, 0, true);
}

export function formatTime(value: DecimalSource, useHMS = true) {
  const s = new Decimal(value);
  if (s.lt(1e-30)) {
    return `${format(s.mul(5.391_247e44))} tP`;
  }

  if (s.lt(1e-27)) {
    return `${format(s.mul(1e30))} qs`;
  }

  if (s.lt(1e-24)) {
    return `${format(s.mul(1e27))} rs`;
  }

  if (s.lt(1e-21)) {
    return `${format(s.mul(1e24))} ys`;
  }

  if (s.lt(1e-18)) {
    return `${format(s.mul(1e21))} zs`;
  }

  if (s.lt(1e-15)) {
    return `${format(s.mul(1e18))} as`;
  }

  if (s.lt(1e-12)) {
    return `${format(s.mul(1e15))} fs`;
  }

  if (s.lt(1e-9)) {
    return `${format(s.mul(1e12))} ps`;
  }

  if (s.lt(1e-6)) {
    return `${format(s.mul(1e9))} ns`;
  }

  if (s.lt(1e-3)) {
    return `${format(s.mul(1e6))} μs`;
  }

  if (s.lt(1)) {
    return `${format(s.mul(1e3))} ms`;
  }

  if (s.lt(60)) {
    return `${format(s)} s`;
  }

  if (s.lt(3600)) {
    return useHMS
      ? `${formatWhole(s.div(60).floor())}:${format(s.mod(60))}`
      : `${format(s.div(60))} minutes`;
  }

  if (s.lt(86_400)) {
    return useHMS
      ? `${formatWhole(s.div(3600).floor())}:${format(s.div(60).floor().mod(60))}:${format(s.mod(60))}`
      : `${format(s.div(3600).floor())} hours, ${format(s.div(60).mod(60))} minutes`;
  }

  if (s.lt(31_536_000)) {
    return `${formatWhole(s.div(86_400).floor())} days, ${formatWhole(s.div(3600).floor().mod(24))} hours,
    ${formatWhole(s.div(60).mod(60))} minutes`;
  }

  if (s.lt(4_351_968e11)) {
    return `${formatWhole(s.div(31_536_000).floor())} years, ${formatWhole(s.div(86_400).mod(365))} days`;
  }

  return `${format(s.div(4_351_968e11))} unis`;
}

export function formatMult(value: DecimalSource, precision?: number): string {
  return Decimal.lt(value, 1) ? `/${format(value, precision)}` : `×${format(value, precision)}`;
}

export function formatPow(value: DecimalSource, precision?: number): string {
  return Decimal.lt(value, 1) ? `√${format(value, precision)}` : `^${format(value, precision)}`;
}

export function formatAdd(value: DecimalSource, precision?: number): string {
  if (Decimal.eq(value, 0)) return format(value, precision);
  else if (Decimal.sign(value) < 0) return `-${format(value, precision)}`;
  return `+${format(value, precision)}`;
}

export function formatGain(value: DecimalSource, gain: DecimalSource, precision?: number): string {
  const next = Decimal.add(value, gain);
  let ooms = next.max(10).slog(10).div(Decimal.max(gain, 10).slog(10));
  if (ooms.gte(3)) {
    return `(+${format(ooms)} OoMs^OoM/sec)`;
  } else {
    ooms = next.max(1).log10().max(1).log10().max(1).log10().div(Decimal.max(value, 1).log10().max(1).log10().max(1).log10());
    if ((ooms.gte(10) && Decimal.gte(value, "eee1e100"))
      || (ooms.gte(1.1220184543019633) && Decimal.gte(value, "eee1e1000"))) {
      ooms = ooms.log10().mul(20);
      return `(+${format(ooms)} OoMs^4/sec)`;
    }

    ooms = next.max(1).log10().max(1).log10().div(Decimal.max(value, 1).log10().max(1).log10());
    if ((ooms.gte(10) && Decimal.gte(value, "ee1e100"))
      || (ooms.gte(1.1220184543019633) && Decimal.gte(value, "ee1e1000"))) {
      ooms = ooms.log10().mul(20);
      return `(+${format(ooms)} OoMs^3/sec)`;
    }

    ooms = next.max(1).log10().div(Decimal.max(value, 1).log10());
    if ((ooms.gte(10) && Decimal.gte(value, "e1e100"))
      || (ooms.gte(1.1220184543019633) && Decimal.gte(value, "e1e1000"))) {
      ooms = ooms.log10().mul(20);
      return `(+${format(ooms)} OoMs^2/sec)`;
    }

    ooms = next.div(value);
    if ((ooms.gte(10) && Decimal.gte(value, "1e100")) || ooms.gte(50)) {
      return `(+${format(ooms.log10().mul(20))} OoMs/sec)`;
    }
  }
  return `(+${format(gain)}/sec)`;
}
