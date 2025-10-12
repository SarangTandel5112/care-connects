/**
 * Login form component with validation and animations
 * Following Single Responsibility Principle - handles complete login flow
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import { Button, Field, LoginIcon } from '@/components/ui';
import { ErrorMessage } from './ErrorMessage';
import { BRAND_COLOR_CLASSES } from '@/constants/brand-colors';
import { buttonVariants } from '@/utils/animations';
import { LoginFormData, loginValidationSchema } from '@/modules/auth/schemas/login.schema';
import { useLogin } from '@/modules/auth/hooks/useAuth';
import { extractErrorMessage } from '@/utils/errorHandling';

interface LoginFormProps {
  redirectTo?: string; // Optional redirect path after successful login
}

export const LoginForm: React.FC<LoginFormProps> = ({ redirectTo = '/dashboard' }) => {
  const router = useRouter();

  // Destructured for better readability
  const { mutateAsync: loginUser, isPending, error: loginError } = useLogin();

  // Formik form management
  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        await loginUser(values);
        // Redirect on success
        router.push(redirectTo);
      } catch (error) {
        // Error is handled by React Query and displayed via ErrorMessage
        console.error('Login failed:', error);
      }
    },
  });

  const errorMessage = extractErrorMessage(loginError);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {errorMessage && <ErrorMessage message={errorMessage} />}

        <Field
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
          disabled={isPending}
          className="w-full"
        />

        <Field
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.password && formik.errors.password ? formik.errors.password : undefined
          }
          disabled={isPending}
          className="w-full"
        />

        <motion.div
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          transition={{ duration: 0.3 }}
        >
          <Button
            type="submit"
            variant="contained"
            size="md"
            disabled={isPending}
            loading={isPending}
            loadingContent="Signing in..."
            className={`${BRAND_COLOR_CLASSES.BLUE.bg} ${BRAND_COLOR_CLASSES.BLUE.hover} ${BRAND_COLOR_CLASSES.BLUE.focus} focus:ring-brand-blue w-full transform rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-[1.01] hover:shadow-lg focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70`}
            icon={<LoginIcon />}
          >
            Sign in
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};
