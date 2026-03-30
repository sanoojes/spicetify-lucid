import type { CSSFilter } from '@/types/appStore.ts';

function serializeFilters(
  filters: CSSFilter,
  options: { skipBlur?: boolean; skipOpacity?: boolean } = {}
): string {
  const { skipBlur = false, skipOpacity = false } = options;
  return [
    !skipBlur && filters?.blur !== undefined ? `blur(${filters.blur}px)` : '',
    filters?.brightness !== undefined ? `brightness(${filters.brightness}%)` : '',
    filters?.contrast !== undefined ? `contrast(${filters.contrast}%)` : '',
    filters?.saturation !== undefined ? `saturate(${filters.saturation}%)` : '',
    !skipOpacity && filters?.opacity !== undefined ? `opacity(${filters.opacity}%)` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export default serializeFilters;
