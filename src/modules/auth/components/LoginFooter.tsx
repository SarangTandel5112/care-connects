/**
 * Login footer component with support link and copyright
 * Following Single Responsibility Principle - only handles footer display
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BRAND_COLOR_CLASSES } from '@/constants/brand-colors';

export const LoginFooter: React.FC = () => {
  return (
    <>
      {/* Additional Info */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <p className="text-gray-500 text-sm">
          Having trouble signing in?{' '}
          <a
            href="#"
            className={`${BRAND_COLOR_CLASSES.BLUE.text} focus:ring-brand-blue rounded-sm font-medium transition-colors duration-200 hover:opacity-80 focus:ring-2 focus:ring-offset-2 focus:outline-none`}
            aria-label="Contact support for login assistance"
          >
            Contact support
          </a>
        </p>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="mt-8 text-center sm:mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <p className="text-gray-500 text-xs">© 2024 CareConnects. All rights reserved.</p>
      </motion.div>
    </>
  );
};
