export const getRandomValue = <T>(values: T[]): T => {
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};

interface RandomValueOptions {
  times?: number;
  repeatable?: boolean;
  count?: number;
}

const defaultOptions = { times: 1, repeatable: false, count: undefined };

export const getRandomValues = <T>(values: T[], opts: RandomValueOptions = defaultOptions): T[] => {
  const { repeatable = false, times = 1, count } = opts;
  if (!repeatable && count && count > values.length) throw new Error('Count must be less than values length');
  const result: T[] = [];
  const indexes = new Set<number>();
  while (indexes.size < (count ?? values.length)) {
    const index = Math.floor(Math.random() * values.length);
    if (repeatable || !indexes.has(index)) {
      indexes.add(index);
      result.push(values[index]);
    }
  }
  return result.flatMap((item) => Array(times).fill(item));
};

export const getRandomArrangeValues = <T>(values: T[], opts: RandomValueOptions = defaultOptions): T[] => {
  const startIndex = Math.floor(Math.random() * values.length);
  const endIndex = startIndex + Math.floor(Math.random() * (values.length - startIndex)) + 1;
  return values.slice(startIndex, endIndex).flatMap((item) => Array(opts.times).fill(item));
};
