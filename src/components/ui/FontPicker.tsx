import type { FontPickerProps } from '@/types/uiSchema.ts';
import UI from '@/components/ui';
import { CheckboxChecked16Filled, CheckboxUnchecked16Filled } from '@fluentui/react-icons';
import { fetchGoogleFonts, type GoogleFont, loadFont } from '@/utils/font.ts';
import { showNotification } from '@/utils/showNotification.tsx';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

const FontPicker: React.FC<FontPickerProps> = ({ value, onChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [selectedFont, setSelectedFont] = useState<GoogleFont | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error?.message) {
      showNotification({ message: error.message, id: 'font-picker-notify' });
    }
  }, [error]);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        setIsLoading(true);
        const fetchedFonts = await fetchGoogleFonts();
        setFonts(fetchedFonts);
        const font = fetchedFonts.find((f) => f.family === value);
        if (font) {
          setSelectedFont(font);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load fonts'));
        console.error('Error loading fonts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFonts();
  }, [value]);

  const handleFontClick = useCallback(
    (font: GoogleFont) => {
      setSelectedFont(font);
      onChange?.(font);
    },
    [onChange]
  );

  const categories = useMemo(() => {
    const unique = new Set(fonts.map((f) => f.category));
    return Array.from(unique).sort();
  }, [fonts]);

  const categoryOptions = useMemo(
    () =>
      [['All', 'all'], ...categories.map((cat) => [cat[0].toUpperCase() + cat.slice(1), cat])] as [
        string,
        string,
      ][],
    [categories]
  );

  const filteredFonts = useMemo(() => {
    return selectedCategory === 'all'
      ? fonts
      : fonts.filter((font) => font.category === selectedCategory);
  }, [fonts, selectedCategory]);

  return (
    <UI.Dropdown>
      <UI.Dropdown.Button>{selectedFont?.family || 'Open Font Picker'}</UI.Dropdown.Button>
      <UI.Dropdown.Content>
        {isLoading ? (
          <UI.Loader />
        ) : (
          <UI.List
            items={filteredFonts}
            itemSize={54}
            inputPlaceholder="Search Fonts..."
            filterFn={(font, search) => font.family.toLowerCase().includes(search.toLowerCase())}
            renderItem={(font: GoogleFont, _: number, isSelected: boolean) => (
              <FontItem font={font} isSelected={isSelected} />
            )}
            headerContent={
              <UI.DropdownAction
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categoryOptions}
              />
            }
            onItemSelect={handleFontClick}
            selectedItem={selectedFont}
          />
        )}
      </UI.Dropdown.Content>
    </UI.Dropdown>
  );
};

export default FontPicker;

const FontItem: React.FC<{ font: GoogleFont; isSelected: boolean }> = memo(
  ({ font, isSelected }) => {
    const [isFontLoaded, setIsFontLoaded] = useState(false);

    useEffect(() => {
      if (!isFontLoaded) {
        loadFont(font.family)
          .then(() => setIsFontLoaded(true))
          .catch((error) => console.error('Failed to load font:', error));
      }
    }, [isFontLoaded, font.family]);

    return (
      <div className={`font-item ${isSelected ? 'selected' : ''}`}>
        <div className={`font-item-firstColumn`}>
          {isSelected ? <CheckboxChecked16Filled /> : <CheckboxUnchecked16Filled />}
        </div>
        <div className="font-item-secondColumn">
          <span className="font-family">{font.family}</span>
          <span
            className="font-preview"
            style={{
              opacity: isFontLoaded ? 1 : 0,
              fontFamily: isFontLoaded ? font.family : 'system-ui',
            }}
          >
            The quick brown fox
          </span>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.font.family === nextProps.font.family && prevProps.isSelected === nextProps.isSelected
);
