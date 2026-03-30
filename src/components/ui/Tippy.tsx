import getOrCreateElement from '@/utils/dom/getOrCreateElement.ts';
import { QuestionCircle20Regular } from '@fluentui/react-icons';
import appStore from '@/store/appStore.ts';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from 'zustand';

type TippyProps = {
  label?: React.ReactNode;
  children?: React.ReactNode;
  hasIcon?: boolean;
  show?: boolean;
};

const tooltipRootId = 'tooltip-root';

const Tippy: React.FC<TippyProps> = ({ label = null, children, hasIcon = false, show = true }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const disableTippy = useStore(appStore, (s) => s.disableTippy);

  useEffect(() => {
    if (disableTippy) return;

    const container = containerRef.current;
    if (!container) return;

    const showTooltip = () => {
      if (disableTippy) return;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX + rect.width / 2,
        });
        setVisible(true);
      }
    };

    const hideTooltip = () => {
      if (disableTippy) return;
      setVisible(false);
    };

    container.addEventListener('mouseenter', showTooltip);
    container.addEventListener('mouseleave', hideTooltip);

    return () => {
      container.removeEventListener('mouseenter', showTooltip);
      container.removeEventListener('mouseleave', hideTooltip);
    };
  }, [disableTippy]);

  return (
    <>
      <div ref={containerRef} style={{ display: show ? 'inline' : 'none' }} data-tippy-container>
        {children}
        {hasIcon && !disableTippy && (
          <div className="tooltip-icon-wrapper">
            <QuestionCircle20Regular />
          </div>
        )}
      </div>

      {!disableTippy &&
        visible &&
        label &&
        createPortal(
          <div
            role="tooltip"
            className="tooltip-content"
            style={{
              top: `${coords.top - 44}px`,
              left: `${coords.left}px`,
            }}
          >
            {label}
          </div>,
          getOrCreateElement('div', tooltipRootId, document.body)
        )}
    </>
  );
};

export default Tippy;
