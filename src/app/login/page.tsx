'use client';

import { useFormHandler } from '@/hooks/useFormHandler';
import { loginSchema, LoginFormData } from '@/modules/auth/schemas/login.schema';
import { useLogin } from '@/modules/auth/hooks/useAuth';
import { Button, Card, Field } from '@/components/ui';
import { useIsAuthenticated, useCurrentUser } from '@/hooks';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const isAuthenticated = useIsAuthenticated();
  const { isLoading } = useCurrentUser();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormHandler<LoginFormData>({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async (data) => {
      return new Promise((resolve, reject) => {
        login(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-secondary-900">Care Connects</h2>
            <p className="mt-2 text-sm text-secondary-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Field
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              disabled={isPending}
              {...register('email')}
            />

            <Field
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              disabled={isPending}
              {...register('password')}
            />

            <Button type="submit" isLoading={isPending} className="w-full">
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
