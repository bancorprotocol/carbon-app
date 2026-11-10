import { describe, expect, it } from 'vitest';
import { getExtendedRange } from './utils';

const DAY = 24 * 60 * 60;
const START = 1_704_067_200; // 2024-01-01 UTC

const days = (count: number, start = START) => {
  return Array.from({ length: count }, (_, i) => start + i * DAY);
};

describe('getExtendedRange', () => {
  it('returns an empty range when no timestamps are provided', () => {
    expect(getExtendedRange([])).toEqual([]);
  });

  it('uses a one-day step for a single timestamp', () => {
    const [timestamp] = days(1);
    const range = getExtendedRange([timestamp]);

    expect(range.length).toBeGreaterThan(0);
    expect(range).toContain(timestamp.toString());
    expect(range).toContain((timestamp + 50 * DAY).toString());
  });

  it('covers auction dates when history has only a few daily points', () => {
    const history = days(5);
    const last = history.at(-1)!;
    const range = getExtendedRange(history);

    expect(range).toContain(last.toString());
    expect(range).toContain((last + 50 * DAY).toString());
  });

  it('uses daily buckets for sparse non-consecutive history', () => {
    const history = [START, START + 14 * DAY, START + 30 * DAY];
    const last = history.at(-1)!;
    const range = getExtendedRange(history);

    expect(range).toContain(last.toString());
    expect(range).toContain((last + 5 * DAY).toString());
    expect(range).toContain((last + 50 * DAY).toString());
  });

  it('preserves the existing extended window for a full year of history', () => {
    const history = days(365);
    const range = getExtendedRange(history).map(Number);

    expect(range[0]).toBe(START - 183 * DAY);
    expect(range.at(-1)).toBe(START + 729 * DAY);
  });
});
