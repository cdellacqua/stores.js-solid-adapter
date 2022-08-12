import {makeReadonlyStore, makeStore, ReadonlyStore} from 'universal-stores';
import {useReadonlyStores} from '../src/lib';
import {cleanup, fireEvent, render, screen} from 'solid-testing-library';
import {Accessor, createSignal} from 'solid-js';

describe('complex hooks', () => {
	afterEach(cleanup);

	function ToJSON<T>(props: {
		stores: {
			[P in keyof T]: ReadonlyStore<T[P]>;
		};
	}) {
		const accessors = useReadonlyStores(() => props.stores);
		const access = () =>
			(Array.isArray(accessors)
				? accessors.map((accessor) => accessor())
				: Object.entries<Accessor<unknown>>(accessors).reduce(
						(acc, [name, accessor]) => {
							acc[name] = accessor();
							return acc;
						},
						{} as Record<string, unknown>,
				  )) as {
				[P in keyof T]: T[P];
			};
		return <>{JSON.stringify(access())}</>;
	}

	it('checks that a component gets the initial value of multiple stores containing numbers', () => {
		const initialValue1 = 73;
		const initialValue2 = 42;
		const store1$ = makeStore(initialValue1);
		const store2$ = makeStore(initialValue2);
		render(() => <ToJSON stores={[store1$, store2$]} />);

		expect(document.body.textContent).toBe(
			JSON.stringify([initialValue1, initialValue2]),
		);
	});

	it('checks that a component gets the initial value of a store containing an object', () => {
		const initialValue = {test: 'demo'};
		const store$ = makeStore(initialValue);
		render(() => <ToJSON stores={[store$]} />);

		expect(document.body.textContent).toBe(JSON.stringify([initialValue]));
	});

	it('checks that a component gets the initial value of a readonly store containing a number', () => {
		const initialValue = 73;
		const store$ = makeReadonlyStore(initialValue);
		render(() => <ToJSON stores={[store$]} />);

		expect(document.body.textContent).toBe(JSON.stringify([initialValue]));
	});

	it('checks that a component gets the initial value of a readonly store containing an object', () => {
		const initialValue = {test: 'demo'};
		const store$ = makeReadonlyStore(initialValue);
		render(() => <ToJSON stores={[store$]} />);

		expect(document.body.textContent).toBe(JSON.stringify([initialValue]));
	});

	it('checks that a component re-renders when the store value changes', () => {
		const initialValue = 73;
		const store$ = makeStore(initialValue);
		render(() => <ToJSON stores={[store$]} />);
		store$.set(42);
		expect(document.body.textContent).toBe(JSON.stringify([42]));
	});

	it('checks that a component re-renders if the stores passed as prop change', async () => {
		const store1$ = makeStore(1);
		const store2$ = makeStore(2);
		render(() => {
			const [prop, setProp] = createSignal(store1$);
			return (
				<>
					<button title="trigger" onClick={() => setProp(store2$)}>
						click me
					</button>
					<div title="content">
						<ToJSON stores={[prop()]} />
					</div>
				</>
			);
		});
		expect(store1$.nOfSubscriptions()).toBe(1);
		expect(store2$.nOfSubscriptions()).toBe(0);
		const btn = await screen.findByTitle('trigger');
		const div = await screen.findByTitle('content');
		fireEvent.click(btn);
		expect(div.textContent).toBe(JSON.stringify([2]));
		expect(store1$.nOfSubscriptions()).toBe(0);
		expect(store2$.nOfSubscriptions()).toBe(1);
	});

	it('keeps track of the number of subscriptions', async () => {
		const store1$ = makeStore(1);
		const store2$ = makeStore(1);
		expect(store1$.nOfSubscriptions()).toBe(0);

		const {unmount} = render(() => {
			const [prop, setProp] = createSignal(store1$);
			return (
				<>
					<button title="trigger" onClick={() => setProp(store2$)}>
						click me
					</button>
					<div title="content">
						<ToJSON stores={[prop()]} />
					</div>
				</>
			);
		});

		expect(store1$.nOfSubscriptions()).toBe(1);
		store1$.set(2);
		expect(store1$.nOfSubscriptions()).toBe(1);

		const btn = await screen.findByTitle('trigger');
		fireEvent.click(btn);

		expect(store1$.nOfSubscriptions()).toBe(0);
		expect(store2$.nOfSubscriptions()).toBe(1);

		unmount();

		expect(store1$.nOfSubscriptions()).toBe(0);
		expect(store2$.nOfSubscriptions()).toBe(0);
	});
});
