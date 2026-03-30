import type { ColorPickerProps } from "@/types/uiSchema.ts";
import UI from "@/components/ui";
import { ArrowResetRegular, Dismiss16Filled } from "@fluentui/react-icons";
import getContrastColor from "@/utils/colors/getContrastColor.ts";
import setFloating from "@/utils/dom/setFloating.ts";
import { showNotification } from "@/utils/showNotification.tsx";
import { useEffect, useRef, useState } from "react";
import { ColorPicker as CP, useColor } from "react-color-palette";
import ReactDOM from "react-dom";

const resolveCssVariable = (cssVar: string): string | null => {
  const match = cssVar.match(/var\((--[^)]+)\)/);
  return match
    ? getComputedStyle(document.documentElement).getPropertyValue(match[1])?.trim() || null
    : null;
};

const isCssVar = (val?: string) => val?.startsWith("var(");
const getResolvedColor = (val: string) =>
  isCssVar(val) ? (resolveCssVariable(val) ?? "#000000") : (val ?? "#000000");

const ColorPickerPortal: React.FC<ColorPickerProps> = ({
  color,
  initialColor,
  onChange,
  onChangeComplete,
  hideAlpha,
}) => {
  const [currentColor, setCurrentColor] = useColor(getResolvedColor(color));
  const [isOpen, setIsOpen] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const resetToDefaultColor = () => {
    if (!initialColor) return;
    onChange?.(initialColor);
    onChangeComplete?.(initialColor);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen || !portalRef.current || !headerRef.current) return;

    const pickerElement = portalRef.current;
    const headerElement = headerRef.current;

    let cleanup: (() => void) | undefined;

    requestAnimationFrame(() => {
      const { width, height } = pickerElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const centerX = (viewportWidth - width) / 2;
      const centerY = (viewportHeight - height) / 2;

      cleanup = setFloating({
        target: pickerElement,
        dragTarget: headerElement,
        defaultPosition: {
          x: Math.max(centerX, 0),
          y: Math.max(centerY, 0),
        },
      });
    });

    return () => {
      cleanup?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (portalRef.current && !portalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const resetButton = initialColor ? (
    <UI.Tippy hasIcon={false} label="Reset Color">
      <UI.Button variant="icon" onClick={resetToDefaultColor}>
        <ArrowResetRegular />
      </UI.Button>
    </UI.Tippy>
  ) : null;

  const picker = (
    <div ref={portalRef} className="rcp-portal main-embedWidgetGenerator-container">
      <div ref={headerRef} className="rcp-portal-header">
        <h3 className="encore-text">Color Picker</h3>
        <div className="btn-wrapper">
          {resetButton}
          <UI.Tippy hasIcon={false} label="Close Color Picker">
            <UI.Button variant="icon" onClick={() => setIsOpen(false)}>
              <Dismiss16Filled />
            </UI.Button>
          </UI.Tippy>
        </div>
      </div>

      <CP
        color={currentColor}
        onChange={(color) => {
          setCurrentColor(color);
          onChange?.(color.hex);
        }}
        onChangeComplete={(color) => {
          showNotification({ message: `Color changed to ${color.hex}`, id: "color-notify" });
          onChangeComplete?.(color.hex);
        }}
        hideAlpha={hideAlpha ?? false}
      />
      <div
        className="rcp-current-color"
        style={{ "--current-color": currentColor.hex } as React.CSSProperties}
      >
        <p
          className="encore-text encore-text-body-small-bold"
          style={{ color: getContrastColor(currentColor.hex) }}
        >
          Preview
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="btn-wrapper">
        <UI.Button onClick={() => setIsOpen(true)}>Open Color Picker</UI.Button>
        {resetButton}
      </div>
      {isOpen ? ReactDOM.createPortal(picker, document.body) : null}
    </>
  );
};

export default ColorPickerPortal;
