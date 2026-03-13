/**
 * Deterministic PRNG using the Lehmer/Park-Miller algorithm.
 * Returns a function that produces values in (0, 1) on each call.
 */
export function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
