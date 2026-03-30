function waitForGlobal<T = any>(
  getter: () => T | undefined,
  { timeout = 5000, interval = 100 }: { timeout?: number; interval?: number } = {}
): Promise<T> {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      const value = getter();
      if (value !== undefined) {
        return resolve(value);
      }
      if (Date.now() - start >= timeout) {
        return reject(new Error('Timed out waiting for global dependency'));
      }
      setTimeout(check, interval);
    };

    check();
  });
}

export default waitForGlobal;
