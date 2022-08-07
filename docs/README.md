@universal-stores/solid-adapter

# @universal-stores/solid-adapter

## Table of contents

### Functions

- [useReadonlyStore](README.md#usereadonlystore)
- [useStore](README.md#usestore)

## Functions

### useReadonlyStore

▸ **useReadonlyStore**<`T`\>(`store`): `Accessor`<`T`\>

Subscribe to a store, providing an accessor to get the value.

Example:

```tsx
const count$ = makeStore(0);

function Counter() {
	const count = useReadonlyStore(count$);
	return (
		<>
			<h1>{count()}</h1>
		</>
	);
}
```

Example with a ReadonlyStore:

```tsx
// A lazy loaded readonly store that increments its value every second.
const autoCount$ = makeReadonlyStore<number>(undefined, (set) => {
	let count = 0;
	set(count);
	const intervalId = setInterval(() => {
		count++;
		set(count);
	}, 1000);
	return () => clearInterval(intervalId);
});

function Counter() {
	const count = useReadonlyStore(autoCount$);
	return (
		<>
			<h1>{count()}</h1>
		</>
	);
}
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `store` | `ReadonlyStore`<`T`\> \| `Accessor`<`ReadonlyStore`<`T`\>\> | a store (ReadonlyStore<T> or Store<T>) to subscribe to. Note: if you want this hook be reactive (e.g. if the store comes from a prop or signal), you should pass an accessor to it instead of the store itself. |

#### Returns

`Accessor`<`T`\>

an accessor to the store value.

#### Defined in

[hooks.ts:51](https://github.com/cdellacqua/stores.js-solid-adapter/blob/main/src/lib/hooks.ts#L51)

___

### useStore

▸ **useStore**<`T`\>(`store`): [`Accessor`<`T`\>, (`newValueOrUpdater`: `T` \| `Updater`<`T`\>) => `void`]

Subscribe to a store, providing an accessor to its value
and a setter function.

Example:
```tsx
const count$ = makeStore(0);

function Counter() {
	const [count, setCount] = useStore(count$);
	return (
		<>
			<h1>{count()}</h1>
			<button onClick={() => setCount((c) => c + 1)}>Increment</button>
			<button onClick={() => setCount(0)}>Reset</button>
			<button onClick={() => setCount((c) => c - 1)}>Decrement</button>
		</>
	);
}
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `store` | `Store`<`T`\> \| `Accessor`<`Store`<`T`\>\> | a store to subscribe to. Note: if you want this hook be reactive (e.g. if the store comes from a prop or signal), you should pass an accessor to it instead of the store itself. |

#### Returns

[`Accessor`<`T`\>, (`newValueOrUpdater`: `T` \| `Updater`<`T`\>) => `void`]

a tuple containing the accessor to the store value and a setter.

#### Defined in

[hooks.ts:97](https://github.com/cdellacqua/stores.js-solid-adapter/blob/main/src/lib/hooks.ts#L97)
