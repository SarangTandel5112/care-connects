import { cn } from '@/utils';

/**
 * SidebarFooter Component Props
 */
interface SidebarFooterProps {
  isExpanded: boolean;
}

/**
 * SidebarFooter Component
 * Displays collapse hint at the bottom of sidebar
 * Following Single Responsibility Principle
 */
export const SidebarFooter: React.FC<SidebarFooterProps> = ({ isExpanded }) => {
  return (
    <div className="border-t border-gray-100 p-2 pb-3">
      <div
        className={cn(
          'flex items-center rounded-lg px-3 py-1.5 text-xs text-gray-500 transition-all duration-200 group',
          'hover:text-blue-600 hover:bg-blue-50',
          isExpanded ? 'gap-2' : 'gap-0 justify-center'
        )}
      >
        <span className="flex flex-shrink-0 items-center justify-center text-sm group-hover:scale-110 transition-transform duration-200">
          {isExpanded ? '◀' : '▶'}
        </span>
        <span
          className={cn(
            'whitespace-nowrap font-medium transition-all duration-300',
            isExpanded ? 'max-w-none opacity-100' : 'max-w-0 opacity-0'
          )}
        >
          {isExpanded ? 'Collapse sidebar' : 'Expand'}
        </span>
      </div>
    </div>
  );
};
