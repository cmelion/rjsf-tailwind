// src/custom-templates/ColoredSelectWidget.tsx
import React from 'react';

export const ColoredSelectWidget: React.FC<{
  value: any;
  onChange: (value: any) => void;
  options: { enumOptions: { label: string; value: any }[]; backgroundColor: string };
}> = ({ value, onChange, options }) => {
  const { enumOptions, backgroundColor } = options;
  return (
    <select
      className='form-control'
      style={{ backgroundColor }}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {enumOptions.map(({ label, value }, i) => {
        return (
          <option key={i} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
};