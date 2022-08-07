import {Accessor, createComputed, createSignal, onCleanup} from 'solid-js';
import {ReadonlyStore, Store, Unsubscribe, Updater} from 'universal-stores';

/**
 * Subscribe to a store, providing an accessor to get the value.
 *
 * Example:
 *
 * ```tsx
 * const count$ = makeStore(0);
 *
 * function Counter() {
 * 	const count = useReadonlyStore(count$);
 * 	return (
 * 		<>
 * 			<h1>{count()}</h1>
 * 		</>
 * 	);
 * }
 * ```
 *
 * Example with a ReadonlyStore:
 *
 * ```tsx
 * // A lazy loaded readonly store that increments its value every second.
 * const autoCount$ = makeReadonlyStore<number>(undefined, (set) => {
 * 	let count = 0;
 * 	set(count);
 * 	const intervalId = setInterval(() => {
 * 		count++;
 * 		set(count);
 * 	}, 1000);
 * 	return () => clearInterval(intervalId);
 * });
 *
 * function Counter() {
 * 	const count = useReadonlyStore(autoCount$);
 * 	return (
 * 		<>
 * 			<h1>{count()}</h1>
 * 		</>
 * 	);
 * }
 * ```
 *
 * @param store a store (ReadonlyStore<T> or Store<T>) to subscribe to. Note: if you want this
 * hook be reactive (e.g. if the store comes from a prop or signal), you should pass an accessor
 * to it instead of the store itself.
 * @returns an accessor to the store value.
 */
export function useReadonlyStore<T>(
	store: ReadonlyStore<T> | Accessor<ReadonlyStore<T>>,
): Accessor<T> {
	const [value, setValue] = createSignal(undefined as unknown as T, {
		equals: false,
	});
	const accessor = typeof store === 'function' ? store : () => store;
	let unsubscribe: Unsubscribe | undefined;
	createComputed(() => {
		unsubscribe?.();
		unsubscribe = accessor().subscribe((content) => {
			setValue(() => content);
		});
	});
	onCleanup(() => {
		unsubscribe?.();
	});
	return value;
}

/**
 * Subscribe to a store, providing an accessor to its value
 * and a setter function.
 *
 * Example:
 * ```tsx
 * const count$ = makeStore(0);
 *
 * function Counter() {
 * 	const [count, setCount] = useStore(count$);
 * 	return (
 * 		<>
 * 			<h1>{count()}</h1>
 * 			<button onClick={() => setCount((c) => c + 1)}>Increment</button>
 * 			<button onClick={() => setCount(0)}>Reset</button>
 * 			<button onClick={() => setCount((c) => c - 1)}>Decrement</button>
 * 		</>
 * 	);
 * }
 * ```
 *
 * @param store a store to subscribe to. Note: if you want this
 * hook be reactive (e.g. if the store comes from a prop or signal), you should pass an accessor
 * to it instead of the store itself.
 * @returns a tuple containing the accessor to the store value and a setter.
 */
export function useStore<T>(
	store: Store<T> | Accessor<Store<T>>,
): [Accessor<T>, (newValueOrUpdater: T | Updater<T>) => void] {
	const value = useReadonlyStore(store);
	const accessor = typeof store === 'function' ? store : () => store;
	const setter = (newValueOrUpdater: T | Updater<T>) => {
		if (typeof newValueOrUpdater === 'function') {
			accessor().update(newValueOrUpdater as Updater<T>);
		} else {
			accessor().set(newValueOrUpdater as T);
		}
	};
	return [value, setter];
}
