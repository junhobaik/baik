import React, { memo } from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (event: unknown) => void;
  bgColor?: string;
  checkColor?: string;
  size?: number | string;
  label?: string;
  labelPosition?: 'left' | 'right';
  labelFontSize?: number | string;
}

const Checkbox = ({
  checked = false,
  onChange,
  bgColor = 'bg-blue-500',
  checkColor = 'text-white',
  size = 24,
  label,
  labelPosition = 'right',
  labelFontSize,
}: CheckboxProps) => {
  const getSizeValue = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

  const checkboxStyle = {
    width: getSizeValue(size),
    height: getSizeValue(size),
  };

  const labelStyle = {
    fontSize: labelFontSize ? getSizeValue(labelFontSize) : getSizeValue(typeof size === 'number' ? size * 0.75 : size),
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      {labelPosition === 'left' && label && (
        <span className="mr-2 select-none" style={labelStyle}>
          {label}
        </span>
      )}
      <div className="relative" style={checkboxStyle}>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <div
          className={`absolute inset-0 rounded-md border transition-all duration-200 ease-in-out ${
            checked ? `${bgColor} border-transparent` : 'bg-white border-gray-300'
          }`}
        />
        <svg
          className={`absolute inset-0 w-3/4 h-3/4 m-auto ${checkColor} transition-all duration-200 ${
            checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      {labelPosition === 'right' && label && (
        <span className="ml-2 select-none" style={labelStyle}>
          {label}
        </span>
      )}
    </label>
  );
};

export default memo(Checkbox);
