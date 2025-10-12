'use client';

import { Bell, Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useCombinedStore } from '@/hooks/useStore';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { motion, AnimatePresence } from 'framer-motion';
import { menuItems } from '@/components/layout/Sidebar/menu.config';
import { useLogout } from '@/modules/auth/hooks/useAuth';
import Image from 'next/image';
import { Button } from '@/components/ui';

/**
 * Header Component
 * Top navigation bar with search, notifications, and user profile
 * Following Single Responsibility Principle - handles top-level navigation only
 */
export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useCombinedStore();
  const { isMobile } = useDeviceDetection();
  const { mutate: logout } = useLogout();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      logout();
      setIsMenuOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-gray-200 flex items-center justify-between border-b px-3 py-2 shadow-sm">
      {/* Left Side - Mobile Hamburger Menu with Logo */}
      <div className="flex items-center">
        {isMobile && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-xl transition-all duration-300 hover:shadow-md"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Menu size={24} />
              </motion.div>
            </motion.button>
            <Image
              className="h-8"
              src="/images/logo-small.svg"
              alt="Care Connects"
              width={32}
              height={32}
            />
          </>
        )}
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="sm"
          icon={<Bell size={18} aria-hidden="true" />}
          className="relative"
          aria-label="Notifications"
          title="Notifications"
        >
          <span
            className="absolute top-0.5 right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-white text-[8px] font-bold"
            aria-label="4 unread notifications"
          >
            4
          </span>
        </Button>

        {/* User Profile */}
        <div className="relative" ref={profileMenuRef}>
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 p-1"
            aria-label="User menu"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <div className="relative">
              <Image
                src={user?.avatar || 'https://i.pravatar.cc/50'}
                alt="User profile"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
            </div>
          </Button>

          {isMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="py-1">
                <Button
                  onClick={() => {
                    router.push('/profile');
                    setIsMenuOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-gray-700"
                  role="menuitem"
                >
                  Profile
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-gray-700"
                  role="menuitem"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay with Framer Motion */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                duration: 0.4,
              }}
              className="fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-white to-gray-50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-1">
                  <Image
                    className="h-8"
                    src="/images/logo-small.svg"
                    alt="Care Connects"
                    width={32}
                    height={32}
                  />
                  <Image
                    className="h-6"
                    src="/images/logo-text.svg"
                    alt="Care Connects"
                    width={60}
                    height={28}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:bg-white/80 rounded-xl transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Navigation */}
              <div className="p-6">
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

                    return (
                      <Button
                        key={item.label?.toString()}
                        onClick={() => {
                          router.push(item.path ?? '/dashboard');
                          setIsMobileMenuOpen(false);
                        }}
                        variant={isActive ? 'primary' : 'ghost'}
                        className={`w-full flex items-center gap-4 px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600'
                        }`}
                        style={isActive ? { backgroundColor: '#1777ff' } : {}}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                        {isActive && <span className="ml-auto w-2 h-2 bg-white rounded-full" />}
                      </Button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
