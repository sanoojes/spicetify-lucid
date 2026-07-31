import type { SectionProps } from "@/types/settingSchema.ts";
import type appStore from "@/store/appStore.ts";
import { DEFAULT_STATE } from "@/store/appStore.ts";
import { showNotification } from "@/utils/showNotification.tsx";

export const getColorSettings = (state: ReturnType<typeof appStore.getState>): SectionProps => {
  const { color } = state;

  return {
    id: "color-settings",
    sectionName: "Colors",
    groups: [
      {
        id: "color-mode",
        components: [
          {
            id: "color-mode",
            type: "Dropdown",
            label: "Color Theme",
            tippy: (
              <div>
                <p>
                  <strong>Default:</strong> Uses the app’s default theme colors.
                </p>
                <p>
                  <strong>Dynamic:</strong> Automatically adapts to media artwork.
                </p>
                <p>
                  <strong>Custom:</strong> Pick your own accent color.
                </p>
              </div>
            ),
            value: color.mode,
            options: [
              ["Default", "default"],
              ["Dynamic", "dynamic"],
              ["Custom", "custom"],
            ],
            onChange: (mode) => state.setColor({ mode }),
          },
          {
            id: "scheme-variant",
            type: "Dropdown",
            label: "Color Scheme Style",
            tippy: (
              <div>
                <p>
                  <strong>Tonal Spot:</strong> Standard Material 3 design (softer, pastel).
                </p>
                <p>
                  <strong>Fidelity:</strong> Stays highly accurate to the original input/artwork
                  color.
                </p>
                <p>
                  <strong>Vibrant:</strong> Boosts saturation for a punchier, colorful look.
                </p>
                <p>
                  <strong>Monochrome:</strong> Grayscale appearance with zero color saturation.
                </p>
              </div>
            ),
            value: color.schemeVariant ?? "tonalSpot",
            options: [
              ["Tonal Spot (Default)", "tonalSpot"],
              ["Fidelity (Accurate)", "fidelity"],
              ["Vibrant", "vibrant"],
              ["Expressive", "expressive"],
              ["Neutral", "neutral"],
              ["Monochrome", "monochrome"],
              ["Content", "content"],
            ],
            onChange: (schemeVariant) => state.setColor({ schemeVariant }),
          },
          {
            id: "is-dark",
            type: "Toggle",
            label: "Enable Light Mode (Experimental)",
            tippy: "Light mode is in development. Feedback and ideas are welcome!",
            isChecked: !color.isDark,
            onChange: (isDark) => state.setColor({ isDark: !isDark }),
          },
          {
            id: "is-tinted",
            type: "Toggle",
            label: "Enable UI Tinting",
            tippy: "Applies a soft tint of your chosen accent color to the UI.",
            isChecked: color.isTinted,
            onChange: (isTinted) => state.setColor({ isTinted }),
          },
          {
            id: "set-color",
            type: "Color",
            label: "Select Accent Color",
            tippy: "Choose your preferred accent color.",
            color: color.accentColor,
            initialColor: DEFAULT_STATE.color.accentColor,
            hideAlpha: true,
            visible: () => color.mode === "custom",
            onChangeComplete: (accentColor) => {
              state.setColor({ accentColor });
              setTimeout(() =>
                showNotification({ message: "Accent color updated.", id: "accent-update-noti" }),
              );
            },
          },
        ],
      },
    ],
  } satisfies SectionProps;
};
