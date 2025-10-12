import { cn } from '@/utils';
import { Tab } from '@/types/tab';
import React, { useEffect, useState } from 'react';

type Variant = 'contained' | 'outlined' | 'underlined';
type Size = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type Color = 'primary' | 'secondary' | 'danger' | 'warning' | string;

interface TabsProps {
  tabs: Omit<Tab, 'content'>[];
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  variant?: Variant;
  size?: Size;
  color?: Color;
  disabled?: boolean;
  className?: string;
  focusColor?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value: controlledValue,
  onChange,
  defaultValue,
  variant = 'contained',
  size = 'base',
  color: _color = 'primary', // eslint-disable-line @typescript-eslint/no-unused-vars -- Reserved for future use
  disabled = false,
  className,
  focusColor: _focusColor = 'primary', // eslint-disable-line @typescript-eslint/no-unused-vars -- Reserved for future use
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    controlledValue ?? defaultValue ?? tabs[0]?.value ?? ''
  );

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChange = (newValue: string) => {
    if (disabled || tabs.find((tab) => tab.value === newValue)?.disabled) return;
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const variantStyles: Record<Variant, (isActive: boolean) => string> = {
    contained: (isActive: boolean) =>
      isActive
        ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm'
        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900',
    outlined: (isActive: boolean) =>
      isActive
        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300',
    underlined: (isActive: boolean) =>
      isActive
        ? 'bg-transparent text-blue-600 border-b-2 border-blue-600 font-semibold'
        : 'bg-transparent text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300',
  };

  const sizeStyles: Record<Size, string> = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-sm',
    base: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-3 text-xl',
    '2xl': 'px-7 py-3.5 text-2xl',
    '3xl': 'px-8 py-4 text-3xl',
  };

  const disabledStyles = 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100';
  const focusStyles = 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

  const computedStyles = cn(
    'flex items-center gap-1',
    variant === 'underlined' && 'border-b border-gray-200',
    variant === 'outlined' && 'border border-gray-200 rounded-lg',
    variant === 'contained' && 'border border-gray-200 rounded-lg',
    className,
    disabled && disabledStyles,
    focusStyles
  );

  return (
    <div className={computedStyles}>
      {tabs.map((tab) => (
        <div
          key={tab.value}
          onClick={() => {
            if (!(disabled || tab.disabled)) handleChange(tab.value);
          }}
          className={cn(
            'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md',
            variantStyles[variant](internalValue === tab.value),
            sizeStyles[size],
            internalValue === tab.value || tab.disabled ? 'cursor-default' : 'cursor-pointer',
            tab.disabled && disabledStyles,
            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
            tab.className
          )}
          aria-selected={internalValue === tab.value}
          aria-controls={`tabpanel-${tab.value}`}
          tabIndex={0}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};
