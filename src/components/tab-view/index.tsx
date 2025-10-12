import { cn } from '@/utils';
import { Tab } from '@/types/tab';
import React, { useEffect, useState } from 'react';
import { TabPanel } from './TabPanel';
import { Tabs } from './Tabs';

type Variant = 'contained' | 'outlined' | 'underlined';
type Size = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type Color = 'primary' | 'secondary' | 'danger' | 'warning' | string;

interface TabViewProps {
  tabs: Tab[];
  value?: string; // Controlled mode prop
  onChange?: (value: string) => void; // Callback for controlled mode
  defaultValue?: string; // Uncontrolled mode prop
  variant?: Variant;
  size?: Size;
  color?: Color;
  disabled?: boolean;
  className?: string;
  tabsClassName?: string;
  focusColor?: string;
}

export const TabView: React.FC<TabViewProps> = ({
  tabs,
  value: controlledValue,
  onChange,
  defaultValue,
  variant = 'contained',
  size = 'base',
  color = 'primary',
  disabled = false,
  className,
  tabsClassName,
  focusColor = 'primary',
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    controlledValue ?? defaultValue ?? tabs[0]?.value ?? '',
  );

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const handleTabChange = (value: string) => {
    const newValue = value;
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const selectedTab = tabs.find((tab) => tab.value === (controlledValue ?? internalValue));

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Tabs
        tabs={tabs}
        value={controlledValue ?? internalValue}
        onChange={handleTabChange}
        variant={variant}
        size={size}
        color={color}
        disabled={disabled}
        focusColor={focusColor}
        className={tabsClassName}
      />
      {selectedTab && (
        <TabPanel value={selectedTab.value} selectedValue={controlledValue ?? internalValue}>
          {selectedTab.content}
        </TabPanel>
      )}
    </div>
  );
};

export { TabPanel, Tabs };
