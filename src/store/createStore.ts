import { useSyncExternalStore } from 'react';

type SetterFn<T> = (prevState: T) => Partial<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createStore<TState extends Record<string, any>>(
  createState: (
    setState: (partialState: Partial<TState> | SetterFn<TState>) => void,
    getState: () => TState,
  ) => TState,
) {
  let state: TState;
  let listeners: Set<() => void>;

  function notifyListeners() {
    listeners.forEach((listener) => listener());
  }

  function setState(partialState: Partial<TState> | SetterFn<TState>) {
    const newValue =
      typeof partialState === 'function' ? partialState(state) : partialState;

    state = {
      ...state,
      ...newValue,
    };

    notifyListeners();
  }

  function getState() {
    return state;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function useStore<TValue>(
    selector: (currentState: TState) => TValue,
  ): TValue {
    return useSyncExternalStore(subscribe, () => selector(state));
  }

  state = createState(setState, getState);
  listeners = new Set();

  return useStore;
}
