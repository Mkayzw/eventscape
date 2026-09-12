import { createHash } from "node:crypto";

const MASK_64 = (1n << 64n) - 1n;
const TWO_POW_53 = 9_007_199_254_740_992;

function rotateLeft(value: bigint, shift: bigint): bigint {
  return ((value << shift) | (value >> (64n - shift))) & MASK_64;
}

export class Xoshiro256StarStar {
  readonly #state: [bigint, bigint, bigint, bigint];

  constructor(state: readonly [bigint, bigint, bigint, bigint]) {
    this.#state = [...state] as [bigint, bigint, bigint, bigint];
    if (this.#state.every((word) => word === 0n)) {
      this.#state[0] = 1n;
    }
  }

  nextUint64(): bigint {
    const state = this.#state;
    const result = (rotateLeft((state[1] * 5n) & MASK_64, 7n) * 9n) & MASK_64;
    const temporary = (state[1] << 17n) & MASK_64;

    state[2] ^= state[0];
    state[3] ^= state[1];
    state[1] ^= state[2];
    state[0] ^= state[3];
    state[2] ^= temporary;
    state[3] = rotateLeft(state[3], 45n);

    return result;
  }

  nextFloat(): number {
    return Number(this.nextUint64() >> 11n) / TWO_POW_53;
  }

  nextInt(maxExclusive: number): number {
    if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) {
      throw new RangeError("maxExclusive must be a positive safe integer");
    }

    const bound = BigInt(maxExclusive);
    const range = 1n << 64n;
    const limit = range - (range % bound);
    let sample = this.nextUint64();
    while (sample >= limit) {
      sample = this.nextUint64();
    }
    return Number(sample % bound);
  }
}

function deriveState(
  seed: string,
  name: string,
): [bigint, bigint, bigint, bigint] {
  if (!/^(0|[1-9]\d*)$/.test(seed) || BigInt(seed) > MASK_64) {
    throw new RangeError(
      "seed must be a canonical unsigned 64-bit decimal string",
    );
  }
  if (name.length === 0) {
    throw new TypeError("stream name must not be empty");
  }

  const digest = createHash("sha256")
    .update(`eventscape:rng:v1\0${seed}\0${name}`, "utf8")
    .digest();

  return [0, 8, 16, 24].map((offset) => digest.readBigUInt64BE(offset)) as [
    bigint,
    bigint,
    bigint,
    bigint,
  ];
}

export class NamedRandomStreams {
  readonly #seed: string;
  readonly #streams = new Map<string, Xoshiro256StarStar>();

  constructor(seed: string) {
    this.#seed = seed;
    deriveState(seed, "validation");
  }

  stream(name: string): Xoshiro256StarStar {
    let stream = this.#streams.get(name);
    if (!stream) {
      stream = new Xoshiro256StarStar(deriveState(this.#seed, name));
      this.#streams.set(name, stream);
    }
    return stream;
  }
}
