function getOrCreateStyle(id: string): HTMLStyleElement {
  let element = document.head.querySelector(`#${id}`) as HTMLStyleElement;

  if (!element) {
    element = document.createElement('style');
    element.id = `${id}`;
    document.head.appendChild(element);
  }

  return element;
}
export default getOrCreateStyle;
