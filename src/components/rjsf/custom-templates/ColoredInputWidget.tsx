// src/custom-templates/ColoredInputWidget.tsx
import React from 'react';

export const ColoredInputWidget: React.FC<{
  value: any;
  onChange: (value: any) => void;
  options: { backgroundColor: string };
}> = ({ value, onChange, options }) => {
  const { backgroundColor } = options;
  return (
    <input
      className='form-control'
      onChange={(event) => onChange(event.target.value)}
      style={{ backgroundColor }}
      value={value}
    />
  );
};