'use client';

/**
 * Consultation Details Page
 * Displays full consultation information for a specific consultation ID
 * Route: /consultations/[id]
 */

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton, Button, Result } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useConsultation } from '@/modules/consultation/hooks/useConsultations';
import { ConsultationDetails } from '@/modules/consultation/components/ConsultationDetails';

export default function ConsultationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const consultationId = params.id as string;

  // Fetch consultation data
  const { data: consultation, isLoading, isError, error } = useConsultation(consultationId);

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Skeleton.Button active size="large" />
        </div>
        <div className="bg-white rounded-lg p-8">
          <Skeleton active avatar paragraph={{ rows: 8 }} />
          <Skeleton active paragraph={{ rows: 6 }} className="mt-8" />
          <Skeleton active paragraph={{ rows: 6 }} className="mt-8" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !consultation) {
    return (
      <div className="max-w-7xl mx-auto">
        <Result
          status="error"
          title="Failed to Load Consultation"
          subTitle={
            error instanceof Error
              ? error.message
              : 'The consultation could not be loaded. It may not exist or you may not have permission to view it.'
          }
          extra={
            <Button type="primary" onClick={handleBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <div className="mb-6 print:hidden">
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} size="large">
          Back
        </Button>
      </div>

      {/* Consultation Details */}
      <ConsultationDetails consultation={consultation} />
    </div>
  );
}
