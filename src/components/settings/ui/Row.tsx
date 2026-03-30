import type { Component } from '@/types/settingSchema.ts';
import UI from '@/components/ui';

const Row: React.FC<{ data: Component }> = ({ data }) => {
  const isVisible = data.visible ? data.visible() : true;

  return (
    <div className="x-settings-row" style={{ display: isVisible ? '' : 'none' }}>
      <div className="x-settings-firstColumn">
        <p className="encore-text encore-text-body-small encore-internal-color-text-base">
          {data.label}
        </p>
        {data.tippy ? <UI.Tippy label={data.tippy} hasIcon /> : null}
      </div>
      <div className="x-settings-secondColumn">
        {data.type === 'Dropdown' ? (
          <UI.DropdownAction {...data} />
        ) : data.type === 'Toggle' ? (
          <UI.Toggle {...data} />
        ) : data.type === 'Button' ? (
          <UI.Button {...data} />
        ) : data.type === 'Input' ? (
          data.textArea && data.inputType === 'text' ? (
            <UI.TextArea {...data} />
          ) : (
            <UI.Input {...data} />
          )
        ) : data.type === 'Color' ? (
          <UI.ColorPicker {...data} />
        ) : data.type === 'Font' ? (
          <UI.FontPicker {...data} />
        ) : (
          'Component Not Found'
        )}
      </div>
    </div>
  );
};

export default Row;
