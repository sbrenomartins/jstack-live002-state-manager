type SetterFn<T> = (prevState: T) => Partial<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createStore<TState extends Record<string, any>>(
  initialState: TState,
) {
  let state = initialState;
  const listeners = new Set<() => void>();

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

  return { setState, getState, subscribe };
}
