import appStore from '@store/appStore.ts';
import getOrCreateStyle from '@utils/dom/getOrCreateStyle.ts';
import { isVersionAtLeast, isWindows } from '@utils/platform.ts';

function getZoom() {
  const zoom = window.outerHeight / window.innerHeight;
  return { zoom, inverseZoom: 1 / zoom };
}

function mountTransparentWindowControls(height: number) {
  const { zoom, inverseZoom } = getZoom();
  const style = getOrCreateStyle('transparent-controls');
  const hasCenteredNav = isVersionAtLeast('1.2.46') && !isVersionAtLeast('1.2.70');

  const normalHeight = height || (hasCenteredNav ? 32 : 64);
  if (normalHeight === 0) {
    style.textContent = `
:root {--zoom: ${zoom};--inverse-zoom: ${inverseZoom};}
body::after {content: ""; height: 0; width: 0; position: fixed; top: 0; right: 0;}`;
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
body:after {
  content: "";
  height: ${controlHeight}px;
  width: ${controlWidth}px;
  position: fixed;
  top: ${topOffset}px;
  right: 0;
  backdrop-filter: brightness(2.1);
  pointer-events: none;
}
html[dir="rtl"] body:after { left: 0; right: inherit; }
body.hide-transparent-controls:after { display: none; content: none; }`;
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

function intervalCall() {
  const intervalId = setInterval(setControls, 300);
  setTimeout(() => clearInterval(intervalId), 10000);
}

window.addEventListener('resize', intervalCall);
document.addEventListener('fullscreenchange', () =>
  document.body.classList.toggle('hide-transparent-controls', !!document.fullscreenElement)
);
appStore.subscribe((state) => state.uiPreferences.windowControlHeight, setControls);
