import { dotNotation, toNumArrayByComa, toObjectFromStringArray } from './transform.helper';

describe('TransformHelper', () => {
  describe('toNumArrayByComa', () => {
    it('should be return number array', () => {
      const received = toNumArrayByComa('1,2,3,4');
      expect(received).toEqual([1, 2, 3, 4]);
    });

    it('should be return number array event with spaces', () => {
      const received = toNumArrayByComa('1, 2,   3,    4');
      expect(received).toEqual([1, 2, 3, 4]);
    });

    it('should be return number array of floats', () => {
      const received = toNumArrayByComa('1.123, 2.43434, 3.233, 4.123');
      expect(received).toEqual([1.123, 2.43434, 3.233, 4.123]);
    });

    it('should be return number array of string array', () => {
      const received = toNumArrayByComa(['1.123', '2.43434', '3.233', '4.123']);
      expect(received).toEqual([1.123, 2.43434, 3.233, 4.123]);
    });
  });

  describe('toObjectFromStringArray', () => {
    it('should be return object', () => {
      const received = toObjectFromStringArray(['id', 'name', 'email'], true);
      expect(received).toMatchObject({ id: true, name: true, email: true });
    });
  });

  describe('dotNotation', () => {
    it('should be return object', () => {
      const received = dotNotation(['foo.bar', 'foo.other', 'foo.bar.sub'], true);
      expect(received).toMatchObject({
        foo: {
          other: true,
          bar: {
            sub: true,
          },
        },
      });
    });
  });
});
