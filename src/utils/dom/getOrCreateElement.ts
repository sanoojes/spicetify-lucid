export default function getOrCreateElement<T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  id: string,
  parent: Element = document.body
): HTMLElementTagNameMap[T] {
  let element = parent.querySelector(`#${id}`) as HTMLElementTagNameMap[T];

  if (!element) {
    element = document.createElement(tagName);
    element.id = `${id}`;
    parent.appendChild(element);
  }

  return element;
}
