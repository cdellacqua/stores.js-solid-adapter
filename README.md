# @universal-stores/solid-adapter

A library that provides Solid Hooks and Components for [universal-stores](https://www.npmjs.com/package/universal-stores) (observable containers of values).

[NPM Package](https://www.npmjs.com/package/@universal-stores/solid-adapter)

`npm install universal-stores @universal-stores/solid-adapter`

(note that you also need `universal-stores`, as that's a peer dependency of this package).

[Documentation](./docs/README.md)

## Hooks

### useStore

`useStore` is designed after `createSignal`. By calling this hook you'll get a tuple where
the first element is the current value contained in the store and the second element
is a setter/updater.

As you can see in the following example, the setter accepts both a new value and
an update function.

```tsx
import {makeStore} from 'universal-stores';
import {useStore} from '@universal-stores/solid-adapter';

const count$ = makeStore(0);

function MyComponent() {
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

### useReadonlyStore

`useReadonlyStore` returns the value of a store. It can be used with
both `ReadonlyStore`s and `Store`s.

```tsx
import {makeStore} from 'universal-stores';
import {useReadonlyStore} from '@universal-stores/solid-adapter';

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

```tsx
import {makeReadonlyStore} from 'universal-stores';
import {useReadonlyStore} from '@universal-stores/solid-adapter';

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

### useReadonlyStores

`useReadonlyStores` can be used to observe multiple stores at once.
It takes an object or an array of `ReadonlyStore`s and/or `Store`s and returns an object or array of accessors to the values contained in them.

Example using an object:

```tsx
import {makeStore} from 'universal-stores';
import {useReadonlyStores} from '@universal-stores/solid-adapter';

const firstNumber$ = makeStore(4);
const secondNumber$ = makeStore(2);

function Sum() {
	const {first, second} = useReadonlyStores({
		first: firstNumber$,
		second: secondNumber$,
	});
	return (
		<>
			<h1>{first() + second()}</h1>
		</>
	);
}
```

Example using an array:

```tsx
import {makeStore} from 'universal-stores';
import {useReadonlyStores} from '@universal-stores/solid-adapter';

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

## Components

If you only need the value of a store in a specific section of your JSX, you
can use the following specialized component.

### WithStore

Similar to `useStore`, it takes a `Store<T>` and a render prop as its children:

```tsx
import {makeStore} from 'universal-stores';
import {WithStore} from '@universal-stores/solid-adapter';

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

### WithReadonlyStore

Similar to `useReadonlyStore`, it takes a `ReadonlyStore<T>` (or a `Store<T>`) and a render prop as its children:

```tsx
import {makeStore} from 'universal-stores';
import {WithReadonlyStore} from '@universal-stores/solid-adapter';

const count$ = makeStore(0);

function Counter() {
	return (
		<WithReadonlyStore store={count$}>
			{(count) => <h1>{count}</h1>}
		</WithReadonlyStore>
	);
}
```

### WithReadonlyStores

Similar to `useReadonlyStores`, it takes a collection of `ReadonlyStore<T>`/`Store<T>` and a render prop as its children.

Example using an object:

```tsx
import {makeStore} from 'universal-stores';
import {WithReadonlyStores} from '@universal-stores/solid-adapter';

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
import {makeStore} from 'universal-stores';
import {WithReadonlyStores} from '@universal-stores/solid-adapter';

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
