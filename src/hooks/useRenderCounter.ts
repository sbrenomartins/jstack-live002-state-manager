import { useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useRenderCounter(componentName: string) {
  const counter = useRef(0);

  counter.current += 1;

  console.log(`${componentName} renderizou ${counter.current} vezes.`);
}
