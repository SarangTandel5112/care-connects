/**
 * Login header component with logo and welcome text
 * Following Single Responsibility Principle - only handles header display
 */

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { logoVariants, fadeInVariants } from '@/utils/animations';

interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  title = 'Welcome back',
  subtitle = 'Sign in to your account to continue',
}) => {
  return (
    <motion.div
      className="mb-8 text-center"
      variants={logoVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
    >
      <div className="mb-6 flex justify-center">
        <motion.div
          className="relative h-16 w-48 sm:h-20 sm:w-56 lg:h-24 lg:w-64"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src="/images/logo.svg"
            alt="CareConnects Logo"
            fill
            className="object-contain drop-shadow-lg"
            priority
          />
        </motion.div>
      </div>
      <motion.h1
        className="text-gray-900 mb-2 text-2xl font-bold sm:text-3xl lg:text-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {title}
      </motion.h1>
      <motion.p
        className="text-gray-600 text-base sm:text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
};
