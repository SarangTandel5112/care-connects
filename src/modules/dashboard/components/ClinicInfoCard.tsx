/**
 * Clinic Info Card Component
 * Displays clinic information with image and overlay text
 * Following Single Responsibility Principle
 */

import React from 'react';
import Image from 'next/image';

interface ClinicInfoCardProps {
  /**
   * Name of the clinic
   */
  clinicName?: string;
  /**
   * Location of the clinic
   */
  location?: string;
  /**
   * Path to clinic image
   */
  imageSrc?: string;
  /**
   * Alt text for the image
   */
  imageAlt?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Card component displaying clinic information with image and overlay
 * Supports customization through props for reusability
 */
export const ClinicInfoCard: React.FC<ClinicInfoCardProps> = ({
  clinicName = 'Pramukh Dental Clinic',
  location = 'Valsad',
  imageSrc = '/images/clinic.png',
  imageAlt = 'Clinic image',
  className = '',
}) => {
  return (
    <div className={`h-full w-full overflow-hidden rounded-lg border border-gray-200 ${className}`}>
      <div className="relative flex h-full flex-col overflow-hidden">
        {/* Clinic Image */}
        <div className="relative h-full w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay Gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Clinic Information Overlay */}
        <div className="absolute bottom-4 left-8 flex flex-col text-white">
          <h2 className="text-xl font-bold drop-shadow-md sm:text-2xl">
            {clinicName}
          </h2>
          <p className="text-sm drop-shadow-md sm:text-base">{location}</p>
        </div>
      </div>
    </div>
  );
};
