// deno-lint-ignore ban-types
type Stringify<T extends string> = T | (string & {}); // just to trick the compiler

type Color = string;
export type ColorState = {
  mode: Stringify<'default' | 'dynamic' | 'custom'>;
  accentColor: Color;
  isTinted: boolean;
  isDark: boolean;
};

export type CSSFilter = {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  opacity?: number;
  blur?: number;
};

export type BodyClassState = {
  hideHomeHeader: boolean;
  newHome: boolean;
  flexyHome: boolean;
};

type BackgroundMode = Stringify<'solid' | 'static' | 'animated'>;
type BackgroundImageMode = Stringify<'custom' | 'player' | 'page'>;
export type BackgroundState = {
  mode: BackgroundMode;
  options: {
    // For Animated and Static
    filter: CSSFilter;
    imageMode: BackgroundImageMode;
    imageSrc: string | null;

    // Solid Background
    color: Color;

    // Animated Background
    autoStopAnimation: boolean;
  };
};

type FontState = {
  family: string;
  variants: string[];
};

export type BorderStyle = Stringify<
  'none' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'
>;

type BorderState = {
  color: Color;
  hoverColor: Color;
  thickness: number;
  style: BorderStyle;
};

export type UIPreferencesState = {
  titleFont: FontState;
  // variableFont: GoogleFont;
  bodyFont: FontState;

  border: BorderState;

  windowControlHeight: number;
};

type UnderMainViewTypes = Stringify<'default' | 'playing' | 'custom-img' | 'custom-color' | 'none'>;
export type UnderMainViewState = {
  type: UnderMainViewTypes;

  isScrolling: boolean;
  isScaling: boolean;

  filter: CSSFilter;
  customUrl: string;

  customColor: Color;
};

type SettingModalAccessPoint = Stringify<'menu' | 'nav'>;
export type SettingModalState = {
  accessPoint: SettingModalAccessPoint;
  isFloating: boolean;
  floatingPosition: { x: number; y: number };
};

type PlayerTypes = Stringify<'compact' | 'default'>;
export type PlayerStyle = {
  height: number;
  sliderHeight: number;
  width: number; // !! width is in percentage
  bgColor: Color | null; // null for default
  bgOpacity: number;
  paddingX: number;
  borderRadius: number;
  coverArtRadius: number;
  backdropFilter: CSSFilter;
};

export type NextSongCardState = {
  show: boolean;
  height: number;
  gap: number;
  maxWidth: number;
  paddingX: number;
  paddingY: number;
  coverArtSize: number;
  removeNextUp: boolean;
  isFloating: boolean;
  position: Stringify<'left' | 'right'>;
};
export type PlayerState = {
  mode: PlayerTypes;
  isFloating: boolean;
  hideExtraIcon: boolean;
  defaultStyle: PlayerStyle;
  compactStyle: PlayerStyle;
  nextSongCard: NextSongCardState;
} & AutoHideBaseState;

export type PageMode = Stringify<'card' | 'compact-card' | 'compact' | 'default'>;
export type PageCoverImageMode = Stringify<'hidden' | 'as-bg' | 'default'>;
export type PageState = {
  mode: PageMode;
  coverMode: PageCoverImageMode;
  homeCardGap: number;
  panelGap: number;
};

type AutoHideBaseState = {
  autoHide: boolean;
  hoverTargetSize: number;
};

export type LibraryState = AutoHideBaseState & {};
export type RightSidebarState = AutoHideBaseState & {
  mode: Stringify<'compact' | 'default'>;
  positionX: Stringify<'right' | 'left'>;
  positionY: Stringify<'top' | 'bottom'>;
  compactBackdropFilter: CSSFilter;
  compactSize: number;
};
export type GlobalNavState = AutoHideBaseState & {
  floating: boolean;
};

export type AppState = {
  color: ColorState;
  bg: BackgroundState;
  umv: UnderMainViewState;
  page: PageState;
  bodyClass: BodyClassState;
  settingModal: SettingModalState;
  uiPreferences: UIPreferencesState;
  player: PlayerState;
  library: LibraryState;
  rightSidebar: RightSidebarState;
  globalNav: GlobalNavState;
  disableTippy: boolean;
  isAnalyticsActive: boolean;
};
