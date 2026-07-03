import { createSignal, onCleanup, onMount } from "solid-js";

export function useElementSize() {
  let el!: HTMLDivElement;

  const [size, setSize] = createSignal({ width: 0, height: 0 });

  onMount(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    ro.observe(el);

    onCleanup(() => ro.disconnect());
  });

  return { ref: (node: HTMLDivElement) => (el = node), size };
}