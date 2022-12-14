import {makeReadonlyStore, makeStore} from 'universal-stores';
import {useReadonlyStore, useReadonlyStores, useStore} from '../src/lib';
import {cleanup, render} from 'solid-testing-library';

describe('examples', () => {
	afterEach(cleanup);

	it('useReadonlyStore usage 1/2', () => {
		const count$ = makeStore(0);

		function Counter() {
			const count = useReadonlyStore(count$);
			return (
				<>
					<h1>{count()}</h1>
				</>
			);
		}

		render(() => <Counter />);

		expect(document.querySelector('h1')?.textContent).toBe('0');

		count$.update((c) => c + 1);

		expect(document.querySelector('h1')?.textContent).toBe('1');

		count$.update((c) => c - 1);
		count$.update((c) => c - 1);
		count$.update((c) => c - 1);

		expect(document.querySelector('h1')?.textContent).toBe('-2');

		count$.set(0);

		expect(document.querySelector('h1')?.textContent).toBe('0');
	});

	it('useReadonlyStore usage 2/2', () => {
		let intervalCb = () => undefined as void;
		function setIntervalMock(cb: () => void) {
			intervalCb = cb;
			return 0;
		}
		function clearIntervalMock(_id: number) {
			return;
		}
		// A lazy loaded readonly store that increments its value every second.
		const autoCount$ = makeReadonlyStore<number>(undefined, (set) => {
			let count = 0;
			set(count);
			const intervalId = setIntervalMock(() => {
				count++;
				set(count);
			});
			return () => clearIntervalMock(intervalId);
		});

		function Counter() {
			const count = useReadonlyStore(autoCount$);
			return (
				<>
					<h1>{count()}</h1>
				</>
			);
		}

		render(() => <Counter />);

		expect(document.querySelector('h1')?.textContent).toBe('0');

		intervalCb();

		expect(document.querySelector('h1')?.textContent).toBe('1');
	});

	it('useStore usage', () => {
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

		render(() => <Counter />);

		expect(document.querySelector('h1')?.textContent).toBe('0');

		document.querySelectorAll('button')[0].click();

		expect(document.querySelector('h1')?.textContent).toBe('1');

		document.querySelectorAll('button')[2].click();
		document.querySelectorAll('button')[2].click();
		document.querySelectorAll('button')[2].click();

		expect(document.querySelector('h1')?.textContent).toBe('-2');

		document.querySelectorAll('button')[1].click();

		expect(document.querySelector('h1')?.textContent).toBe('0');
	});

	it('useReadonlyStores usage 1/2', () => {
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

		const {unmount} = render(() => <Sum />);

		expect(document.querySelector('h1')?.textContent).toBe('6');

		firstNumber$.set(10);

		expect(document.querySelector('h1')?.textContent).toBe('12');

		secondNumber$.set(-10);

		expect(document.querySelector('h1')?.textContent).toBe('0');

		expect(firstNumber$.nOfSubscriptions()).toBe(1);
		expect(secondNumber$.nOfSubscriptions()).toBe(1);
		unmount();
		expect(firstNumber$.nOfSubscriptions()).toBe(0);
		expect(secondNumber$.nOfSubscriptions()).toBe(0);
	});

	it('useReadonlyStores usage 2/2', () => {
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

		const {unmount} = render(() => <Sum />);

		expect(document.querySelector('h1')?.textContent).toBe('6');

		firstNumber$.set(10);

		expect(document.querySelector('h1')?.textContent).toBe('12');

		secondNumber$.set(-10);

		expect(document.querySelector('h1')?.textContent).toBe('0');

		expect(firstNumber$.nOfSubscriptions()).toBe(1);
		expect(secondNumber$.nOfSubscriptions()).toBe(1);
		unmount();
		expect(firstNumber$.nOfSubscriptions()).toBe(0);
		expect(secondNumber$.nOfSubscriptions()).toBe(0);
	});
});
