export { ObjectFieldTemplate } from './ObjectFieldTemplate';
export { UiField } from './UiField';
export { ArrayFieldTemplate } from './ArrayFieldTemplate';
export { ColoredInputWidget } from './ColoredInputWidget';
export { ColoredSelectWidget } from './ColoredSelectWidget';

// Create and export the mapping automatically
import { ObjectFieldTemplate } from './ObjectFieldTemplate';
import { UiField } from './UiField';
import { ArrayFieldTemplate } from './ArrayFieldTemplate';
import { ColoredInputWidget } from './ColoredInputWidget';
import { ColoredSelectWidget } from './ColoredSelectWidget';

export const templateComponents: Record<string, any> = {
  ObjectFieldTemplate,
  UiField,
  ArrayFieldTemplate,
  ColoredInputWidget,
  ColoredSelectWidget,
};