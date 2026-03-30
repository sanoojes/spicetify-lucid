import UI from "@/components/ui";
import { Search16Filled } from "@fluentui/react-icons";
import { useMemo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

type ListProps<T> = {
  items: T[];
  itemSize: number;
  className?: string;
  inputPlaceholder?: string;
  filterFn?: (item: T, filter: string) => boolean;
  renderItem: (item: T, index: number, isSelected: boolean) => React.ReactNode;
  selectedItem?: T | null;
  headerContent?: React.ReactNode;
  onItemSelect?: (item: T) => void;
};

const List = <T,>({
  items,
  itemSize,
  inputPlaceholder,
  className = "List",
  filterFn,
  renderItem,
  headerContent,
  selectedItem,
  onItemSelect,
}: ListProps<T>) => {
  const [filter, setFilter] = useState("");
  const filteredItems = useMemo(() => {
    if (!filter) return items;
    return filterFn ? items.filter((item) => filterFn(item, filter)) : items;
  }, [filter, items, filterFn]);

  const selectedIndex = useMemo(() => {
    return selectedItem ? filteredItems.findIndex((item) => item === selectedItem) : null;
  }, [filteredItems, selectedItem]);

  const handleItemClick = (index: number) => {
    onItemSelect?.(filteredItems[index]);
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <UI.Input
          inputType="text"
          placeholder={inputPlaceholder ?? "Filter items..."}
          value={filter}
          onChange={setFilter}
          icon={<Search16Filled />}
        />
        {headerContent && <div className="header-extra">{headerContent}</div>}
      </div>
      <div className="list-wrapper">
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              className={className}
              height={height}
              width={width}
              itemSize={itemSize}
              itemCount={filteredItems.length}
              itemData={{
                items: filteredItems,
                selectedIndex,
                handleItemClick,
                renderItem,
              }}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

const Row: React.FC<{
  index: number;
  style: React.CSSProperties;
  data: {
    items: any[];
    selectedIndex: number | null;
    handleItemClick: (index: number) => void;
    renderItem: (item: any, index: number, isSelected: boolean) => React.ReactNode;
  };
}> = ({ index, style, data }) => {
  const item = data.items[index];
  const isSelected = index === data.selectedIndex;

  return (
    <div style={style} onClick={() => data.handleItemClick(index)}>
      {data.renderItem(item, index, isSelected)}
    </div>
  );
};

export default List;
