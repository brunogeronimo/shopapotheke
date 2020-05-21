import { isEmptyObject } from '../../../src/utils/isEmptyObject';

describe('isEmptyObject function', () => {
  it('Should return [true] if object is empty', () => {
    expect(isEmptyObject({})).toBeTruthy();
    // @ts-ignore
    expect(isEmptyObject(true)).toBeTruthy();
  });

  it('Should return [false] if object has value', () => {
    expect(isEmptyObject({a: 'b'})).toBeFalsy();
    // @ts-ignore
    expect(isEmptyObject(false)).toBeTruthy();
  });
});