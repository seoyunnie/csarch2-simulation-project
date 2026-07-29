export function isPowerOfTwo(num: number): boolean {
  return num > 0 && (num & (num - 1)) === 0;
}
