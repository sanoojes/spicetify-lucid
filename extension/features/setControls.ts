import appStore from '@store/appStore.ts';
import getOrCreateStyle from '@utils/dom/getOrCreateStyle.ts';
import { isVersionAtLeast, isWindows } from '@utils/platform.ts';
import getOrCreateElement from '@utils/dom/getOrCreateElement.ts';

function getZoom() {
  const zoom = window.outerHeight / window.innerHeight;
  return { zoom, inverseZoom: 1 / zoom };
}

let controlElem: HTMLDivElement | null = null;
function mountTransparentWindowControls(height: number) {
  const { zoom, inverseZoom } = getZoom();
  const style = getOrCreateStyle('transparent-control-style');
  const hasCenteredNav = isVersionAtLeast('1.2.46') && !isVersionAtLeast('1.2.70');

  if (!controlElem) {
    controlElem = getOrCreateElement('div', 'transparent-controls', document.body);
    controlElem.className = 'transparent-controls';
  }

  const normalHeight = height || (hasCenteredNav ? 32 : 64);
  if (normalHeight === 0) {
    style.textContent = `
:root {--zoom: ${zoom};--inverse-zoom: ${inverseZoom};}
.transparent-controls {content: ""; height: 0; width: 0; position: fixed; top: 0; right: 0;}`;
    return;
  }

  const controlWidth = Math.round(135 * inverseZoom);
  if (controlWidth > 500) return intervalCall();

  const scaledHeight = normalHeight / zoom;
  const topOffset = hasCenteredNav ? (scaledHeight - Math.min(32 / zoom, scaledHeight)) / 2 : 0;
  const controlHeight = scaledHeight - topOffset * 2;
  if (controlHeight > 500) return intervalCall();

  style.textContent = `
:root {--zoom: ${zoom};--inverse-zoom: ${inverseZoom};}
.transparent-controls {
  content: "";
  height: ${controlHeight}px;
  width: ${controlWidth}px;
  position: fixed;
  top: ${topOffset}px;
  right: 0;
  backdrop-filter: brightness(2.1);
  pointer-events: none;
}
html[dir="rtl"] .transparent-controls { left: 0; right: inherit; }
.transparent-controls.hide-transparent-controls { display: none; content: none; }`;
}

async function updateTitlebarHeight(height: number) {
  const msg = { height };
  await Spicetify?.Platform?.ControlMessageAPI?._updateUiClient?.updateTitlebarHeight(msg);
  await Spicetify?.Platform?.UpdateAPI?._updateUiClient?.updateTitlebarHeight(msg);
  await Spicetify.CosmosAsync.post('sp://messages/v1/container/control', {
    type: 'update_titlebar',
    height: `${height}px`,
  });
}

export default function setControls(
  height = appStore.getState().uiPreferences.windowControlHeight
) {
  if (!isWindows()) return;
  updateTitlebarHeight(height).then(() => mountTransparentWindowControls(height));
}
setControls();

function intervalCall() {
  const intervalId = setInterval(setControls, 300);
  setTimeout(() => clearInterval(intervalId), 10000);
}

window.addEventListener('resize', intervalCall);
document.addEventListener('fullscreenchange', () =>
  controlElem?.classList.toggle('hide-transparent-controls', !!document.fullscreenElement)
);
appStore.subscribe((state) => state.uiPreferences.windowControlHeight, setControls);
