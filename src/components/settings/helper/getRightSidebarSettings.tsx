import type { SectionProps } from "@/types/settingSchema.ts";
import { RightSidebarStateSchema } from "@/schemas/appStoreSchema.ts";
import CSSFilterSchema from "@/schemas/cssFilterSchema.ts";
import type appStore from "@/store/appStore.ts";

export const getRightSidebarSettings = (
  state: ReturnType<typeof appStore.getState>,
): SectionProps => {
  const { rightSidebar } = state;

  return {
    id: "right-sidebar",
    sectionName: "Right Sidebar",
    groups: [
      {
        id: "right-sidebar",
        groupName: "Right Sidebar",
        components: [
          {
            id: "mode",
            type: "Dropdown",
            label: "Sidebar Display Mode",
            options: [
              ["Default", "default"],
              ["Compact", "compact"],
            ],
            value: rightSidebar.mode,
            onChange: (mode) => state.setRightSidebar({ mode }),
          },
          {
            id: "pos-x",
            type: "Dropdown",
            label: "Horizontal Position",
            options: [
              ["Left", "left"],
              ["Right", "right"],
            ],
            visible: () => rightSidebar.mode === "compact",
            value: rightSidebar.positionX,
            onChange: (positionX) => state.setRightSidebar({ positionX }),
          },
          {
            id: "pos-y",
            type: "Dropdown",
            label: "Vertical Position",
            options: [
              ["Top", "top"],
              ["Bottom", "bottom"],
            ],
            visible: () => rightSidebar.mode === "compact",
            value: rightSidebar.positionY,
            onChange: (positionY) => state.setRightSidebar({ positionY }),
          },
          {
            id: "auto-hide",
            type: "Toggle",
            label: "Floating Sidebar",
            tippy: "Hides the sidebar when not hovered.",
            visible: () => rightSidebar.mode === "default",
            isChecked: rightSidebar.autoHide,
            onChange: (autoHide) => state.setRightSidebar({ autoHide }),
          },
          {
            id: "floating-sensitivity",
            type: "Input",
            label: "Hover Activation Width",
            visible: () => rightSidebar.autoHide,
            tippy: "Width (in pixels) from the right edge where hovering shows the sidebar.",
            inputType: "number",
            value: rightSidebar.hoverTargetSize,
            validation: (value) => RightSidebarStateSchema.shape.hoverTargetSize.safeParse(value),
            onChange: (hoverTargetSize) => state.setRightSidebar({ hoverTargetSize }),
          },
          {
            id: "compact-size",
            type: "Input",
            label: "Compact Width",
            visible: () => rightSidebar.mode === "compact",
            inputType: "number",
            value: rightSidebar.compactSize,
            validation: (v) => RightSidebarStateSchema.shape.compactSize.safeParse(v),
            onChange: (compactSize) => state.setRightSidebar({ compactSize }),
          },
        ],
      },
      {
        id: "compact-filters",
        groupName: "Compact Sidebar Filters",
        visible: () => rightSidebar.mode === "compact",
        components: [
          {
            id: "blur",
            type: "Input",
            label: "Blur",
            inputType: "number",
            value: rightSidebar.compactBackdropFilter.blur,
            validation: (v) => CSSFilterSchema.shape.blur.safeParse(v),
            onChange: (blur) => state.setRightSidebarCompactBlur({ blur }),
          },
          {
            id: "brightness",
            type: "Input",
            label: "Brightness",
            inputType: "number",
            value: rightSidebar.compactBackdropFilter.brightness,
            validation: (v) => CSSFilterSchema.shape.brightness.safeParse(v),
            onChange: (brightness) => state.setRightSidebarCompactBlur({ brightness }),
          },
          {
            id: "contrast",
            type: "Input",
            label: "Contrast",
            inputType: "number",
            value: rightSidebar.compactBackdropFilter.contrast,
            validation: (v) => CSSFilterSchema.shape.contrast.safeParse(v),
            onChange: (contrast) => state.setRightSidebarCompactBlur({ contrast }),
          },
          {
            id: "saturation",
            type: "Input",
            label: "Saturation",
            inputType: "number",
            value: rightSidebar.compactBackdropFilter.saturation,
            validation: (v) => CSSFilterSchema.shape.saturation.safeParse(v),
            onChange: (saturation) => state.setRightSidebarCompactBlur({ saturation }),
          },
          {
            id: "opacity",
            type: "Input",
            label: "Opacity",
            inputType: "number",
            value: rightSidebar.compactBackdropFilter.opacity,
            validation: (v) => CSSFilterSchema.shape.opacity.safeParse(v),
            onChange: (opacity) => state.setRightSidebarCompactBlur({ opacity }),
          },
        ],
      },
    ],
  } satisfies SectionProps;
};
