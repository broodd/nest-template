import { plainToInstance, Transform } from 'class-transformer';

import { UnsupportedMediaTypeException, PayloadTooLargeException, Type } from '@nestjs/common';

import { MultipartBodyFile } from 'src/multipart/interfaces';
import { ConfigService } from 'src/config';

import { FileEntity } from 'src/modules/files/entities';

import { ErrorTypeEnum } from '../enums';

/**
 * Decorator in dto for transform from multipart boolean
 * @param classRef
 */
export function TransformAsJson(): PropertyDecorator {
  return Transform(({ key, obj }) => {
    try {
      return JSON.parse(obj[key]);
    } catch {
      return obj[key];
    }
  });
}

/**
 * Decorator in dto for transform from multipart json to instance
 * @param classRef
 */
export function TransformJsonTo<T>(classRef: Type<T>): PropertyDecorator {
  return Transform(({ value }) => {
    try {
      return plainToInstance(classRef, JSON.parse(value));
    } catch {
      return value;
    }
  });
}

const allowedTypes: string[] = new ConfigService().get('STORE_MIME_TYPE');
/**
 * [description]
 */
export function TransformValidateFile(): PropertyDecorator {
  return Transform(({ value }: { value: MultipartBodyFile[] }) => {
    let file;
    try {
      [file] = value.filter((file) => file.data?.length || file.limit);

      if (file.limit) throw new PayloadTooLargeException(ErrorTypeEnum.FILE_TOO_LARGE);

      if (!allowedTypes.includes(file.mimetype))
        throw new UnsupportedMediaTypeException(ErrorTypeEnum.FILE_UNSUPPORTED_TYPE);

      return file;
    } catch {
      return null;
    }
  });
}

/**
 * [description]
 */
export function TransformValidateFiles(): PropertyDecorator {
  return Transform(({ value }: { value: MultipartBodyFile[] }) => {
    let files;
    try {
      const valueArray = [].concat(value).map((file) => {
        try {
          if (file.mimetype === 'application/json') {
            return plainToInstance(FileEntity, JSON.parse(file.data.toString()));
          }

          if (file.data?.length || file.limit) return file;

          return plainToInstance(FileEntity, JSON.parse(file));
        } catch {
          return null;
        }
      });
      files = valueArray.filter(Boolean);

      const newFiles = files.filter((file) => !file.id);
      const isTooLarge = newFiles.some((file) => file.limit);
      if (isTooLarge) throw new PayloadTooLargeException(ErrorTypeEnum.FILE_TOO_LARGE);

      const isInvalidType = newFiles.some((file) => !allowedTypes.includes(file.mimetype));
      if (isInvalidType)
        throw new UnsupportedMediaTypeException(ErrorTypeEnum.FILE_UNSUPPORTED_TYPE);

      return files;
    } catch {
      return [];
    }
  });
}

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
 * ['title', 'foo.bar', 'foo.other', 'foo.bar.sub.deep'] =>
 * {
 *  title: true,
 *  foo: {
 *    other: true,
 *    bar: {
 *      sub: {
 *        deep: true
 *      }
 *    }
 *  }
 * }
 * @param array
 * @param initialValue
 * @param initialObject
 */
export const stringArrayToNestedObject = (
  array: string[],
  initialValue: true | string | number = true,
  initialObject: any = {},
): Record<string, any> => {
  const result = initialObject;

  array.forEach((path) => {
    const keys = path.split('.');
    let current = result;

    keys.forEach((key, index) => {
      const isOnlyOneKey = keys.length === 1;
      const isMiddleKey = index >= 0 && index < keys.length - 1;
      const isLastKey = index === keys.length - 1;

      if (isOnlyOneKey) {
        if (current[key] === undefined) {
          current[key] = initialValue;
        }
        return;
      }

      if (isMiddleKey && typeof current[key] !== 'object') {
        current[key] = {};
        current = current[key];
        return;
      }

      if (current[key] === undefined) {
        current[key] = isLastKey ? initialValue : {};
      }

      current = current[key];
    });
  });

  return result;
};

/**
 * [description]
 * @param object
 * @param callback
 */
export const iterateAllKeysInNestedObject = (
  object: Record<string, any>,
  callback: (path: string) => void,
): void => {
  const recursiveIterate = (obj, path = '') => {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;

      /**
       * For skip keys, what not need to iterate
       * useful for not join some *private* relations
       */
      if (obj[key] === false) continue;
      if (obj[key]?._skip_exclude === true) recursiveIterate(obj[key], currentPath);

      if (typeof obj[key] === 'object') {
        callback(currentPath);
        recursiveIterate(obj[key], currentPath);
      } else {
        callback(currentPath);
      }
    }
  };

  recursiveIterate(object);
};

/**
 * Transform object by dots in keys to nested object
 * @param obj
 * @returns
 */
export const toNestedBySeparator = (
  obj: Record<string, any>,
  separator: string = '.',
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(separator);
    let current = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        current[part] = value;
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    }
  }

  return result;
};
