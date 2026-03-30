import type { SectionProps } from '@/types/settingSchema.ts';
import { getAdvancedSettings } from '@/components/settings/helper/getAdvancedSettings.tsx';
import { getBackgroundSettings } from '@/components/settings/helper/getBackgroundSettings.tsx';
import { getColorSettings } from '@/components/settings/helper/getColorSettings.tsx';
import { getModalSettings } from '@/components/settings/helper/getModalSettings.tsx';
import { getPlayerNextCard } from '@/components/settings/helper/getPlayerNextCard.tsx';
import { getPlayerSettings } from '@/components/settings/helper/getPlayerSettings.tsx';
import { getRightSidebarSettings } from '@/components/settings/helper/getRightSidebarSettings.tsx';
import { getUISettings } from '@/components/settings/helper/getUISettings.tsx';
import { getUnderMainViewSettings } from '@/components/settings/helper/getUnderMainViewSettings.tsx';
import appStore from '@/store/appStore.ts';

export default function getSettingsSections(state = appStore.getState()): SectionProps[] {
  return [
    getModalSettings(state),
    getBackgroundSettings(state),
    getUISettings(state),
    getRightSidebarSettings(state),
    getColorSettings(state),
    getPlayerNextCard(state),
    getPlayerSettings(state),
    getUnderMainViewSettings(state),
    getAdvancedSettings(state),
  ];
}
