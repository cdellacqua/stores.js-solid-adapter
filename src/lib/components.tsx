import {JSX} from 'solid-js/jsx-runtime';
import {ReadonlyStore, Store, Updater} from 'universal-stores';
import {useReadonlyStore, useReadonlyStores, useStore} from './hooks';

export type WithStoreProps<T> = {
	store: Store<T>;
	children: (
		value: T,
		setValue: (newValueOrUpdater: T | Updater<T>) => void,
	) => JSX.Element;
};

/**
 * Subscribe to a Store and pass its value and setter function
 * to the children of this component.
 *
 * Example
 * ```tsx
 * const count$ = makeStore(0);
 *
 * function Counter() {
 * 	return (
 * 		<WithStore store={count$}>
 * 			{(count, setCount) => (
 * 				<>
 * 					<h1>Counter: {count}</h1>
 * 					<button onClick={() => setCount((c) => c + 1)}>Increment</button>
 * 					<button onClick={() => setCount(0)}>Reset</button>
 * 					<button onClick={() => setCount((c) => c - 1)}>Decrement</button>
 * 				</>
 * 			)}
 * 		</WithStore>
 * 	);
 * }
 * ```
 *
 * @param props.store a store to subscribe to.
 * @param props.children a render prop that takes the store value and setter as parameters.
 * @returns {JSX.Element}
 */
export function WithStore<T>(props: WithStoreProps<T>): JSX.Element {
	const [value, setValue] = useStore(() => props.store);
	return <>{props.children(value(), setValue)}</>;
}

export type WithReadonlyStoreProps<T> = {
	store: ReadonlyStore<T>;
	children: (value: T) => JSX.Element;
};

/**
 * Subscribe to a Store or ReadonlyStore and pass its value
 * to the children of this component.
 * ```tsx
 * const count$ = makeStore(0);
 *
 * function Counter() {
 * 	return (
 * 		<WithReadonlyStore store={count$}>
 * 			{(count) => <h1>{count}</h1>}
 * 		</WithReadonlyStore>
 * 	);
 * }
 * ```
 *
 * @param props.store a store to subscribe to.
 * @param props.children a render prop that takes the store value as its parameter.
 * @returns {JSX.Element}
 */
export function WithReadonlyStore<T>(
	props: WithReadonlyStoreProps<T>,
): JSX.Element {
	const value = useReadonlyStore(() => props.store);
	return <>{props.children(value())}</>;
}

export type WithReadonlyStoresProps<T extends [unknown, ...unknown[]]> = {
	stores: {
		[P in keyof T]: ReadonlyStore<T[P]>;
	};
	children: (values: {
		[P in keyof T]: T[P];
	}) => JSX.Element;
};

/**
 * Subscribe to a one or more Store/ReadonlyStore and pass their values
 * to the children of this component.
 *
 * Example:
 * ```tsx
 * const firstNumber$ = makeStore(4);
 * const secondNumber$ = makeStore(2);
 *
 * function Sum() {
 * 	return (
 * 		<WithReadonlyStores stores={[firstNumber$, secondNumber$]}>
 * 			{([firstNumber, secondNumber]) => <h1>{firstNumber + secondNumber}</h1>}
 * 		</WithReadonlyStores>
 * 	);
 * }
 * ```
 *
 * @param props.stores a collection of Store and/or ReadonlyStore.
 * @param props.children a render prop that takes an array of all the values contained in the stores as its parameter.
 * @returns {JSX.Element}
 */
export function WithReadonlyStores<T extends [unknown, ...unknown[]]>(
	props: WithReadonlyStoresProps<T>,
): JSX.Element {
	const values = useReadonlyStores<T>(() => props.stores);
	return <>{props.children(values())}</>;
}
