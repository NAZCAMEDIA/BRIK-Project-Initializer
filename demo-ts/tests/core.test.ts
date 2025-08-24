import { add, isEven, clamp01 } from '../src/core/index';

test('add works', () => { expect(add(2, 3)).toBe(5); });
test('isEven true', () => { expect(isEven(4)).toBe(true); });
test('isEven false', () => { expect(isEven(5)).toBe(false); });
test('clamp01 low', () => { expect(clamp01(-1)).toBe(0); });
test('clamp01 high', () => { expect(clamp01(2)).toBe(1); });
test('clamp01 mid', () => { expect(clamp01(0.5)).toBe(0.5); });
