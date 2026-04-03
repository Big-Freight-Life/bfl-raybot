export interface TypewriterOptions {
  onChunk: (text: string) => void;
  onComplete: () => void;
}

export function typewriterEffect(fullText: string, options: TypewriterOptions) {
  const { onChunk, onComplete } = options;
  let index = 0;

  function getDelay(char: string): number {
    const base = 30 + Math.random() * 20;
    if ('.!?'.includes(char)) return base + 80;
    if (char === ',') return base + 30;
    if (char === '\n') return base + 120;
    if (char === ':' || char === ';') return base + 50;
    return base;
  }

  function tick() {
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
    setTimeout(tick, delay);
  }

  tick();
}
