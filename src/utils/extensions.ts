/* eslint-disable func-names */
Math.clamp = function clamp(value: number, minimum: number, maximum: number) {
  return Math.clampMax(Math.clampMin(value, minimum), maximum);
};

Math.clampMax = function clampMax(value: number, maximum: number) {
  return Math.min(value, maximum);
};

Math.clampMin = function clampMin(value: number, minimum: number) {
  return Math.max(value, minimum);
};
