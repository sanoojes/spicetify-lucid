import type { DropdownProps } from "@/types/uiSchema.ts";
import Dropdown from "@/components/ui/Dropdown.tsx";

const DropdownAction: React.FC<DropdownProps> = ({ value, onChange, options }) => {
  const selectedLabel = options.find(([, val]) => val === value)?.[0] ?? "Select";

  return (
    <Dropdown>
      <Dropdown.Button>{selectedLabel}</Dropdown.Button>
      <Dropdown.Content>
        <Dropdown.List>
          {options.map(([label, val]) => (
            <Dropdown.Item key={val} onClick={() => onChange(val)}>
              {label}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Content>
    </Dropdown>
  );
};

export default DropdownAction;
