import {
	makeReadonlyStore,
	makeStore,
	ReadonlyStore,
	Store,
	Updater,
} from 'universal-stores';
import {useReadonlyStore, useStore} from '../src/lib';
import {cleanup, fireEvent, render, screen} from 'solid-testing-library';
import {createEffect, createSignal} from 'solid-js';

describe('hooks', () => {
	afterEach(cleanup);

	function ToJSON<T>(props: {store$: ReadonlyStore<T>}) {
		const store = useReadonlyStore(() => props.store$);
		return <>{JSON.stringify(store())}</>;
	}

	it('checks that a component gets the initial value of a store containing a number', () => {
		const initialValue = 73;
		const store$ = makeStore(initialValue);
		render(() => <ToJSON store$={store$} />);

		expect(document.body.textContent).toBe(JSON.stringify(initialValue));
	});

	it('checks that a component gets the initial value of a store containing an object', () => {
		const initialValue = {test: 'demo'};
		const store$ = makeStore(initialValue);
		render(() => <ToJSON store$={store$} />);

		expect(document.body.textContent).toBe(JSON.stringify(initialValue));
	});

	it('checks that a component gets the initial value of a readonly store containing a number', () => {
		const initialValue = 73;
		const store$ = makeReadonlyStore(initialValue);
		render(() => <ToJSON store$={store$} />);

		expect(document.body.textContent).toBe(JSON.stringify(initialValue));
	});

	it('checks that a component gets the initial value of a readonly store containing an object', () => {
		const initialValue = {test: 'demo'};
		const store$ = makeReadonlyStore(initialValue);
		render(() => <ToJSON store$={store$} />);

		expect(document.body.textContent).toBe(JSON.stringify(initialValue));
	});

	it('checks that a component re-renders when the store value changes', () => {
		const initialValue = 73;
		const store$ = makeStore(initialValue);
		render(() => <ToJSON store$={store$} />);
		store$.set(42);
		expect(document.body.textContent).toBe(JSON.stringify(42));
	});

	function ToJSONWithSet<T>(props: {
		store$: Store<T>;
		onRender?: () => void;
		target: T;
	}) {
		const [store, setStore] = useStore(() => props.store$);
		props.onRender?.();
		createEffect(() => {
			setStore(props.target);
		});
		return <>{JSON.stringify(store())}</>;
	}

	function ToJSONWithUpdate<T>(props: {
		store$: Store<T>;
		onRender?: () => void;
		updater: Updater<T>;
	}) {
		const [store, setStore] = useStore(() => props.store$);
		props.onRender?.();
		createEffect(() => {
			setStore(props.updater);
		});
		return <>{JSON.stringify(store())}</>;
	}

	it('checks that a component re-renders when the store value changes via the setter returned by useStore 1/2', async () => {
		const initialValue = 73;
		const store$ = makeStore(initialValue);
		render(() => <ToJSONWithSet store$={store$} target={13} />);
		expect(document.body.textContent).toBe(JSON.stringify(13));
	});

	it('checks that a component re-renders when the store value changes via the setter returned by useStore 2/2', () => {
		const initialValue = 73;
		const store$ = makeStore(initialValue);
		render(() => <ToJSONWithUpdate store$={store$} updater={(c) => c + 1} />);

		expect(document.body.textContent).toBe(JSON.stringify(initialValue + 1));
	});

	it('checks that a component re-renders when the store value changes according to a custom equality function', () => {
		const initialValue = {content: 73};
		const store$ = makeStore(initialValue, {
			comparator: () => false,
		});
		render(() => (
			<ToJSONWithUpdate
				store$={store$}
				updater={(c) => {
					c.content = 42;
					return c;
				}}
			/>
		));

		expect(document.body.textContent).toBe(JSON.stringify(initialValue));
	});

	it('checks that a component does not re-render when the store value keeps the same reference', () => {
		const initialValue = {content: 73};
		const store$ = makeStore(initialValue);
		render(() => (
			<ToJSONWithUpdate
				store$={store$}
				updater={(c) => {
					c.content = 42;
					return c;
				}}
			/>
		));

		expect(document.body.textContent).toBe(JSON.stringify({content: 73}));
	});

	it('checks that a component re-renders if the store passed as prop changes', async () => {
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
						<ToJSON store$={prop()} />
					</div>
				</>
			);
		});
		expect(store1$.nOfSubscriptions).toBe(1);
		expect(store2$.nOfSubscriptions).toBe(0);
		const btn = await screen.findByTitle('trigger');
		const div = await screen.findByTitle('content');
		fireEvent.click(btn);
		expect(div.textContent).toBe(JSON.stringify(2));
		expect(store1$.nOfSubscriptions).toBe(0);
		expect(store2$.nOfSubscriptions).toBe(1);
	});

	it('keeps track of the number of subscriptions', async () => {
		const store1$ = makeStore(1);
		const store2$ = makeStore(1);
		expect(store1$.nOfSubscriptions).toBe(0);

		const {unmount} = render(() => {
			const [prop, setProp] = createSignal(store1$);
			return (
				<>
					<button title="trigger" onClick={() => setProp(store2$)}>
						click me
					</button>
					<div title="content">
						<ToJSON store$={prop()} />
					</div>
				</>
			);
		});

		expect(store1$.nOfSubscriptions).toBe(1);
		store1$.set(2);
		expect(store1$.nOfSubscriptions).toBe(1);

		const btn = await screen.findByTitle('trigger');
		fireEvent.click(btn);

		expect(store1$.nOfSubscriptions).toBe(0);
		expect(store2$.nOfSubscriptions).toBe(1);

		unmount();

		expect(store1$.nOfSubscriptions).toBe(0);
		expect(store2$.nOfSubscriptions).toBe(0);
	});
});
