import type { SectionProps } from '@app/types/settingSchema.ts';
import {
  BorderStateSchema,
  GlobalNavStateSchema,
  LibraryStateSchema,
  PageStateSchema,
} from '@schemas/appStoreSchema.ts';
import type appStore from '@store/appStore.ts';
import { DEFAULT_STATE } from '@store/appStore.ts';
import { isLinux, isWindows } from '@utils/platform.ts';

export const getUISettings = (state: ReturnType<typeof appStore.getState>): SectionProps => {
  const { uiPreferences, bodyClass, library, globalNav, page } = state;

  return {
    id: 'ui-settings',
    sectionName: 'UI Settings',
    groups: [
      {
        id: 'window-controls',
        visible: () => !isLinux(),
        groupName: 'Window Controls',
        components: [
          {
            id: 'mode',
            type: 'Input',
            inputType: 'number',
            label: 'Window Control Height',
            value: uiPreferences.windowControlHeight,
            onChange: (windowControlHeight) => state.setUIPreferences({ windowControlHeight }),
          },
        ],
      },
      {
        id: 'page',
        groupName: 'Page',
        components: [
          {
            id: 'mode',
            type: 'Dropdown',
            label: 'Layout Mode',
            options: [
              ['Default', 'default'],
              ['Card', 'card'],
              ['Compact Card', 'compact-card'],
              ['Compact', 'compact'],
            ],
            value: page.mode,
            onChange: (mode) => state.setPage({ mode }),
          },
          {
            id: 'cover-mode',
            type: 'Dropdown',
            label: 'Cover Art Display',
            options: [
              ['Default', 'default'],
              ['As Background', 'as-bg'],
              ['Hidden', 'hidden'],
            ],
            value: page.coverMode,
            onChange: (coverMode) => state.setPage({ coverMode }),
          },
          {
            id: 'cover-pre-scroll',
            type: 'Input',
            label: 'Cover Pre-Scroll Offset',
            inputType: 'number',
            tippy: 'Offset the page cover art vertically by this many pixels.',
            value: page.coverPreScroll,
            validation: (val) => PageStateSchema.shape.coverPreScroll.safeParse(val),
            onChange: (coverPreScroll) => state.setPage({ coverPreScroll }),
          },
        ],
      },
      {
        id: 'home',
        groupName: 'Homepage',
        components: [
          {
            id: 'hide-header',
            type: 'Toggle',
            label: 'Hide Header Background',
            tippy: 'Hides the background image behind the homepage header.',
            isChecked: bodyClass.hideHomeHeader,
            onChange: (hideHomeHeader) => state.setBodyClass({ hideHomeHeader }),
          },
          {
            id: 'new-home',
            type: 'Toggle',
            label: 'Use New Homepage Layout',
            tippy: 'Enables the redesigned layout for the homepage.',
            isChecked: bodyClass.newHome,
            onChange: (newHome) => state.setBodyClass({ newHome }),
          },
          {
            id: 'flexy-home',
            type: 'Toggle',
            label: 'Pair Cards',
            tippy: 'Displays homepage cards in pairs.',
            visible: () => state.bodyClass.newHome,
            isChecked: bodyClass.flexyHome,
            onChange: (flexyHome) => state.setBodyClass({ flexyHome }),
          },
        ],
      },
      {
        id: 'lib',
        groupName: 'Library Panel',
        components: [
          {
            id: 'auto-hide',
            type: 'Toggle',
            label: 'Auto-Hide Library',
            tippy: 'Automatically hides the library panel when the cursor is not over it.',
            isChecked: library.autoHide,
            onChange: (autoHide) => state.setLibrary({ autoHide }),
          },
          {
            id: 'floating-sensitivity',
            type: 'Input',
            label: 'Hover Activation Width',
            visible: () => library.autoHide,
            tippy: 'Width (in pixels) from the left edge where hovering shows the library.',
            inputType: 'number',
            value: library.hoverTargetSize,
            validation: (value) => LibraryStateSchema.shape.hoverTargetSize.safeParse(value),
            onChange: (hoverTargetSize) => state.setLibrary({ hoverTargetSize }),
          },
        ],
      },
      {
        id: 'global-nav',
        groupName: 'Global Nav (Top-bar)',
        components: [
          {
            id: 'floating',
            type: 'Toggle',
            label: 'Enable Floating Navbar',
            tippy: 'Allows the top navigation bar to float above the content.',
            isChecked: globalNav.floating,
            onChange: (floating) => state.setGlobalNav({ floating }),
          },
          {
            id: 'auto-hide',
            type: 'Toggle',
            label: 'Auto-Hide Navbar',
            tippy: 'Hides the navbar when not hovered. Requires floating mode and non-Windows OS.',
            visible: () => globalNav.floating && !isWindows(),
            isChecked: globalNav.autoHide,
            onChange: (autoHide) => state.setGlobalNav({ autoHide }),
          },
          {
            id: 'floating-sensitivity',
            type: 'Input',
            label: 'Hover Activation Height',
            visible: () => globalNav.floating && !isWindows(),
            tippy: 'Height (in pixels) from the top edge where hovering shows the navbar.',
            inputType: 'number',
            value: globalNav.hoverTargetSize,
            validation: (value) => GlobalNavStateSchema.shape.hoverTargetSize.safeParse(value),
            onChange: (hoverTargetSize) => state.setGlobalNav({ hoverTargetSize }),
          },
        ],
      },
      {
        id: 'fonts',
        groupName: 'Typography',
        components: [
          {
            id: 'bodyFont',
            type: 'Font',
            label: 'Body Font',
            tippy: 'Font used for general UI text.',
            value: uiPreferences.bodyFont.family,
            onChange: (font) =>
              state.setUIPreferences({
                bodyFont: {
                  family: font.family,
                  variants: font.variants,
                },
              }),
          },
          {
            id: 'titleFont',
            type: 'Font',
            label: 'Heading Font',
            tippy: 'Font used for titles and section headings.',
            value: uiPreferences.titleFont.family,
            onChange: (font) =>
              state.setUIPreferences({
                titleFont: {
                  family: font.family,
                  variants: font.variants,
                },
              }),
          },
        ],
      },
      {
        id: 'border',
        groupName: 'Borders',
        components: [
          {
            id: 'thickness',
            type: 'Input',
            label: 'Border Thickness',
            tippy: 'Width of borders in pixels.',
            inputType: 'number',
            value: uiPreferences.border.thickness,
            validation: (value) => BorderStateSchema.shape.thickness.safeParse(value),
            onChange: (thickness) => state.setBorder({ thickness }),
          },
          {
            id: 'color',
            type: 'Color',
            label: 'Border Color',
            tippy: 'Color used for all borders.',
            color: uiPreferences.border.color,
            initialColor: DEFAULT_STATE.uiPreferences.border.color,
            onChangeComplete: (color) => state.setBorder({ color }),
          },
          {
            id: 'h-color',
            type: 'Color',
            label: 'Hover Border Color',
            tippy: 'Color shown when borders are hovered.',
            color: uiPreferences.border.hoverColor,
            initialColor: DEFAULT_STATE.uiPreferences.border.hoverColor,
            onChangeComplete: (hoverColor) => state.setBorder({ hoverColor }),
          },
          {
            id: 'style',
            type: 'Dropdown',
            label: 'Border Style',
            tippy: 'Visual appearance of borders.',
            value: uiPreferences.border.style,
            options: [
              ['None', 'none'],
              ['Dotted', 'dotted'],
              ['Dashed', 'dashed'],
              ['Solid', 'solid'],
              ['Double', 'double'],
              ['Groove', 'groove'],
              ['Ridge', 'ridge'],
              ['Inset', 'inset'],
              ['Outset', 'outset'],
            ],
            onChange: (style) => state.setBorder({ style }),
          },
        ],
      },
      {
        id: 'misc',
        groupName: 'Miscellaneous',
        components: [
          {
            id: 'disable-tippy',
            type: 'Toggle',
            label: 'Disable Tooltip',
            tippy: (
              <div>
                Disable Tooltip shown <br />
                Recommended as tooltip might cause performance issues. <br />
                NOTE: Does not remote tooltips from Spotify
              </div>
            ),
            isChecked: state.disableTippy,
            onChange: (disableTippy) => state.setDisableTippy(disableTippy),
          },
        ],
      },
    ],
  } satisfies SectionProps;
};
