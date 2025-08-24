export function add(a: number, b: number): number { return a + b; }
export function isEven(n: number): boolean { return n % 2 === 0; }
export function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}
