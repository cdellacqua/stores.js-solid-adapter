@universal-stores/solid-adapter

# @universal-stores/solid-adapter

## Table of contents

### Type Aliases

- [WithReadonlyStoreProps](README.md#withreadonlystoreprops)
- [WithReadonlyStoresProps](README.md#withreadonlystoresprops)
- [WithStoreProps](README.md#withstoreprops)

### Functions

- [WithReadonlyStore](README.md#withreadonlystore)
- [WithReadonlyStores](README.md#withreadonlystores)
- [WithStore](README.md#withstore)
- [useReadonlyStore](README.md#usereadonlystore)
- [useReadonlyStores](README.md#usereadonlystores)
- [useStore](README.md#usestore)

## Type Aliases

### WithReadonlyStoreProps

Ƭ **WithReadonlyStoreProps**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children` | (`value`: `T`) => `JSX.Element` |
| `store` | `ReadonlyStore`<`T`\> |

#### Defined in

[components.tsx:47](https://github.com/cdellacqua/stores.js-solid-adapter/blob/main/src/lib/components.tsx#L47)

___

### WithReadonlyStoresProps

Ƭ **WithReadonlyStoresProps**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children` | (`values`: { [P in keyof T]: T[P] }) => `JSX.Element` |
| `stores` | { [P in keyof T]: ReadonlyStore<T[P]\> } |

#### Defined in

[components.tsx:78](https://github.com/cdellacqua/stores.js-solid-adapter/blob/main/src/lib/components.tsx#L78)

___

### WithStoreProps

Ƭ **WithStoreProps**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children` | (`value`: `T`, `setValue`: (`newValueOrUpdater`: `T` \| `Updater`<`T`\>) => `void`) => `JSX.Element` |
| `store` | `Store`<`T`\> |

#### Defined in

[components.tsx:6](https://github.com/cdellacqua/stores.js-solid-adapter/blob/main/src/lib/components.tsx#L6)

## Functions

### WithReadonlyStore

▸ **WithReadonlyStore**<`T`\>(`props`): `JSX.Element`

Subscribe to a Store or ReadonlyStore and pass its value
to the children of this component.
```tsx
const count$ = makeStore(0);

function Counter() {
	return (
		<WithReadonlyStore store={count$}>
			{(count) => <h1>{count}</h1>}
		</WithReadonlyStore>
	);
}
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`WithReadonlyStoreProps`](README.md#withreadonlystoreprops)<`T`\> |

#### Returns

`JSX.Element`

#### Defined in

[components.tsx:71](https://github.com/cdellacqua/stores.js-solid-adapter/blob/main/src/lib/components.tsx#L71)

___

### WithReadonlyStores

▸ **WithReadonlyStores**<`T`\>(`props`): `JSX.Element`

Subscribe to multiple stores and pass their values
to the children of this component.

Example using an object:

```tsx
const firstNumber$ = makeStore(4);
const secondNumber$ = makeStore(2);

function Sum() {
	return (
		<WithReadonlyStores stores={{first: firstNumber$, second: secondNumber$}}>
			{({first, second}) => <h1>{first + second}</h1>}
		</WithReadonlyStores>
	);
}
```

Example using an array:

```tsx
const firstNumber$ = makeStore(4);
const secondNumber$ = makeStore(2);

function Sum() {
	return (
		<WithReadonlyStores stores={[firstNumber$, secondNumber$]}>
			{([firstNumber, secondNumber]) => <h1>{firstNumber + secondNumber}</h1>}
		</WithReadonlyStores>
	);
}
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`WithReadonlyStoresProps`](README.md#withreadonlystoresprops)<`T`\> |

#### Returns

`JSX.Element`

#### Defined in

[components.tsx:125](https://github.com/cdellacqua/stores.js-solid-adapter/blob/main/src/lib/components.tsx#L125)

___

### WithStore

▸ **WithStore**<`T`\>(`props`): `JSX.Element`

Subscribe to a Store and pass its value and setter function
to the children of this component.

Example
```tsx
const count$ = makeStore(0);

function Counter() {
	return (
		<WithStore store={count$}>
			{(count, setCount) => (
				<>
					<h1>Counter: {count}</h1>
					<button onClick={() => setCount((c) => c + 1)}>Increment</button>
					<button onClick={() => setCount(0)}>Reset</button>
					<button onClick={() => setCount((c) => c - 1)}>Decrement</button>
				</>
			)}
		</WithStore>
	);
}
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`WithStoreProps`](README.md#withstoreprops)<`T`\> |

#### Returns

`JSX.Element`

#### Defined in

[components.tsx:42](https://github.com/cdellacqua/stores.js-solid-adapter/blob/main/src/lib/components.tsx#L42)

___

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

[hooks.ts:57](https://github.com/cdellacqua/stores.js-solid-adapter/blob/main/src/lib/hooks.ts#L57)

___

### useReadonlyStores

▸ **useReadonlyStores**<`T`\>(`stores`): { [P in keyof T]: Accessor<T[P]\> }

Subscribe to multiple stores, providing an accessor to an object or an array of all their values.

Example using an object:

```tsx
const firstNumber$ = makeStore(4);
const secondNumber$ = makeStore(2);

function Sum() {
	const {first, second} = useReadonlyStores({first: firstNumber$, second: secondNumber$});
	return (
		<>
			<h1>{first() + second()}</h1>
		</>
	);
}
```

Example using an array:

```tsx
const firstNumber$ = makeStore(4);
const secondNumber$ = makeStore(2);

function Sum() {
	const [first, second] = useReadonlyStores([firstNumber$, secondNumber$]);
	return (
		<>
			<h1>{first() + second()}</h1>
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
| `stores` | { [P in string \| number \| symbol]: ReadonlyStore<T[P]\> } \| `Accessor`<{ [P in string \| number \| symbol]: ReadonlyStore<T[P]\> }\> | an object or an array of stores to subscribe to. |

#### Returns

{ [P in keyof T]: Accessor<T[P]\> }

an accessor to all the values contained in the stores.

#### Defined in

[hooks.ts:115](https://github.com/cdellacqua/stores.js-solid-adapter/blob/main/src/lib/hooks.ts#L115)

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

[hooks.ts:174](https://github.com/cdellacqua/stores.js-solid-adapter/blob/main/src/lib/hooks.ts#L174)
