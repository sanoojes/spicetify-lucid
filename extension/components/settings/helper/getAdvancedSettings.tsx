import type { SectionProps } from '@app/types/settingSchema.ts';
import { AppStateSchema } from '@schemas/appStoreSchema.ts';
import type appStore from '@store/appStore.ts';
import { copyToClipboard } from '@utils/dom/copyToClipboard.ts';
import resetTheme from '@utils/resetTheme.ts';
import { showNotification } from '@utils/showNotification.tsx';

export const getAdvancedSettings = (state: ReturnType<typeof appStore.getState>): SectionProps =>
  ({
    id: 'advanced-settings',
    sectionName: 'Advanced',
    groups: [
      {
        id: 'advanced-actions',
        components: [
          //           {
          //             id: 'disable-analytics',
          //             type: 'Toggle',
          //             label: 'Analytics',
          //             tippy: (
          //               <div style={{ whiteSpace: 'pre-line' }}>
          //                 {`Don't be a ghost 👻!
          // Keep this on to let others know you're here
          // and help boost the live user count.
          // Every user counts - literally!`}
          //               </div>
          //             ),
          //             isChecked: state.isAnalyticsActive,
          //             onChange: (isAnalyticsActive) => state.setIsAnalyticsActive(isAnalyticsActive),
          //           },
          {
            id: 'export-settings',
            type: 'Button',
            variant: 'primary',
            label: 'Export Configuration',
            tippy: 'Copy all settings as JSON.',
            buttonText: 'Copy',
            onClick: () => {
              const config = state.exportConfig();
              if (!config) {
                showNotification({
                  id: 'export-error',
                  message: 'Failed to export configuration.',
                  isError: true,
                });
                return;
              }
              copyToClipboard(config, 'Settings copied to clipboard!');
            },
          },
          {
            id: 'import-settings',
            type: 'Input',
            label: 'Import Configuration',
            tippy: 'Paste valid JSON to import settings.',
            inputType: 'text',
            placeholder: 'Paste JSON here...',
            textArea: true,
            onChange: (value) => {
              try {
                const parsed = JSON.parse(value);
                const result = AppStateSchema.safeParse(parsed);

                if (result.success) {
                  state.importConfig(result.data);
                  showNotification({
                    id: 'import-success',
                    message: 'Settings imported successfully!',
                  });
                } else {
                  const errorMessages = result.error.issues
                    .map((issue) => `• ${issue.path.join('.') || 'root'}: ${issue.message}`)
                    .join('\n');

                  showNotification({
                    id: 'import-invalid',
                    message: (
                      <div>
                        <strong>Invalid configuration:</strong>
                        <pre style={{ marginTop: 4 }}>{errorMessages}</pre>
                      </div>
                    ),
                    isError: true,
                  });
                }
              } catch {
                showNotification({
                  id: 'import-parse-error',
                  message: 'Error parsing JSON input.',
                  isError: true,
                });
              }
            },
          },
          {
            id: 'reset-store',
            type: 'Button',
            variant: 'danger',
            label: 'Reset Theme',
            tippy: 'Restore theme settings to default.',
            buttonText: 'Reset',
            onClick: () => {
              resetTheme();
              showNotification({
                id: 'theme-reset',
                message: 'Theme reset to default.',
              });
            },
          },
        ],
      },
    ],
  }) satisfies SectionProps;
