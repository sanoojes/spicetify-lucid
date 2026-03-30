import type { ToggleProps } from "@/types/uiSchema.ts";

const Toggle: React.FC<ToggleProps> = ({ isChecked, onChange }) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.checked;
    onChange?.(value);
  };

  return (
    <label className="x-toggle-wrapper">
      <input
        aria-label="A Toggle"
        className="x-toggle-input"
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
      />
      <span className="x-toggle-indicatorWrapper">
        <span className="x-toggle-indicator"></span>
      </span>
    </label>
  );
};

export default Toggle;
