import type { GroupProps } from "@/types/settingSchema.ts";
import Row from "@/components/settings/ui/Row.tsx";

const Group: React.FC<GroupProps> = ({ groupName, components, visible }) => {
  const isVisible = visible ? visible() : true;
  return (
    <div className={`x-settings-section ${!isVisible ? " hidden" : ""}`}>
      {groupName ? (
        <h3 className="e-9890-text encore-text-body-medium-bold encore-internal-color-text-base">
          {groupName}
        </h3>
      ) : null}
      {components.map((v) => (
        <Row data={v} key={v.id} />
      ))}
    </div>
  );
};

export default Group;
