type SetFloatingProps = {
  target: HTMLElement;
  dragTarget: HTMLElement;
  defaultPosition?: { x: number; y: number };
  onDragEnd?: (x: number, y: number) => void;
  isFloating?: boolean;
  addClassTarget?: NodeListOf<HTMLElement>;
};

export default function setFloating({
  target,
  dragTarget,
  defaultPosition,
  onDragEnd,
  isFloating = true,
  addClassTarget,
}: SetFloatingProps) {
  const floatingClass = 'floating';
  const parent = document.body;

  if (!target || !dragTarget) {
    console.error('[setFloating] Invalid target or dragTarget element.');
    return () => {};
  }

  if (isFloating) {
    target.classList.add(floatingClass);
    addClassTarget?.forEach((elem) => elem.classList.add(floatingClass));
  }

  target.style.position = 'fixed';
  target.style.left = `${defaultPosition?.x ?? 8}px`;
  target.style.top = `${defaultPosition?.y ?? 8}px`;
  dragTarget.style.cursor = 'move';

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const clampPosition = () => {
    const currentLeft = parseFloat(target.style.left) || 0;
    const currentTop = parseFloat(target.style.top) || 0;

    const clampedX = Math.max(0, Math.min(currentLeft, parent.clientWidth - target.offsetWidth));
    const clampedY = Math.max(0, Math.min(currentTop, parent.clientHeight - target.offsetHeight));

    target.style.left = `${clampedX}px`;
    target.style.top = `${clampedY}px`;
  };

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    isDragging = true;
    const rect = target.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const parentRect = parent.getBoundingClientRect();

    const newX = Math.max(
      0,
      Math.min(e.clientX - parentRect.left - offsetX, parent.clientWidth - target.offsetWidth)
    );
    const newY = Math.max(
      0,
      Math.min(e.clientY - parentRect.top - offsetY, parent.clientHeight - target.offsetHeight)
    );

    target.style.left = `${newX}px`;
    target.style.top = `${newY}px`;
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    isDragging = false;

    clampPosition();

    const finalX = parseFloat(target.style.left) || 0;
    const finalY = parseFloat(target.style.top) || 0;

    onDragEnd?.(finalX, finalY);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const onResize = () => {
    clampPosition();
  };

  dragTarget.addEventListener('mousedown', onMouseDown);
  window.addEventListener('resize', onResize);
  window.addEventListener('blur', onResize);

  clampPosition();

  return () => {
    target.style.position = '';
    target.style.top = '';
    target.style.left = '';
    dragTarget.style.cursor = '';

    dragTarget.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('blur', onResize);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (isFloating) {
      target.classList.remove(floatingClass);
      addClassTarget?.forEach((elem) => elem.classList.remove(floatingClass));
    }
  };
}
