/**
 * [description]
 * @param value
 */
export function toNumArrayByComa(value: string | string[]): number[] {
  if (Array.isArray(value)) return value.map((el) => parseFloat(el));
  if (typeof value === 'string') return value?.split(/[, ]+/).map((el) => parseFloat(el));
  return value;
}

/**
 * [description]
 * @param value
 * @param cb
 */
export async function toPromiseArrayFromIterator<U>(
  iterator: AsyncIterableIterator<U>,
): Promise<Awaited<U>[]> {
  if (!iterator) return [];

  const array: Awaited<U>[] = [];
  for await (const data of iterator) {
    array.push(data);
  }
  return array;
}

/**
 * [description]
 * @param array
 * @param value
 */
export function toObjectFromStringArray<T>(array: string[], value: T): Record<string, T> {
  return array.reduce((acc, curr) => ((acc[curr] = value), acc), <Record<string, T>>{});
}

/**
 * Transform array of string dot-notation to object
 * ['foo.bar', 'foo.other', 'foo.bar.sub'] =>
 * {
 *  foo: {
 *    other: true,
 *    bar: {
 *      sub: true
 *    }
 *  }
 * }
 * @param array
 * @param initialObject
 * @param value
 * @returns
 */
export const dotNotation = (
  array: string[],
  initialValue: unknown = true,
  initialObject: unknown = {},
): unknown =>
  array.reduce((result, objectPath) => {
    const parts = objectPath.split('.');
    let target = result;

    while (parts.length > 1) {
      const part = parts.shift();
      target = target[part] = typeof target[part] === 'object' ? target[part] : {};
    }

    target[parts[0]] = initialValue;
    return result;
  }, initialObject);

/**
 * [description]
 * @param value
 */
export const csvParserCastJson = (value: string): any => {
  try {
    const json = JSON.parse(value);
    if (typeof json === 'object') return json;
  } catch {}

  return value;
};
