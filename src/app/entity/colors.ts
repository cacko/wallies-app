import { chunk, zip } from 'lodash-es';

export const distance = (c1: string, c2: string) => {
  const rgbs = zip(
    chunk(c1, 2).map((c) => parseInt(c.join(''), 16)),
    chunk(c2, 2).map((c) => parseInt(c.join(''), 16))
  );

  const d = rgbs.reduce(
    (r, c) => r + Math.pow((c[0] || 0) - (c[1] || 0), 2),
    0
  );
  return Math.sqrt(d);
};

export const distanceFrom = (colors: string[], c2: string) => {
  return Math.min(...colors.map((cl) => distance(cl, c2)));
};
