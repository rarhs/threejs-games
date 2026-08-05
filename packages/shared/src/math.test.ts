import { describe, expect, it } from "vitest";
import { clamp, damp, lerp, rand, randInt } from "./math";

describe("clamp", () => {
  it("returns the value when inside the range", () => {
    expect(clamp(3, 0, 10)).toBe(3);
  });

  it("clamps below the minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps above the maximum", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("lerp", () => {
  it("returns a at t=0 and b at t=1", () => {
    expect(lerp(2, 8, 0)).toBe(2);
    expect(lerp(2, 8, 1)).toBe(8);
  });

  it("interpolates linearly in between", () => {
    expect(lerp(2, 8, 0.5)).toBe(5);
    expect(lerp(-10, 10, 0.25)).toBe(-5);
  });
});

describe("rand", () => {
  it("stays within [min, max)", () => {
    for (let i = 0; i < 1000; i++) {
      const v = rand(-3, 7);
      expect(v).toBeGreaterThanOrEqual(-3);
      expect(v).toBeLessThan(7);
    }
  });
});

describe("randInt", () => {
  it("returns integers within [min, max] inclusive and reaches both endpoints", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 1000; i++) {
      const v = randInt(1, 3);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(3);
      seen.add(v);
    }
    expect(seen).toEqual(new Set([1, 2, 3]));
  });
});

describe("damp", () => {
  it("moves toward the target without overshooting", () => {
    const next = damp(0, 10, 4, 0.1);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(10);
  });

  it("is frame-rate independent: two half steps equal one full step", () => {
    const full = damp(0, 10, 3, 0.2);
    const half = damp(damp(0, 10, 3, 0.1), 10, 3, 0.1);
    expect(half).toBeCloseTo(full, 10);
  });

  it("returns the current value when dt is 0", () => {
    expect(damp(4, 10, 3, 0)).toBeCloseTo(4, 10);
  });

  it("converges to the target for large dt", () => {
    expect(damp(0, 10, 50, 10)).toBeCloseTo(10, 6);
  });
});
