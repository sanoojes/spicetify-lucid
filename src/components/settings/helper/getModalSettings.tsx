import type { SectionProps } from '@/types/settingSchema.ts';
import type appStore from '@/store/appStore.ts';

export const getModalSettings = (state: ReturnType<typeof appStore.getState>): SectionProps => {
  const { settingModal } = state;

  return {
    id: 'modal-settings',
    sectionName: 'Modal Settings',
    groups: [
      {
        id: 'setting-modal',
        groupName: 'Modal',
        components: [
          {
            id: 'modal-position',
            type: 'Dropdown',
            label: 'Settings Access Position',
            value: settingModal.accessPoint,
            options: [
              ['Menu', 'menu'],
              ['Navigation', 'nav'],
            ],
            onChange: (accessPoint) => state.setSettingModal({ accessPoint }),
            tippy: 'Select where the settings button should appear in the interface.',
          },
          {
            id: 'is-floating',
            type: 'Toggle',
            label: 'Floating Modal',
            isChecked: settingModal.isFloating,
            onChange: (isFloating) => state.setSettingModal({ isFloating }),
            tippy: 'Allows the settings modal to float and be repositioned by dragging.',
          },
        ],
      },
    ],
  } satisfies SectionProps;
};
