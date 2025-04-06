export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Math extends Math {
    clamp(value: number, minimum: number, maximum: number): number;
    clampMax(value: number, maximum: number): number;
    clampMin(value: number, minimum: number): number;
  }
}
