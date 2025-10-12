'use client';

import { cn } from '@/utils';
import { usePathname, useRouter } from 'next/navigation';
import { menuItems, bottomMenuItems } from './menu.config';
import { useSidebarState } from './hooks';
import { SidebarLogo, SidebarMenuItem } from './components';

/**
 * Sidebar Component
 * Collapsible sidebar navigation with hover/touch expand functionality
 * Following SOLID Principles:
 * - Single Responsibility: Only handles sidebar container and composition
 * - Open/Closed: Extensible through menuConfig without modification
 * - Dependency Inversion: Depends on abstractions (hooks, components)
 */
export const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isExpanded,
    isMobile,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  } = useSidebarState();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <aside
      className={cn(
        'group z-[999] flex h-screen flex-col font-medium transition-all duration-300 fixed left-0 top-0',
        isExpanded ? 'w-64' : 'w-16',
        'hidden md:block'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={cn(
          'bg-white border-gray-200 flex h-full flex-col border-r shadow-sm transition-all duration-300 ease-in-out',
          isExpanded ? 'w-64 shadow-xl' : 'w-16'
        )}
      >
        {/* Logo Section */}
        <SidebarLogo isExpanded={isExpanded} />

        {/* Navigation Menu */}
        <nav
          className="flex w-full grow flex-col items-start gap-2 px-3 py-2"
          style={{ minHeight: 'fit-content' }}
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

            return (
              <SidebarMenuItem
                key={item.label?.toString()}
                item={item}
                isActive={isActive}
                isExpanded={isExpanded}
                onClick={item.onClick ?? (() => navigateTo(item.path ?? '/dashboard'))}
              />
            );
          })}
        </nav>

        {/* Bottom Menu Items */}
        <div className="border-t border-gray-100 px-3 py-2">
          {bottomMenuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

            return (
              <SidebarMenuItem
                key={item.label?.toString()}
                item={item}
                isActive={isActive}
                isExpanded={isExpanded}
                onClick={item.onClick ?? (() => navigateTo(item.path ?? '/settings'))}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
};
