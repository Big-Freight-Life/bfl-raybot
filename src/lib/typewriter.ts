export interface TypewriterOptions {
  onChunk: (text: string) => void;
  onComplete: () => void;
}

// M4: Returns a cancel function to allow cleanup
export function typewriterEffect(fullText: string, options: TypewriterOptions): () => void {
  const { onChunk, onComplete } = options;
  let index = 0;
  let cancelled = false;
  let timerId: ReturnType<typeof setTimeout>;

  function getDelay(char: string): number {
    const base = 30 + Math.random() * 20;
    if ('.!?'.includes(char)) return base + 80;
    if (char === ',') return base + 30;
    if (char === '\n') return base + 120;
    if (char === ':' || char === ';') return base + 50;
    return base;
  }

  function tick() {
    if (cancelled) return;
    if (index >= fullText.length) {
      onComplete();
      return;
    }

    const start = index;
    do {
      index++;
    } while (index < fullText.length && !'.,!?;:\n'.includes(fullText[index - 1]) && index - start < 3);

    const accumulated = fullText.slice(0, index);
    onChunk(accumulated);

    const lastChar = fullText[index - 1];
    const delay = getDelay(lastChar);
    timerId = setTimeout(tick, delay);
  }

  tick();

  return () => {
    cancelled = true;
    clearTimeout(timerId);
  };
}
