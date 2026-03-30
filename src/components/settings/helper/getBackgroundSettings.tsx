import type { SectionProps } from "@/types/settingSchema.ts";
import CSSFilterSchema from "@/schemas/cssFilterSchema.ts";
import type appStore from "@/store/appStore.ts";
import { DEFAULT_STATE } from "@/store/appStore.ts";
import z from "zod";

export const getBackgroundSettings = (
  state: ReturnType<typeof appStore.getState>,
): SectionProps => {
  const { bg } = state;
  const { mode: bgMode, options: bgOptions } = bg;
  const { filter: bgFilter, imageMode } = bgOptions;

  return {
    id: "background-settings",
    sectionName: "Background",
    groups: [
      {
        id: "background-mode",
        groupName: "Mode",
        components: [
          {
            id: "mode",
            type: "Dropdown",
            label: "Background Style",
            value: bgMode,
            options: [
              ["Static Image", "static"],
              ["Animated", "animated"],
              ["Solid Color", "solid"],
            ],
            onChange: (mode) => state.setBg({ mode }),
          },
        ],
      },
      {
        id: "bg-animated",
        visible: () => bgMode === "animated",
        components: [
          {
            id: "auto-stop-anim",
            type: "Toggle",
            label: "Pause When Inactive",
            tippy: "Stops animation when Spotify is not the active window.",
            isChecked: bgOptions.autoStopAnimation,
            onChange: (autoStopAnimation) => state.setBgOptions({ autoStopAnimation }),
          },
        ],
      },
      {
        id: "background-color",
        groupName: "Solid Color Settings",
        visible: () => bgMode === "solid",
        components: [
          {
            id: "color",
            type: "Color",
            label: "Select Background Color",
            tippy: "Pick a solid color for the background.",
            color: bgOptions.color,
            initialColor: DEFAULT_STATE.bg.options.color,
            onChange: (color) => state.setBgOptions({ color }),
          },
        ],
      },
      {
        id: "background-image",
        groupName: "Image Settings",
        visible: () => bgMode !== "solid",
        components: [
          {
            id: "img-mode",
            type: "Dropdown",
            label: "Image Source",
            value: imageMode,
            options: [
              ["Now Playing Track", "player"],
              ["Page Cover Art", "page"],
              ["Custom Image URL", "custom"],
            ],
            onChange: (imageMode) => state.setBgOptions({ imageMode }),
          },
          {
            id: "img-src",
            type: "Input",
            label: "Custom Image URL",
            inputType: "text",
            value: bgOptions.imageSrc ?? undefined,
            placeholder: "Paste your image URL here...",
            visible: () => imageMode === "custom",
            validation: (value) => z.url({ error: "Invalid URL" }).safeParse(value),
            onChange: (imageSrc) => state.setBgOptions({ imageSrc }),
          },
        ],
      },
      {
        id: "background-filter",
        groupName: "Filters",
        visible: () => bgMode !== "solid",
        components: [
          {
            id: "blur",
            type: "Input",
            label: "Blur",
            inputType: "number",
            value: bgFilter.blur,
            validation: (value) => CSSFilterSchema.shape.blur.safeParse(value),
            onChange: (blur) => state.setBgFilter({ blur }),
          },
          {
            id: "brightness",
            type: "Input",
            label: "Brightness",
            inputType: "number",
            value: bgFilter.brightness,
            validation: (value) => CSSFilterSchema.shape.brightness.safeParse(value),
            onChange: (brightness) => state.setBgFilter({ brightness }),
          },
          {
            id: "contrast",
            type: "Input",
            label: "Contrast",
            inputType: "number",
            value: bgFilter.contrast,
            validation: (value) => CSSFilterSchema.shape.contrast.safeParse(value),
            onChange: (contrast) => state.setBgFilter({ contrast }),
          },
          {
            id: "saturate",
            type: "Input",
            label: "Saturation",
            inputType: "number",
            value: bgFilter.saturation,
            validation: (value) => CSSFilterSchema.shape.saturation.safeParse(value),
            onChange: (saturation) => state.setBgFilter({ saturation }),
          },
          {
            id: "opacity",
            type: "Input",
            label: "Opacity",
            inputType: "number",
            value: bgFilter.opacity,
            validation: (value) => CSSFilterSchema.shape.opacity.safeParse(value),
            onChange: (opacity) => state.setBgFilter({ opacity }),
          },
        ],
      },
    ],
  } satisfies SectionProps;
};
