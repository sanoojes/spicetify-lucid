import appStore from '@/store/appStore.ts';
import { isWindows } from '@/utils/platform.ts';
import setupHoverToggle from '@/utils/setupHoverToggle.ts';

let hoverTarget: null | ReturnType<typeof setupHoverToggle> = null;
export default function setGlobalNav(globalNav = appStore.getState().globalNav) {
  document.body.classList.toggle('global-nav-floating', globalNav.floating);

  if (isWindows()) return; // auto hide will not be supported because it interferes with -webkit-app-region (makes the top bar for dragging)

  if (globalNav.autoHide)
    document.body.style.setProperty('--global-nav-target-size', `${globalNav.hoverTargetSize}px`);
  else document.body.style.removeProperty('--global-nav-target-size');
  document.body.classList.toggle('global-nav-auto-hide', globalNav.floating && globalNav.autoHide);
  document.body.classList.toggle(
    'global-nav-not-auto-hide',
    globalNav.floating && !globalNav.autoHide
  );
  if (hoverTarget) {
    hoverTarget();
    hoverTarget = null;
  }
  if (globalNav.autoHide)
    setupHoverToggle({
      onHoverBodyClass: 'global-nav--hovering',
      onNotHoverBodyClass: 'global-nav-not--hovering',
      containerSelector: '.Root__top-container',
      onTopContainerSelectors: ['.Root__globalNav'],
      hoverTargetId: 'global-nav-hover-target',
      className: 'show',
    });
}
appStore.subscribe((state) => state.globalNav, setGlobalNav);
