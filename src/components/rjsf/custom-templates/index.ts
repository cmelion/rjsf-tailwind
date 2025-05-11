export { ObjectFieldTemplate } from './ObjectFieldTemplate.tsx';
export { UiField } from './UiField.tsx';
export { ArrayFieldTemplate } from './ArrayFieldTemplate.tsx';
export { ColoredInputWidget } from './ColoredInputWidget.tsx';
export { ColoredSelectWidget } from './ColoredSelectWidget.tsx';

// Create and export the mapping automatically
import { ObjectFieldTemplate } from './ObjectFieldTemplate.tsx';
import { UiField } from './UiField.tsx';
import { ArrayFieldTemplate } from './ArrayFieldTemplate.tsx';
import { ColoredInputWidget } from './ColoredInputWidget.tsx';
import { ColoredSelectWidget } from './ColoredSelectWidget.tsx';

export const templateComponents: Record<string, any> = {
  ObjectFieldTemplate,
  UiField,
  ArrayFieldTemplate,
  ColoredInputWidget,
  ColoredSelectWidget,
};