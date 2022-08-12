import {makeStore, ReadonlyStore} from 'universal-stores';
import {WithReadonlyStore, WithReadonlyStores, WithStore} from '../src/lib';
import {cleanup, fireEvent, render, screen} from 'solid-testing-library';
import {createSignal} from 'solid-js';

describe('components', () => {
	afterEach(cleanup);

	it('WithStore', async () => {
		const count$ = makeStore(4);

		function Counter() {
			return (
				<WithStore store={count$}>
					{(count, setCount) => {
						return (
							<>
								<h1>{count}</h1>
								<button title="trigger" onClick={() => setCount(2)}>
									click
								</button>
							</>
						);
					}}
				</WithStore>
			);
		}
		render(() => <Counter />);
		expect(document.querySelector('h1')?.textContent).toBe('4');
		count$.set(10);
		expect(document.querySelector('h1')?.textContent).toBe('10');

		const btn = await screen.findByTitle('trigger');
		fireEvent.click(btn);

		expect(document.querySelector('h1')?.textContent).toBe('2');
	});

	it('WithReadonlyStore', () => {
		const count$ = makeStore(4);

		function Counter() {
			return (
				<WithReadonlyStore store={count$}>
					{(count) => {
						return <h1>{count}</h1>;
					}}
				</WithReadonlyStore>
			);
		}
		render(() => <Counter />);
		expect(document.querySelector('h1')?.textContent).toBe('4');
		count$.set(10);
		expect(document.querySelector('h1')?.textContent).toBe('10');
	});
	it('WithReadonlyStores using an array', () => {
		const firstNumber$ = makeStore(4);
		const secondNumber$ = makeStore(2);

		function Sum() {
			return (
				<WithReadonlyStores stores={[firstNumber$, secondNumber$]}>
					{([firstNumber, secondNumber]) => {
						return <h1>{firstNumber + secondNumber}</h1>;
					}}
				</WithReadonlyStores>
			);
		}
		render(() => <Sum />);
		expect(document.querySelector('h1')?.textContent).toBe('6');
		firstNumber$.set(10);
		expect(document.querySelector('h1')?.textContent).toBe('12');
		secondNumber$.update(() => -10);
		expect(document.querySelector('h1')?.textContent).toBe('0');
	});

	it('WithReadonlyStores using an object', () => {
		const firstNumber$ = makeStore(4);
		const secondNumber$ = makeStore(2);

		function Sum() {
			return (
				<WithReadonlyStores
					stores={{first: firstNumber$, second: secondNumber$}}
				>
					{({first, second}) => {
						return <h1>{first + second}</h1>;
					}}
				</WithReadonlyStores>
			);
		}
		render(() => <Sum />);
		expect(document.querySelector('h1')?.textContent).toBe('6');
		firstNumber$.set(10);
		expect(document.querySelector('h1')?.textContent).toBe('12');
		secondNumber$.update(() => -10);
		expect(document.querySelector('h1')?.textContent).toBe('0');
	});

	it('WithReadonlyStores: tests that the output changes when the stores are rearranged', async () => {
		const firstNumber$ = makeStore(4);
		const secondNumber$ = makeStore(2);

		function Sub() {
			const [stores, setStores] = createSignal<
				[ReadonlyStore<number>, ReadonlyStore<number>]
			>([firstNumber$, secondNumber$]);
			return (
				<>
					<button
						title="trigger"
						onClick={() => setStores([secondNumber$, firstNumber$])}
					>
						click
					</button>
					<WithReadonlyStores stores={stores()}>
						{([firstNumber, secondNumber]) => {
							return <h1>{firstNumber - secondNumber}</h1>;
						}}
					</WithReadonlyStores>
				</>
			);
		}
		render(() => <Sub />);
		expect(document.querySelector('h1')?.textContent).toBe('2');

		const btn = await screen.findByTitle('trigger');
		fireEvent.click(btn);

		expect(document.querySelector('h1')?.textContent).toBe('-2');
		firstNumber$.set(10);
		expect(document.querySelector('h1')?.textContent).toBe('-8');
	});
});
