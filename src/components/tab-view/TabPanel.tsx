import { cn } from '@/utils';

interface TabPanelProps {
  value: string;
  selectedValue: string;
  className?: string;
}

export const TabPanel: React.FC<React.PropsWithChildren<TabPanelProps>> = ({
  value,
  selectedValue,
  className,
  children,
}) => {
  const isSelected = value === selectedValue;

  return isSelected ? (
    <div
      id={`tabpanel-${value}`}
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      className={cn(className)}
    >
      {children}
    </div>
  ) : null;
};
