import './style.css';
import {makeReadonlyStore, makeStore, ReadonlyStore} from 'universal-stores';
import {render} from 'solid-js/web';
import {createSignal, Show} from 'solid-js';
import {WithReadonlyStore, WithReadonlyStores, WithStore} from './lib';

export function start(): void {
	const appDiv = document.getElementById('app') as HTMLDivElement;

	const count$ = makeStore(0);

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

	function ReadonlyCounter(props: {count$: ReadonlyStore<number>}) {
		return (
			<WithReadonlyStore store={props.count$}>
				{(count) => <h1>Readonly counter: {count}</h1>}
			</WithReadonlyStore>
		);
	}

	function Sum() {
		return (
			<WithReadonlyStores stores={[count$, autoCount$]}>
				{([firstValue, secondValue]) => (
					<h1>Sum: {firstValue + secondValue}</h1>
				)}
			</WithReadonlyStores>
		);
	}

	function App() {
		const [mountAutoCount, setMountAutoCount] = createSignal(true);
		return (
			<>
				<Counter />
				<div style={{borderBottom: '1px solid gray', margin: '1rem 0'}} />
				<ReadonlyCounter count$={count$} />
				<div style={{borderBottom: '1px solid gray', margin: '1rem 0'}} />
				<Show when={mountAutoCount()}>
					<>
						<ReadonlyCounter count$={autoCount$} />
						<div style={{borderBottom: '1px solid gray', margin: '1rem 0'}} />
						<Sum />
					</>
				</Show>
				<button onClick={() => setMountAutoCount(!mountAutoCount())}>
					{mountAutoCount() ? 'unmount auto counter' : 'mount auto counter'}
				</button>
			</>
		);
	}

	render(() => <App />, appDiv);
}
