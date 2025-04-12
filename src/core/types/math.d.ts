export {};

declare global {
  interface Math {
    clamp(value: number, minimum: number, maximum: number): number
    clampMax(value: number, maximum: number): number
    clampMin(value: number, minimum: number): number
  }
}
