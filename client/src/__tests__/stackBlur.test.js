import { describe, expect, test } from 'vitest';
import { applyStackBlur } from '../utils/stackBlur.js';

describe('applyStackBlur', () => {
  test('throws when image data is invalid', () => {
    expect(() => applyStackBlur(null, 1)).toThrow('Invalid image data');
  });

  test('returns identical data when radius is zero', () => {
    const original = new ImageData(new Uint8ClampedArray([100, 150, 200, 255]), 1, 1);
    const blurred = applyStackBlur(original, 0);
    expect(Array.from(blurred.data)).toEqual([100, 150, 200, 255]);
    expect(blurred).not.toBe(original);
  });

  test('blurs pixels with positive radius', () => {
    const pixels = new Uint8ClampedArray([
      255, 0, 0, 255,
      0, 0, 0, 255,
      255, 0, 0, 255
    ]);
    const image = new ImageData(pixels, 3, 1);
    const blurred = applyStackBlur(image, 1);
    expect(blurred.data[0]).toBeLessThan(255);
    expect(blurred.data[4]).toBeGreaterThan(0);
  });
});
