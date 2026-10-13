export type DebouncedFn<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;

export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay = 300,
): DebouncedFn<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export default useDebounce;
