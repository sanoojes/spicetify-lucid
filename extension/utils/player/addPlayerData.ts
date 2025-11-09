import { cacheColorInBackground } from '@features/setColors.ts';
import appStore from '@store/appStore.ts';
import tempStore, { type PlayerData } from '@store/tempStore.ts';
import waitForGlobal from '@utils/dom/waitForGlobal.ts';
import { getCoverColor } from '@utils/colors/getCoverColor.ts';

const scheduleIdle =
  typeof requestIdleCallback === 'function'
    ? requestIdleCallback
    : (cb: () => void) => setTimeout(cb, 50);

async function addPlayerData(playerData?: typeof Spicetify.Player.data) {
  const data = playerData ?? (await waitForGlobal(() => Spicetify?.Player?.data));

  const getImageUrl = (item?: typeof data.item | null) => {
    const images = item?.images;
    return images?.[3]?.url || images?.[2]?.url || images?.[1]?.url || images?.[0]?.url || null;
  };

  const currentUrl = getImageUrl(data.item);
  if (!currentUrl) return;
  const currentColors = await getCoverColor(currentUrl);
  document.body.style.setProperty('--np-img-url', `url("${currentUrl}")`);
  tempStore.getState().setPlayer({
    current: {
      url: currentUrl,
      colors: currentColors,
      data: data.item,
    },
  });

  const { isDark, isTinted, mode } = appStore.getState().color;
  const stableCurrentUrl = currentUrl;

  const loadItems = async (items?: (typeof data.item)[]) => {
    return (
      await Promise.all(
        items?.map(async (item) => {
          const url = getImageUrl(item);
          if (!url) return null;
          const colors = await getCoverColor(url);
          return {
            url,
            colors,
            data: item,
          };
        }) ?? []
      )
    ).filter(Boolean) as PlayerData[];
  };

  const prev = await loadItems(data.previousItems?.slice(-2));
  const next = await loadItems(data.nextItems?.slice(0, 2));

  tempStore.getState().setPlayer({
    prev,
    next,
  });

  if (mode !== 'dynamic') return;

  [...prev, ...next].forEach((track) => {
    const hex = track?.colors?.colorRaw?.hex;
    if (!hex) return;

    scheduleIdle(() => {
      const latestUrl = tempStore.getState().player?.current?.url;
      if (latestUrl === stableCurrentUrl) {
        cacheColorInBackground(hex, isDark, isTinted);
      }
    });
  });
}

waitForGlobal(() => Spicetify?.Player).then((player) =>
  player.addEventListener('songchange', (e) => addPlayerData(e?.data))
);

waitForGlobal(() => Spicetify?.Platform?.PlayerAPI?._queue?._events).then((events) =>
  events?.addListener('queue_update', () => addPlayerData())
);

export default addPlayerData;