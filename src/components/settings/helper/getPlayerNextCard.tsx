import type { SectionProps } from '@/types/settingSchema.ts';
import { NextSongCardStateSchema } from '@/schemas/appStoreSchema.ts';
import type appStore from '@/store/appStore.ts';

export const getPlayerNextCard = (state: ReturnType<typeof appStore.getState>): SectionProps => {
  const { nextSongCard } = state.player;

  return {
    id: 'next-song-card-settings',
    sectionName: 'Next Song Card',
    groups: [
      {
        id: 'toggle',
        components: [
          {
            id: 'show-card',
            type: 'Toggle',
            label: 'Show Next Song Card',
            tippy:
              'Display a preview of the upcoming song in a small card next to the now playing bar.',
            isChecked: nextSongCard.show,
            onChange: (show) => state.setPlayerNextCard({ show }),
          },
        ],
      },
      {
        id: 'customize',
        groupName: 'Customization',
        visible: () => nextSongCard.show,
        components: [
          {
            id: 'position',
            type: 'Dropdown',
            label: 'Horizontal Position',
            options: [
              ['Left', 'left'],
              ['Right', 'right'],
            ],
            value: nextSongCard.position,
            onChange: (position) => state.setPlayerNextCard({ position }),
          },
          {
            id: 'floating',
            type: 'Toggle',
            label: 'Enable Floating Card',
            tippy: 'Make the now playing card float above the now playing bar.',
            isChecked: nextSongCard.isFloating,
            onChange: (isFloating) => state.setPlayerNextCard({ isFloating }),
          },
          {
            id: 'rm-text',
            type: 'Toggle',
            label: 'Remove Next Up Text',
            tippy: 'Remove the "Next Up" text above the next song card.',
            isChecked: nextSongCard.removeNextUp,
            onChange: (removeNextUp) => state.setPlayerNextCard({ removeNextUp }),
          },
          {
            id: `height`,
            type: 'Input',
            label: 'Card Height (px)',
            inputType: 'number',
            value: nextSongCard.height,
            validation: (v) => NextSongCardStateSchema.shape.height.safeParse(v),
            onChange: (height) => state.setPlayerNextCard({ height }),
          },
          {
            id: `max-width`,
            type: 'Input',
            label: 'Card Max Width (px)',
            inputType: 'number',
            value: nextSongCard.maxWidth,
            validation: (v) => NextSongCardStateSchema.shape.maxWidth.safeParse(v),
            onChange: (maxWidth) => state.setPlayerNextCard({ maxWidth }),
          },
          {
            id: `gap`,
            type: 'Input',
            label: 'Gap between Image and Text (px)',
            inputType: 'number',
            value: nextSongCard.gap,
            validation: (v) => NextSongCardStateSchema.shape.gap.safeParse(v),
            onChange: (gap) => state.setPlayerNextCard({ gap }),
          },
          {
            id: `cover-size`,
            type: 'Input',
            label: 'Cover Size (px)',
            tippy: 'Adjust the size of the next song card cover art.',
            inputType: 'number',
            value: nextSongCard.coverArtSize,
            validation: (v) => NextSongCardStateSchema.shape.coverArtSize.safeParse(v),
            onChange: (coverArtSize) => state.setPlayerNextCard({ coverArtSize }),
          },
          {
            id: `padding-x`,
            type: 'Input',
            label: 'Horizontal Padding (px)',
            tippy: 'Space inside the card on the left and right.',
            inputType: 'number',
            value: nextSongCard.paddingX,
            validation: (v) => NextSongCardStateSchema.shape.paddingX.safeParse(v),
            onChange: (paddingX) => state.setPlayerNextCard({ paddingX }),
          },
          {
            id: `padding-y`,
            type: 'Input',
            label: 'Vertical Padding (px)',
            tippy: 'Space inside the card on the top and bottom.',
            inputType: 'number',
            value: nextSongCard.paddingY,
            validation: (v) => NextSongCardStateSchema.shape.paddingY.safeParse(v),
            onChange: (paddingY) => state.setPlayerNextCard({ paddingY }),
          },
        ],
      },
    ],
  } satisfies SectionProps;
};
