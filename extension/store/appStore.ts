import type {
  AppState,
  BackgroundState,
  BodyClassState,
  ColorState,
  GlobalNavState,
  LibraryState,
  PageState,
  PlayerState,
  PlayerStyle,
  RightSidebarState,
  SettingModalState,
  UIPreferencesState,
  UnderMainViewState,
} from '@app/types/appStore.ts';
import { merge } from 'lodash';
import { combine, persist, subscribeWithSelector } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

const DEFAULT_FONT = {
  family: 'Inter',
  variants: ['100', '200', '300', 'regular', '500', '600', '700', '800', '900'],
};

const PLAYER_BG_FILTER = {
  blur: 32,
  saturation: 150,
  brightness: 50,
  contrast: 100,
  opacity: 100,
};

export const DEFAULT_STATE: AppState = {
  color: {
    mode: 'dynamic',
    isDark: true,
    isTinted: true,
    accentColor: '#6200ee',
  },
  bg: {
    mode: 'static',
    options: {
      filter: {
        blur: 32,
        saturation: 150,
        contrast: 100,
        brightness: 40,
        opacity: 100,
      },
      color: '#060606',
      imageMode: 'player',
      imageSrc: 'https://picsum.photos/1920/1080',
      autoStopAnimation: false,
    },
  },
  bodyClass: { hideHomeHeader: true, newHome: true, flexyHome: true },
  umv: {
    type: 'default',
    isScrolling: false,
    isScaling: true,
    filter: {
      blur: 16,
      saturation: 150,
      contrast: 100,
      brightness: 80,
      opacity: 80,
    },
    customColor: '#060606',
    customUrl: 'https://picsum.photos/1920/1080',
  },
  uiPreferences: {
    windowControlHeight: 64,
    bodyFont: DEFAULT_FONT,
    titleFont: DEFAULT_FONT,
    border: {
      color: 'rgba(255,255,255,.1)',
      hoverColor: 'rgba(255,255,255,.2)',
      thickness: 1,
      style: 'solid',
    },
  },
  page: {
    mode: 'card',
    coverMode: 'default',
    coverPreScroll: 600,
    homeCardGap: 8,
    panelGap: 8,
  },
  player: {
    mode: 'default',
    autoHide: false,
    hoverTargetSize: 40,
    isFloating: true,
    hideExtraIcon: true,
    nextSongCard: {
      show: true,
      isFloating: true,
      gap: 4,
      height: 64,
      maxWidth: 256,
      paddingX: 8,
      paddingY: 8,
      coverArtSize: 48,
      removeNextUp: true,
      position: 'left',
    },
    defaultStyle: {
      height: 80, // in px
      sliderHeight: 4,
      width: 100, // in %
      borderRadius: 8,
      coverArtRadius: 8,
      bgOpacity: 50,
      paddingX: 8,
      backdropFilter: PLAYER_BG_FILTER,
      bgColor: `var(--main-bg)`,
    },
    compactStyle: {
      height: 64, // in px
      sliderHeight: 4,
      width: 100, // in %
      borderRadius: 8,
      coverArtRadius: 8,
      bgOpacity: 50,
      paddingX: 8,
      backdropFilter: PLAYER_BG_FILTER,
      bgColor: `var(--main-bg)`,
    },
  },
  settingModal: {
    accessPoint: 'nav',
    isFloating: false,
    floatingPosition: { x: 64, y: 64 },
  },
  library: {
    autoHide: false,
    hoverTargetSize: 40,
  },
  rightSidebar: {
    mode: 'default',
    positionX: 'right', // only used in compact mode
    positionY: 'bottom', // only used in compact mode
    autoHide: false,
    hoverTargetSize: 40,
    compactBackdropFilter: PLAYER_BG_FILTER,
    compactSize: 400,
  },
  globalNav: {
    floating: false,
    autoHide: false,
    hoverTargetSize: 40,
  },
  disableTippy: false,
  isAnalyticsActive: true,
};

type AppStateSetters = {
  setColor: (color: Partial<ColorState>) => void;
  setBg: (bg: Partial<BackgroundState>) => void;
  setBgOptions: (options: Partial<BackgroundState['options']>) => void;
  setBgFilter: (filter: Partial<BackgroundState['options']['filter']>) => void;

  setPlayer: (player: Partial<PlayerState>) => void;
  setPlayerNextCard: (nextSongCard: Partial<PlayerState['nextSongCard']>) => void;
  setPlayerBackdropFilter: (
    mode: PlayerState['mode'],
    filter: Partial<PlayerStyle['backdropFilter']>
  ) => void;
  setPlayerStyles: (mode: PlayerState['mode'], styles: Partial<PlayerStyle>) => void;

  setPage: (umv: Partial<PageState>) => void;

  setUMV: (umv: Partial<UnderMainViewState>) => void;
  setUMVFilter: (filter: Partial<UnderMainViewState['filter']>) => void;

  setIsAnalyticsActive: (isAnalyticsActive: boolean) => void;

  setSettingModal: (settingModal: Partial<SettingModalState>) => void;
  setSettingModalPosition: (x: number, y: number) => void;

  setUIPreferences: (uiPreferences: Partial<UIPreferencesState>) => void;
  setBorder: (border: Partial<UIPreferencesState['border']>) => void;

  setBodyClass: (bodyClass: Partial<BodyClassState>) => void;
  setLibrary: (library: Partial<LibraryState>) => void;
  setRightSidebar: (rightSidebar: Partial<RightSidebarState>) => void;
  setRightSidebarCompactBlur: (blur: Partial<RightSidebarState['compactBackdropFilter']>) => void;
  setGlobalNav: (globalNav: Partial<GlobalNavState>) => void;

  setDisableTippy: (disableTippy: boolean) => void;

  exportConfig: () => string | null;
  importConfig: (config: AppState) => void;
  resetStore: () => void;
};

const appStore = createStore<AppState & AppStateSetters>()(
  persist(
    subscribeWithSelector(
      combine(DEFAULT_STATE, (set, get) => ({
        setColor: (color) => set({ color: { ...get().color, ...color } }),
        setBg: (bg) => set({ bg: { ...get().bg, ...bg } }),
        setBgOptions: (options) =>
          set({
            bg: {
              ...get().bg,
              options: { ...get().bg.options, ...options },
            },
          }),
        setBgFilter: (filter) =>
          set({
            bg: {
              ...get().bg,
              options: {
                ...get().bg.options,
                filter: { ...get().bg.options.filter, ...filter },
              },
            },
          }),
        setPage: (page) => set({ page: { ...get().page, ...page } }),
        setUMV: (umv) => set({ umv: { ...get().umv, ...umv } }),
        setUMVFilter: (filter) =>
          set({
            umv: {
              ...get().umv,
              filter: { ...get().umv.filter, ...filter },
            },
          }),

        setPlayer: (player) => set({ player: { ...get().player, ...player } }),
        setPlayerNextCard: (nextSongCard) =>
          set({
            player: {
              ...get().player,
              nextSongCard: { ...get().player.nextSongCard, ...nextSongCard },
            },
          }),
        setPlayerBackdropFilter: (mode, filter) => {
          const key = mode === 'compact' ? 'compactStyle' : 'defaultStyle';
          set({
            player: {
              ...get().player,
              [key]: {
                ...get().player[key],
                backdropFilter: {
                  ...get().player[key].backdropFilter,
                  ...filter,
                },
              },
            },
          });
        },
        setPlayerStyles: (mode, styles) => {
          const key = mode === 'compact' ? 'compactStyle' : 'defaultStyle';
          set({
            player: {
              ...get().player,
              [key]: { ...get().player[key], ...styles },
            },
          });
        },

        setUIPreferences: (uiPreferences) =>
          set({ uiPreferences: { ...get().uiPreferences, ...uiPreferences } }),
        setLibrary: (library) => set({ library: { ...get().library, ...library } }),
        setGlobalNav: (globalNav) => set({ globalNav: { ...get().globalNav, ...globalNav } }),
        setRightSidebar: (rightSidebar) =>
          set({ rightSidebar: { ...get().rightSidebar, ...rightSidebar } }),
        setRightSidebarCompactBlur: (compactBackdropFilter) =>
          set({
            rightSidebar: {
              ...get().rightSidebar,
              compactBackdropFilter: {
                ...get().rightSidebar.compactBackdropFilter,
                ...compactBackdropFilter,
              },
            },
          }),
        setBorder: (border) =>
          set({
            uiPreferences: {
              ...get().uiPreferences,
              border: { ...get().uiPreferences.border, ...border },
            },
          }),

        setSettingModal: (settingModal) =>
          set({ settingModal: { ...get().settingModal, ...settingModal } }),
        setSettingModalPosition: (x, y) =>
          set((state) => ({
            settingModal: {
              ...state.settingModal,
              floatingPosition: { x, y },
            },
          })),

        setDisableTippy: (disableTippy) => set({ disableTippy }),

        setBodyClass: (bodyClass) => set({ bodyClass: { ...get().bodyClass, ...bodyClass } }),
        setIsAnalyticsActive: (isAnalyticsActive) => set({ isAnalyticsActive }),

        importConfig: (config) => set(() => merge({}, DEFAULT_STATE, config)),
        exportConfig: () => {
          try {
            const config = JSON.stringify(get(), null, 2);
            return config;
          } catch {
            return null;
          }
        },
        resetStore: () => {
          try {
            set(DEFAULT_STATE);
            localStorage.removeItem('lucid:settings');
          } catch {}
        },
      }))
    ),
    {
      name: 'lucid:settings',
      version: 1,
      migrate: (persistedState) => merge(DEFAULT_STATE, persistedState ?? {}),
    }
  )
);

// Patch the store to merge missing fields into existing data.
appStore.getState().importConfig(appStore.getState()); // i wont change versioning
export default appStore;
