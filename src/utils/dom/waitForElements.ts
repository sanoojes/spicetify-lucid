type WaitForElementsOptions = {
  timeout?: number;
};

function waitForElements<T extends string | string[]>(
  selectors: T,
  { timeout = 3000 }: WaitForElementsOptions = {}
): Promise<T extends string ? Element : T extends string[] ? Element[] : never> {
  const selectorList = Array.isArray(selectors) ? selectors : [selectors];
  const startTime = performance.now();

  return new Promise((resolve, reject) => {
    function check(): void {
      const elements = selectorList.map((sel) => document.querySelector(sel));

      if (elements.every(Boolean)) {
        const result = Array.isArray(selectors)
          ? (elements as Element[])
          : (elements[0] as Element);
        resolve(result as any);
        return;
      }

      if (performance.now() - startTime > timeout) {
        reject(new Error(`Timeout: Could not find all elements: ${selectorList.join(', ')}`));
        return;
      }

      requestAnimationFrame(check);
    }

    check();
  });
}

export default waitForElements;
