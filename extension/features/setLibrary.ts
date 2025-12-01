import appStore from '@store/appStore.ts';
import setupHoverToggle from '@utils/setupHoverToggle.ts';

export default function setLibrary(library = appStore.getState().library) {
  document.body.classList.toggle('library-auto-hide', library.autoHide);
  if (library.autoHide)
    document.body.style.setProperty('--lib-target-size', `${library.hoverTargetSize}px`);
  else document.body.style.removeProperty('--lib-target-size');

  setupHoverToggle({
    containerSelector: '.Root__top-container',
    onTopContainerSelectors: ['.Root__nav-bar, #Desktop_LeftSidebar_Id'],
    hoverTargetId: 'lib-hover-target',
    className: 'show',
    condition: library.autoHide,
  });
}
appStore.subscribe((state) => state.library, setLibrary);
