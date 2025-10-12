import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import StoreProvider from '@/providers/StoreProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Care Connects - Healthcare Management System',
  description: 'Manage your healthcare practice efficiently',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <StoreProvider>
            <QueryProvider>
              {children}
              <ToastProvider />
            </QueryProvider>
          </StoreProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
