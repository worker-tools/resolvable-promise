import 'https://gist.githubusercontent.com/qwtel/b14f0f81e3a96189f7771f83ee113f64/raw/TestRequest.ts'
import {
  assert,
  assertExists,
  assertEquals,
  assertStrictEquals,
  assertStringIncludes,
  assertThrows,
  assertRejects,
} from 'https://deno.land/std@0.133.0/testing/asserts.ts'
const { test } = Deno;

import { ResolvablePromise } from '../index.ts';

test('exists', () => {
  assertExists(ResolvablePromise)
})

// describe('Resolvable', () => {
test('should be instantiable as a class', () => {
  assertExists(new ResolvablePromise())
});

test('should not be instantiable as a function', () => {
  const makeResolvable = ResolvablePromise;
  // @ts-ignore: relax, just for testing
  assertThrows(() => makeResolvable())
});

// // Should it?
// // test('should be an instance of Promise', () => {
// //   expect(new ResolvablePromise()).toBeInstanceOf(Promise)
// // });

test('should resolve when called with external resolve function', async () => {
  let externalResolveCalled = false;
  const resolvable = new ResolvablePromise();

  setTimeout(() => {
    externalResolveCalled = true;
    resolvable.resolve(42);
  }, 1);

  await resolvable;
  assert(externalResolveCalled)
  assertEquals(await resolvable, 42)
});

test('should reject when called with external reject function', async () => {
  const resolvable = new ResolvablePromise();

  setTimeout(() => {
    resolvable.reject(Error());
  }, 1);

  await assertRejects(() => resolvable, Error)
});

test('should behave as parent promise when given a promise as constructor argument', async () => {
  const resolvingResolvable = new ResolvablePromise(Promise.resolve(42));
  assertEquals(await resolvingResolvable, 42)

  const rejectingResolvable = new ResolvablePromise(Promise.reject(Error()));
  await assertRejects(() => rejectingResolvable, Error)
});

test('should behave as promise if given promise executor function as constructor argument', async () => {
  const resolvingResolvable = new ResolvablePromise((resolve) => setTimeout(() => resolve(42), 1));
  assertEquals(await resolvingResolvable, 42)

  const rejectingResolvable = new ResolvablePromise((_r, reject) => setTimeout(() => reject(Error())))
  await assertRejects(() => rejectingResolvable, Error)
});

test('should have a settled property', async () => {
  const resolvingResolvable = new ResolvablePromise((resolve) => setTimeout(() => resolve(42), 1));
  assertEquals(resolvingResolvable.settled, false)
  await resolvingResolvable;
  assertEquals(resolvingResolvable.settled, true)

  const rejectingResolvable = new ResolvablePromise((_r, reject) => setTimeout(() => reject(Error())))
  assertEquals(rejectingResolvable.settled, false)
  await rejectingResolvable.catch(() => { });
  assertEquals(rejectingResolvable.settled, true)
});

test('should resolved to the original value', async () => {
  const p = new ResolvablePromise(Promise.resolve(42));
  await p
  assertEquals(p.resolve(43), undefined)
  assertEquals(await p, 42);
})

test('should resolved to the original value 2', async () => {
  const p = new ResolvablePromise(Promise.resolve(42));
  await p
  assertEquals(p.reject(Error()), undefined)
  assertEquals(await p, 42);
})
