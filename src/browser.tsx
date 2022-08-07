import './style.css';
import {useReadonlyStore, useStore} from './lib';
import {makeReadonlyStore, makeStore, ReadonlyStore} from 'universal-stores';
import {render} from 'solid-js/web';
import {createSignal, Show} from 'solid-js';

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
	const [count, setCount] = useStore(count$);
	return (
		<>
			<h1>Counter: {count()}</h1>
			<button onClick={() => setCount((c) => c + 1)}>Increment</button>
			<button onClick={() => setCount(0)}>Reset</button>
			<button onClick={() => setCount((c) => c - 1)}>Decrement</button>
		</>
	);
}

function ReadonlyCounter(props: {count$: ReadonlyStore<number>}) {
	const count = useReadonlyStore(props.count$);
	return (
		<>
			<h1>Readonly counter: {count()}</h1>
		</>
	);
}

function App() {
	const [mountAutoCount, setMountAutoCount] = createSignal(true);
	return (
		<>
			<Counter />
			<div style="border-bottom: 1px solid gray; margin: 1rem 0" />
			<ReadonlyCounter count$={count$} />
			<div style="border-bottom: 1px solid gray; margin: 1rem 0" />
			<Show when={mountAutoCount()}>
				<ReadonlyCounter count$={autoCount$} />
			</Show>
			<button onClick={() => setMountAutoCount(!mountAutoCount())}>
				{mountAutoCount() ? 'unmount auto counter' : 'mount auto counter'}
			</button>
		</>
	);
}

render(() => <App />, appDiv);
