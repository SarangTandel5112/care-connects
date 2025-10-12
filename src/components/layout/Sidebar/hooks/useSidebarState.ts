import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

/**
 * Sidebar State Hook
 * Manages sidebar expansion state and event handlers
 * Following Single Responsibility Principle
 */
export const useSidebarState = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isMobile } = useDeviceDetection();

  const handleMouseEnter = () => {
    // Hover works on all non-mobile devices
    if (!isMobile) setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // Hover works on all non-mobile devices
    if (!isMobile) setIsExpanded(false);
  };

  const handleTouchStart = () => {
    // Touch behavior for mobile devices
    if (isMobile) setIsExpanded(true);
  };

  const handleTouchEnd = () => {
    // Touch behavior for mobile devices
    if (isMobile) {
      // Delay hiding to allow for navigation
      setTimeout(() => setIsExpanded(false), 1000);
    }
  };

  return {
    isExpanded,
    isMobile,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  };
};
