import type { SectionProps } from "@/types/settingSchema.ts";
import CSSFilterSchema from "@/schemas/cssFilterSchema.ts";
import type appStore from "@/store/appStore.ts";
import { DEFAULT_STATE } from "@/store/appStore.ts";
import React from "react";
import z from "zod";

export const getUnderMainViewSettings = (
  state: ReturnType<typeof appStore.getState>,
): SectionProps => {
  const { filter, type, isScrolling, isScaling, customUrl, customColor } = state.umv;

  return {
    id: "umv-settings",
    sectionName: "Under Main View",
    groups: [
      {
        id: "type",
        groupName: "Background Style",
        components: [
          {
            id: "type",
            type: "Dropdown",
            label: "Background Style",
            value: type,
            options: [
              ["Default", "default"],
              ["Now Playing Artwork", "playing"],
              ["Custom Color", "custom-color"],
              ["Custom Image or GIF", "custom-img"],
              ["Hidden", "none"],
            ],
            onChange: (selectedType) => state.setUMV({ type: selectedType }),
            tippy: (
              <div>
                <p>
                  <strong>Default:</strong> Uses playlist or page cover.
                </p>
                <p>
                  <strong>Now Playing:</strong> Shows current track artwork.
                </p>
                <p>
                  <strong>Custom Color:</strong> Use your own background color.
                </p>
                <p>
                  <strong>Custom Image or GIF:</strong> Provide a URL to display a static or
                  animated image.
                </p>
                <p>
                  <strong>Hidden:</strong> Disables the background.
                </p>
              </div>
            ),
          },
        ],
      },
      {
        id: "toggles",
        groupName: "Behavior",
        visible: () => type !== "none",
        components: [
          {
            id: "is-scrolling",
            type: "Toggle",
            label: "Enable Scrolling Effect",
            tippy: "Add scrolling effect. May cause performance issues.",
            isChecked: isScrolling,
            onChange: (isScrolling) => state.setUMV({ isScrolling }),
          },
          {
            id: "is-scaling",
            type: "Toggle",
            label: "Enable Scaling Effect",
            visible: () => type !== "custom-color",
            tippy: "Applies a zoom-in/out effect to the background.",
            isChecked: isScaling,
            onChange: (isScaling) => state.setUMV({ isScaling }),
          },
        ],
      },
      {
        id: "custom-url",
        groupName: "Custom Image",
        visible: () => type === "custom-img",
        components: [
          {
            id: "custom-url",
            type: "Input",
            label: "Image or GIF URL",
            inputType: "text",
            placeholder: "Paste a direct image/GIF URL...",
            value: customUrl,
            validation: (val) => z.url({ error: "Invalid URL" }).safeParse(val).success,
            onChange: (url) => state.setUMV({ customUrl: url }),
          },
        ],
      },
      {
        id: "custom-color",
        groupName: "Custom Color",
        visible: () => type === "custom-color",
        components: [
          {
            id: "color",
            type: "Color",
            label: "Background Color",
            tippy: "Select a HEX color for the background.",
            color: customColor,
            initialColor: DEFAULT_STATE.umv.customColor,
            onChange: (customColor) => state.setUMV({ customColor }),
          },
        ],
      },
      {
        id: "filter",
        groupName: "Filters",
        visible: () => !(type === "none" || type === "custom-color"),
        components: [
          {
            id: "blur",
            type: "Input",
            label: "Blur Amount",
            inputType: "number",
            value: filter.blur,
            validation: (val) => CSSFilterSchema.shape.blur.safeParse(val),
            onChange: (blur) => state.setUMVFilter({ blur }),
          },
          {
            id: "brightness",
            type: "Input",
            label: "Brightness",
            inputType: "number",
            value: filter.brightness,
            validation: (val) => CSSFilterSchema.shape.brightness.safeParse(val),
            onChange: (brightness) => state.setUMVFilter({ brightness }),
          },
          {
            id: "contrast",
            type: "Input",
            label: "Contrast",
            inputType: "number",
            value: filter.contrast,
            validation: (val) => CSSFilterSchema.shape.contrast.safeParse(val),
            onChange: (contrast) => state.setUMVFilter({ contrast }),
          },
          {
            id: "saturation",
            type: "Input",
            label: "Saturation",
            inputType: "number",
            value: filter.saturation,
            validation: (val) => CSSFilterSchema.shape.saturation.safeParse(val),
            onChange: (saturation) => state.setUMVFilter({ saturation }),
          },
          {
            id: "opacity",
            type: "Input",
            label: "Opacity",
            inputType: "number",
            value: filter.opacity,
            validation: (val) => CSSFilterSchema.shape.opacity.safeParse(val),
            onChange: (opacity) => state.setUMVFilter({ opacity }),
          },
        ],
      },
    ],
  } satisfies SectionProps;
};
