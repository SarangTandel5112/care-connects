/**
 * Overview Tab Component
 * Displays patient summary with key metrics and personal information
 */

import React from 'react';
import { Card, Row, Col, Descriptions, Tag, Statistic, Empty } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { Patient } from '@/modules/patient/types/patient.types';
import { formatDate, calculateAge } from '../../utils/avatarUtils';

interface OverviewTabProps {
  patient: Patient;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ patient }) => {
  const age = patient.birthDate ? calculateAge(patient.birthDate) : null;

  // Mock data for summary cards (will be replaced with real data from backend)
  const totalConsultations = patient.consultations?.length || 0;
  const nextAppointment = null; // TODO: Fetch from appointments

  return (
    <div className="space-y-6">
      {/* Summary Cards Row */}
      <Row gutter={[16, 16]}>
        {/* Total Consultations */}
        <Col xs={24} sm={12}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Consultations"
              value={totalConsultations}
              prefix={<MedicineBoxOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        {/* Next Appointment */}
        <Col xs={24} sm={12}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="text-gray-500 text-sm mb-2">Next Appointment</div>
              {nextAppointment ? (
                <div className="text-lg font-semibold text-purple-600">
                  <CalendarOutlined className="mr-2" />
                  {/* {formatDate(nextAppointment)} */}
                  15 Jan 2025
                </div>
              ) : (
                <div className="text-gray-400 text-sm">No upcoming appointments</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Row */}
      <Row gutter={[16, 16]}>
        {/* Left Column: Personal Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <UserOutlined className="mr-2" />
                Personal Information
              </span>
            }
            className="shadow-sm"
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Full Name">
                <span className="font-medium">
                  {patient.firstName} {patient.lastName}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Patient ID">
                <span className="font-mono text-xs">{patient.id}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Age">
                {age ? `${age} years` : 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {patient.birthDate ? formatDate(patient.birthDate) : 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {patient.gender || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Marital Status">
                {patient.maritalStatus || 'Not specified'}
              </Descriptions.Item>
              {patient.numberOfChildren !== undefined && patient.numberOfChildren > 0 && (
                <Descriptions.Item label="Number of Children">
                  {patient.numberOfChildren}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Patient Group">
                {patient.patientGroup ? (
                  <Tag color="blue">{patient.patientGroup}</Tag>
                ) : (
                  'Not specified'
                )}
              </Descriptions.Item>
              {patient.referredBy && (
                <Descriptions.Item label="Referred By">{patient.referredBy}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Right Column: Contact & Location */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <PhoneOutlined className="mr-2" />
                Contact & Location
              </span>
            }
            className="shadow-sm"
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mobile">
                <a href={`tel:${patient.mobile}`} className="text-blue-600 hover:text-blue-800">
                  <PhoneOutlined className="mr-1" />
                  {patient.mobile}
                </a>
              </Descriptions.Item>
              {patient.location && (
                <Descriptions.Item label="Location">
                  <EnvironmentOutlined className="mr-1 text-green-600" />
                  {patient.location}
                </Descriptions.Item>
              )}
              {patient.city && (
                <Descriptions.Item label="City">{patient.city}</Descriptions.Item>
              )}
              {patient.state && (
                <Descriptions.Item label="State">{patient.state}</Descriptions.Item>
              )}
              {patient.country && (
                <Descriptions.Item label="Country">{patient.country}</Descriptions.Item>
              )}
              {patient.zipCode && (
                <Descriptions.Item label="Zip Code">{patient.zipCode}</Descriptions.Item>
              )}
              {patient.region && (
                <Descriptions.Item label="Region">{patient.region}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Medical Information Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <span>
                <HeartOutlined className="mr-2" />
                Medical Information
              </span>
            }
            className="shadow-sm"
          >
            {patient.medicalConditions && patient.medicalConditions.length > 0 ? (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Medical Conditions / Allergies:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalConditions.map((condition, index) => (
                    <Tag key={index} color="red" className="px-3 py-1">
                      {condition}
                    </Tag>
                  ))}
                </div>
              </div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No medical conditions or allergies recorded"
                className="py-4"
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Registration Details */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <span>
                <CalendarOutlined className="mr-2" />
                Registration Details
              </span>
            }
            className="shadow-sm"
          >
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Registered On">
                {formatDate(patient.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {formatDate(patient.updatedAt)}
              </Descriptions.Item>
              {patient.clinic && (
                <>
                  <Descriptions.Item label="Clinic ID">
                    <span className="font-mono text-xs">{patient.clinic.id}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Clinic Name">
                    <span className="font-medium">{patient.clinic.name}</span>
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

OverviewTab.displayName = 'OverviewTab';
