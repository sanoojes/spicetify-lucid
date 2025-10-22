import { setupAnalytics } from '@app/setupAnalytics.ts';
import setBackground from '@features/setBackground.tsx';
import setBodyClasses from '@features/setBodyClasses.ts';
import setColors from '@features/setColors.ts';
import setControls from '@features/setControls.ts';
import setGlobalNav from '@features/setGlobalNav.ts';
import setLibrary from '@features/setLibrary.ts';
import setPageStyles from '@features/setPageStyles.ts';
import setPlayer from '@features/setPlaybar.tsx';
import setRightSidebar from '@features/setRightSidebar.ts';
import setUIPreferences from '@features/setUIPreferences.ts';
import setUnderMainView from '@features/setUnderMainView.tsx';
import appStore from '@store/appStore.ts';
import tempStore from '@store/tempStore.ts';
import addRootCardSizeToDom from '@utils/addRootCardSizeToDom.ts';
import initNotificationSystem from '@utils/initNotificationSystem.tsx';
import addPageStyles from '@utils/page/addPageStyles.ts';
import patchIcons from '@utils/patchIcons.ts';
import { isLinux, isVersionAtLeast } from '@utils/platform.ts';
import addPlayerData from '@utils/player/addPlayerData.ts';
import resetTheme from '@utils/resetTheme.ts';
import addSettings from '@utils/settings/addSettings.tsx';

// import showStartupMessage from '@utils/showStartupMessage.ts';

function main() {
  // Expose Lucid Methods
  window.Lucid = {
    Reset: () => resetTheme(),
    Config: () => appStore.getState(),
    AppStore: appStore,
    TempStore: tempStore,
  };

  // Set up global notification handler
  initNotificationSystem();

  // window.Lucid.Reset();
  patchIcons(); // TODO: add customisability

  // Initialize features
  if (!isLinux()) setControls();
  setUIPreferences();
  setColors();
  setBackground();
  setPlayer();
  setUnderMainView(); // set lucid umv
  setBodyClasses(); // set body classes such as `hide-home-header`
  setPageStyles();
  setLibrary();
  setGlobalNav();
  setRightSidebar();

  // Add States
  addPlayerData();
  addPageStyles();
  addRootCardSizeToDom();

  // Add settings
  addSettings();

  // showStartupMessage();

  // add support to add version specific styles (if needed)
  // const version = Spicetify?.Platform?.version ?? '0.0.0';
  // const formattedVersion = version.split('.').slice(0, 3).join('-');
  // const versionClass = `spotify-version-${formattedVersion}`;
  // document.body.classList.add(versionClass);
  document.body.classList.toggle('spotify-version-at-least-1-2-65', isVersionAtLeast('1.2.65'));

  // setupAnalytics();
}

main();

declare global {
  interface Window {
    Lucid: {
      Reset: () => void;
      Config: () => ReturnType<typeof appStore.getState>;
      AppStore: typeof appStore;
      TempStore: typeof tempStore;
    };
    __LUCID__?: boolean;
  }
}
