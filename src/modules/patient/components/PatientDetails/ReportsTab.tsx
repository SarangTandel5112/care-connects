/**
 * Reports & Documents Tab Component
 * Placeholder for future document management integration
 */

import React from 'react';
import { Card, Empty, Button, Row, Col } from 'antd';
import {
  FileTextOutlined,
  UploadOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FolderOutlined,
} from '@ant-design/icons';

interface ReportsTabProps {
  patientId: string;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ patientId }) => {
  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="shadow-sm bg-blue-50 border-blue-200">
        <div className="text-center py-4">
          <FileTextOutlined className="text-5xl text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Reports & Documents Management
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This feature will be integrated in future updates. You will be able to:
          </p>
        </div>
      </Card>

      {/* Features Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
            <div className="text-center py-6">
              <UploadOutlined className="text-4xl text-green-600 mb-3" />
              <h4 className="text-base font-semibold text-gray-900 mb-2">Upload Documents</h4>
              <p className="text-sm text-gray-600">
                Upload and store medical reports, prescriptions, lab results, and X-rays
              </p>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
            <div className="text-center py-6">
              <FolderOutlined className="text-4xl text-purple-600 mb-3" />
              <h4 className="text-base font-semibold text-gray-900 mb-2">Organize by Category</h4>
              <p className="text-sm text-gray-600">
                Categorize documents by type: Lab Reports, X-Rays, Prescriptions, Medical History
              </p>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
            <div className="text-center py-6">
              <FilePdfOutlined className="text-4xl text-red-600 mb-3" />
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                Generate & Download PDFs
              </h4>
              <p className="text-sm text-gray-600">
                Generate consultation reports and download patient documents in PDF format
              </p>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
            <div className="text-center py-6">
              <FileImageOutlined className="text-4xl text-orange-600 mb-3" />
              <h4 className="text-base font-semibold text-gray-900 mb-2">View & Preview</h4>
              <p className="text-sm text-gray-600">
                View and preview documents inline with support for multiple file formats
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Coming Soon Section */}
      <Card className="shadow-sm">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="py-4">
              <p className="text-gray-600 mb-4">
                Document management system is coming soon. Stay tuned for updates!
              </p>
              <p className="text-xs text-gray-500">
                Patient ID: <span className="font-mono">{patientId}</span>
              </p>
            </div>
          }
        >
          <Button type="primary" disabled icon={<UploadOutlined />}>
            Upload Document (Coming Soon)
          </Button>
        </Empty>
      </Card>

      {/* Temporary Placeholder Info */}
      <Card className="shadow-sm bg-gray-50 border-gray-200">
        <div className="text-center py-3">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> In the meantime, you can reference consultation files from the
            Consultations tab if any files were uploaded during consultations.
          </p>
        </div>
      </Card>
    </div>
  );
};

ReportsTab.displayName = 'ReportsTab';
