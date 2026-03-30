import type {
  ButtonProps,
  ColorPickerProps,
  DropdownProps,
  FontPickerProps,
  InputProps,
  ToggleProps,
} from '@/types/uiSchema.ts';
import type { ReactNode } from 'react';

type BaseComponentProps = {
  id: string;
  label: string;
  tippy?: string | ReactNode;
  visible?: () => boolean;
};

type DropdownComponent = {
  type: 'Dropdown';
} & DropdownProps &
  BaseComponentProps;

type InputComponent = {
  type: 'Input';
  textArea?: boolean;
} & InputProps &
  BaseComponentProps;

type ToggleComponent = {
  type: 'Toggle';
} & ToggleProps &
  BaseComponentProps;

type ButtonComponent = {
  type: 'Button';
} & ButtonProps &
  BaseComponentProps;

type ColorPickerComponent = {
  type: 'Color';
} & ColorPickerProps &
  BaseComponentProps;
type FontPickerComponent = {
  type: 'Font';
} & FontPickerProps &
  BaseComponentProps;

export type Component =
  | DropdownComponent
  | InputComponent
  | ToggleComponent
  | ButtonComponent
  | ColorPickerComponent
  | FontPickerComponent;

export type GroupProps = {
  id: string;
  groupName?: string;
  visible?: () => boolean;
  components: Component[];
};

export type SectionProps = {
  id: string;
  sectionName: string;
  groups: GroupProps[];
  visible?: () => boolean;
};
