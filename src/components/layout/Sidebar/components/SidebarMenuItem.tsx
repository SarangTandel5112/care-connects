import { cn } from '@/utils';
import { MenuItem } from '../menu.config';

/**
 * SidebarMenuItem Component Props
 */
interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

/**
 * SidebarMenuItem Component
 * Renders a single menu item in the sidebar
 * Following Single Responsibility Principle
 */
export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isActive,
  isExpanded,
  onClick,
}) => {
  return (
    <div
      className={cn(
        'relative flex w-full cursor-pointer items-center rounded-lg transition-all duration-300 group',
        isExpanded ? 'gap-3 px-3 py-2' : 'gap-0 justify-center px-2 py-2',
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
          : 'text-gray-600'
      )}
      style={{ minHeight: '40px' }}
      onClick={onClick}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white shadow-sm" />
      )}

      {/* Icon with enhanced styling */}
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center transition-all duration-300',
          isActive ? 'text-white' : 'text-gray-500',
          isExpanded ? 'w-5 h-5' : 'w-6 h-6'
        )}
      >
        {item.icon}
      </div>

      {/* Label with smooth animation */}
      <span
        className={cn(
          'truncate font-medium whitespace-nowrap transition-all duration-300',
          isExpanded ? 'max-w-none opacity-100 text-sm' : 'max-w-0 opacity-0 text-xs',
          isActive ? 'text-white' : 'text-gray-700'
        )}
      >
        {item.label}
      </span>
    </div>
  );
};
