# Resolvable Promise

A promise that is resolvable (or rejectable) after it was created.

```ts
const promise = new ResolvablePromise()
promise.then(x => console.log('Resolved!', x))
promise.resolve({ foo: 'bar' })
```
