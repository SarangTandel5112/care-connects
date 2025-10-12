'use client';
import { useAuthRehydration } from '@/hooks/useAuthRehydration';

/**
 * AuthRehydration Component
 * Rehydrates Redux auth state from localStorage on app load
 * Must be a client component to access localStorage
 */
export const AuthRehydration: React.FC = () => {
  useAuthRehydration();
  return null; // This component doesn't render anything
};
