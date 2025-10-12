/**
 * Animated background component for login page
 * Following Single Responsibility Principle - only handles background animations
 */

import React from 'react';

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient orbs - responsive sizes */}
      <div className="from-blue-200 to-blue-300 absolute -top-20 -right-20 h-48 w-48 animate-pulse rounded-full bg-gradient-to-br opacity-30 sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96"></div>
      <div
        className="from-cyan-200 to-cyan-300 absolute -bottom-20 -left-20 h-48 w-48 animate-pulse rounded-full bg-gradient-to-br opacity-30 sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96"
        style={{ animationDelay: '1s' }}
      ></div>
      <div
        className="from-slate-200 to-slate-300 absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-br opacity-20 sm:h-60 sm:w-60 md:h-72 md:w-72 lg:h-80 lg:w-80"
        style={{ animationDelay: '2s' }}
      ></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f3f4f6%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
    </div>
  );
};
