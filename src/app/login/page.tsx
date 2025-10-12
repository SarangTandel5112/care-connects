'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground, LoginHeader, LoginForm, LoginFooter } from '@/modules/auth';
import { tokenStorage } from '@/utils/token';
import { pageVariants, cardVariants } from '@/utils/animations';
import { DebugAuth } from '@/components/DebugAuth';

/**
 * Login Page Component
 * Following SOLID principles:
 * - Single Responsibility: Only handles login page layout
 * - Open/Closed: Open for extension, closed for modification
 * - Liskov Substitution: Uses proper interfaces
 * - Interface Segregation: Uses focused interfaces
 * - Dependency Inversion: Depends on abstractions, not concretions
 */
export default function LoginPage() {
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    const hasValidToken = tokenStorage.isTokenValid();
    if (hasValidToken) router.push('/dashboard');
  }, [router]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="from-blue-50 via-slate-50 to-cyan-50 h-screen bg-gradient-to-br overflow-hidden"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <AnimatedBackground />

        {/* Container with responsive height behavior */}
        <div className="relative flex h-full items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg h-full max-h-[90vh] sm:h-auto sm:max-h-[90vh]">
            {/* Login Card with responsive height */}
            <motion.div
              className="bg-white/95 border-gray-200/50 h-full sm:h-auto sm:max-h-[90vh] rounded-xl border shadow-2xl backdrop-blur-md p-4 sm:p-6 md:p-8 overflow-y-auto"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            >
              {/* All content scrollable together */}
              <div className="space-y-6">
                <LoginHeader />

                {/* LoginForm now handles its own login logic and redirect */}
                <LoginForm redirectTo="/dashboard" />

                <LoginFooter />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Debug component to see Redux and localStorage state */}
      </motion.div>
    </AnimatePresence>
  );
}
