import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-md p-6 border border-secondary-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
