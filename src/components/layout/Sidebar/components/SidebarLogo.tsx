import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/utils';

/**
 * SidebarLogo Component Props
 */
interface SidebarLogoProps {
  isExpanded: boolean;
}

/**
 * SidebarLogo Component
 * Displays the application logo in the sidebar
 * Following Single Responsibility Principle
 */
export const SidebarLogo: React.FC<SidebarLogoProps> = ({ isExpanded }) => {
  const router = useRouter();

  return (
    <div
      className="flex w-full flex-shrink-0 flex-col items-start gap-1 px-3 py-2"
      onClick={() => router.push('/dashboard')}
    >
      <div
        className={cn(
          'flex w-full cursor-pointer items-center rounded-lg px-2 py-1.5 transition-all duration-300',
          isExpanded ? 'gap-1' : 'gap-0',
          'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
        )}
      >
        <span className="flex flex-shrink-0 items-center justify-center">
          <Image
            className="h-7 min-h-7"
            src="/images/logo-small.svg"
            alt="Care Connects"
            width={28}
            height={28}
          />
        </span>
        <span
          className={cn(
            'truncate text-sm font-semibold whitespace-nowrap transition-all duration-300',
            isExpanded ? 'max-w-none opacity-100' : 'max-w-0 opacity-0'
          )}
        >
          <Image
            className="h-6"
            src="/images/logo-text.svg"
            alt="Care Connects"
            width={60}
            height={24}
          />
        </span>
      </div>
    </div>
  );
};
