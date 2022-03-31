import { jest } from '@jest/globals'

import { ResolvablePromise } from '../index.js';

test('exists', () => {
  expect(ResolvablePromise).toBeDefined
})

describe('Resolvable', () => {
  test('should be instantiable as a class', () => {
    expect(new ResolvablePromise()).toBeDefined
  });

  test('should be not instantiable as a function', () => {
    const makeResolvable = ResolvablePromise;
    expect(() => makeResolvable()).toThrow
  });

  // Should it?
  // test('should be an instance of Promise', () => {
  //   expect(new ResolvablePromise()).toBeInstanceOf(Promise)
  // });

  test('should resolve when called with external resolve function', async () => {
    let externalResolveCalled = false;
    const resolvable = new ResolvablePromise();

    setTimeout(() => {
      externalResolveCalled = true;
      resolvable.resolve(42);
    }, 1);

    await resolvable;
    expect(externalResolveCalled).toBe(true)
    await expect(resolvable).resolves.toBe(42)
  });

  test('should reject when called with external reject function', async () => {
    const resolvable = new ResolvablePromise();

    setTimeout(() => {
      resolvable.reject(Error());
    }, 1);

    await expect(resolvable).rejects.toBeInstanceOf(Error)
  });

  test('should behave as parent promise when given a promise as constructor argument', async () => {
    const resolvingResolvable = new ResolvablePromise(Promise.resolve(42));
    await expect(resolvingResolvable).resolves.toBe(42)

    const rejectingResolvable = new ResolvablePromise(Promise.reject(Error()));
    await expect(rejectingResolvable).rejects.toBeInstanceOf(Error)
  });

  test('should behave as promise if given promise executor function as constructor argument', async () => {
    const resolvingResolvable = new ResolvablePromise((resolve) => setTimeout(() => resolve(42), 1));
    await expect(resolvingResolvable).resolves.toBe(42);

    const rejectingResolvable = new ResolvablePromise((_r, reject) => setTimeout(() => reject(Error())))
    await expect(rejectingResolvable).rejects.toBeInstanceOf(Error)
  });

  test('should have a settled property', async () => {
    const resolvingResolvable = new ResolvablePromise((resolve) => setTimeout(() => resolve(42), 1));
    expect(resolvingResolvable.settled).toBe(false)
    await resolvingResolvable;
    expect(resolvingResolvable.settled).toBe(true)

    const rejectingResolvable = new ResolvablePromise((_r, reject) => setTimeout(() => reject(Error())))
    expect(rejectingResolvable.settled).toBe(false)
    await rejectingResolvable.catch(() => {});
    expect(rejectingResolvable.settled).toBe(true)
  });

  test('should resolved to the original value', async () => {
    const p = new ResolvablePromise(Promise.resolve(42));
    await p
    expect(() => p.resolve(43)).not.toThrow() // should it throw? warning instead?
    await expect(p).resolves.toBe(42);
  })

  test('should resolved to the original value 2', async () => {
    const p = new ResolvablePromise(Promise.resolve(42));
    await p
    expect(() => p.reject(Error())).not.toThrow() // should it throw? warning instead?
    await expect(p).resolves.toBe(42);
  })

});