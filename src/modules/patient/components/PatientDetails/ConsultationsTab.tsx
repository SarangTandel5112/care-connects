/**
 * Consultations Tab Component
 * Displays timeline of all patient consultations with expandable details
 */

import React from 'react';
import { Timeline, Card, Empty, Spin, Tag, Descriptions, Table, Alert, Collapse, Button, Divider, message } from 'antd';
import {
  MedicineBoxOutlined,
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { useConsultations } from '@/modules/consultation/hooks/useConsultations';
import { formatDate, getRelativeTime } from '../../utils/avatarUtils';
import { PaymentStatus } from '@/modules/consultation/types/consultation.types';
import { ConsultationPrintService } from '@/utils/print';

interface ConsultationsTabProps {
  patientId: string;
}

export const ConsultationsTab: React.FC<ConsultationsTabProps> = ({ patientId }) => {
  // Fetch consultations for this patient
  const { data: consultations, isLoading, isError } = useConsultations({ patientId });

  // Print specific consultation using the print service
  const handlePrintConsultation = (consultationId: string) => {
    const result = ConsultationPrintService.printConsultation(consultationId);

    if (!result.success) {
      message.error(result.error || 'Failed to print consultation');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Loading consultations..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert
        message="Error Loading Consultations"
        description="Failed to load consultation history. Please try again."
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  // Empty state
  if (!consultations || consultations.length === 0) {
    return (
      <div className="py-12">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No consultations found for this patient"
        />
      </div>
    );
  }

  // Get payment status badge color
  const getPaymentStatusColor = (status?: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'success';
      case PaymentStatus.PENDING:
        return 'warning';
      case PaymentStatus.PARTIALLY_PAID:
        return 'processing';
      case PaymentStatus.FAILED:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card size="small" className="shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{consultations.length}</div>
            <div className="text-sm text-gray-600">Total Consultations</div>
          </div>
        </Card>
        <Card size="small" className="shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ₹
              {consultations
                .reduce((sum, c) => sum + (Number(c.billing?.totalAmount) || 0), 0)
                .toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Billed</div>
          </div>
        </Card>
        <Card size="small" className="shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              ₹
              {consultations
                .reduce((sum, c) => sum + (Number(c.billing?.pendingAmount) || 0), 0)
                .toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Pending Amount</div>
          </div>
        </Card>
      </div>

      {/* Consultations Timeline */}
      <Timeline mode="left" className="mt-8">
        {consultations.map((consultation, index) => (
          <Timeline.Item
            key={consultation.id}
            color={index === 0 ? 'green' : 'blue'}
            dot={<MedicineBoxOutlined className="text-lg" />}
          >
            <Card
              className="shadow-sm hover:shadow-md transition-shadow"
              size="small"
              title={
                <div className="flex items-center justify-between">
                  <span>
                    <ClockCircleOutlined className="mr-2" />
                    {formatDate(consultation.createdAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Tag color={index === 0 ? 'green' : 'blue'}>
                      {getRelativeTime(consultation.createdAt)}
                    </Tag>
                    {consultation.billing?.paymentStatus && (
                      <Tag color={getPaymentStatusColor(consultation.billing.paymentStatus)}>
                        {consultation.billing.paymentStatus}
                      </Tag>
                    )}
                    <Button
                      type="text"
                      size="small"
                      icon={<PrinterOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrintConsultation(consultation.id);
                      }}
                      className="print-hide"
                    >
                      Print
                    </Button>
                  </div>
                </div>
              }
            >
              <Collapse
                defaultActiveKey={index === 0 ? ['details'] : []}
                ghost
                items={[
                  {
                    key: 'details',
                    label: (
                      <span className="font-semibold text-gray-800">
                        View Consultation Details
                      </span>
                    ),
                    children: (
                      <div id={`consultation-${consultation.id}`} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
                        {/* Doctor Info */}
                        {consultation.doctor && (
                          <div className="bg-gray-50 p-3 rounded">
                            <div className="flex items-center text-sm">
                              <UserOutlined className="mr-2 text-purple-600" />
                              <span className="font-medium">
                                Dr. {consultation.doctor.firstName} {consultation.doctor.lastName}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Basic Information */}
                        {(consultation.complaints ||
                          consultation.examination ||
                          consultation.advice) && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                              <FileTextOutlined className="mr-2 text-blue-600" />
                              Clinical Notes
                            </h4>
                            <Descriptions column={1} bordered size="small">
                              {consultation.complaints && (
                                <Descriptions.Item label="Chief Complaints">
                                  {consultation.complaints}
                                </Descriptions.Item>
                              )}
                              {consultation.examination && (
                                <Descriptions.Item label="Clinical Examination">
                                  {consultation.examination}
                                </Descriptions.Item>
                              )}
                              {consultation.advice && (
                                <Descriptions.Item label="Advice & Recommendations">
                                  {consultation.advice}
                                </Descriptions.Item>
                              )}
                            </Descriptions>
                          </div>
                        )}

                        {(consultation.complaints || consultation.examination || consultation.advice) && <Divider />}

                        {/* Clinical Examinations (Teeth) */}
                        {consultation.clinicalExaminations &&
                          consultation.clinicalExaminations.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">
                                Clinical Examinations
                              </h4>
                              <Table
                                dataSource={consultation.clinicalExaminations}
                                columns={[
                                  {
                                    title: 'Tooth',
                                    dataIndex: 'toothNumber',
                                    key: 'toothNumber',
                                    width: 80,
                                  },
                                  {
                                    title: 'Condition',
                                    dataIndex: 'conditionType',
                                    key: 'conditionType',
                                  },
                                  {
                                    title: 'Description',
                                    dataIndex: 'description',
                                    key: 'description',
                                    render: (desc: string) => desc || '-',
                                  },
                                ]}
                                pagination={false}
                                size="small"
                                bordered
                                rowKey={(record) => record.id || ''}
                              />
                            </div>
                          )}

                        {consultation.clinicalExaminations && consultation.clinicalExaminations.length > 0 && <Divider />}

                        {/* Procedures */}
                        {consultation.procedures && consultation.procedures.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Procedures</h4>
                            <Table
                              dataSource={consultation.procedures}
                              columns={[
                                {
                                  title: 'Procedure',
                                  dataIndex: 'name',
                                  key: 'name',
                                },
                                {
                                  title: 'Qty',
                                  dataIndex: 'quantity',
                                  key: 'quantity',
                                  width: 60,
                                  align: 'center' as const,
                                },
                                {
                                  title: 'Cost',
                                  dataIndex: 'unitCost',
                                  key: 'unitCost',
                                  width: 100,
                                  align: 'right' as const,
                                  render: (cost: number) => {
                                    const c = Number(cost) || 0;
                                    return `₹${c.toFixed(2)}`;
                                  },
                                },
                                {
                                  title: 'Subtotal',
                                  key: 'subtotal',
                                  width: 120,
                                  align: 'right' as const,
                                  render: (_, record) => {
                                    const unitCost = Number(record.unitCost) || 0;
                                    const quantity = Number(record.quantity) || 0;
                                    const discount = Number(record.discount) || 0;
                                    return `₹${(unitCost * quantity - discount).toFixed(2)}`;
                                  },
                                },
                              ]}
                              pagination={false}
                              size="small"
                              bordered
                              rowKey={(record) => record.id || ''}
                            />
                          </div>
                        )}

                        {consultation.procedures && consultation.procedures.length > 0 && <Divider />}

                        {/* Prescriptions */}
                        {consultation.prescriptions && consultation.prescriptions.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Prescriptions</h4>
                            {consultation.prescriptionNotes && (
                              <div className="mb-3 bg-purple-50 p-3 rounded border border-purple-200">
                                <p className="text-sm font-medium text-purple-900 mb-1">
                                  Prescription Notes:
                                </p>
                                <p className="text-sm text-purple-800">
                                  {consultation.prescriptionNotes}
                                </p>
                              </div>
                            )}
                            <Table
                              dataSource={consultation.prescriptions}
                              columns={[
                                {
                                  title: 'Medicine',
                                  dataIndex: 'name',
                                  key: 'name',
                                },
                                {
                                  title: 'Type',
                                  dataIndex: 'type',
                                  key: 'type',
                                  width: 100,
                                },
                                {
                                  title: 'Dosage (M-N-E)',
                                  key: 'dosage',
                                  width: 120,
                                  align: 'center' as const,
                                  render: (_, record) =>
                                    `${record.morning}-${record.noon}-${record.evening}`,
                                },
                                {
                                  title: 'Duration',
                                  key: 'duration',
                                  width: 100,
                                  render: (_, record) =>
                                    record.duration && record.durationType
                                      ? `${record.duration} ${record.durationType}${record.duration > 1 ? 's' : ''}`
                                      : '-',
                                },
                              ]}
                              pagination={false}
                              size="small"
                              bordered
                              rowKey={(record) => record.id || ''}
                            />
                          </div>
                        )}

                        {consultation.prescriptions && consultation.prescriptions.length > 0 && <Divider />}

                        {/* Billing Summary */}
                        {consultation.billing && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                              <DollarOutlined className="mr-2 text-green-600" />
                              Billing Summary
                            </h4>
                            <div className="bg-gray-50 p-4 rounded border border-gray-200">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <span className="text-sm text-gray-600">Consultation Fee:</span>
                                  <span className="ml-2 font-semibold">
                                    ₹{(Number(consultation.billing.consultationFee) || 0).toFixed(2)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">Procedures:</span>
                                  <span className="ml-2 font-semibold">
                                    ₹{(Number(consultation.billing.procedureAmount) || 0).toFixed(2)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">Other Charges:</span>
                                  <span className="ml-2 font-semibold">
                                    ₹{(Number(consultation.billing.otherAmount) || 0).toFixed(2)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">Discount:</span>
                                  <span className="ml-2 font-semibold text-red-600">
                                    -₹{(Number(consultation.billing.discount) || 0).toFixed(2)}
                                  </span>
                                </div>
                                {consultation.billing.applyGst && (
                                  <div>
                                    <span className="text-sm text-gray-600">GST (18%):</span>
                                    <span className="ml-2 font-semibold">
                                      ₹{(Number(consultation.billing.tax) || 0).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                                <div className="col-span-2 border-t border-gray-300 pt-2 mt-2">
                                  <span className="text-base font-bold text-gray-900">
                                    Total Amount:
                                  </span>
                                  <span className="ml-2 text-lg font-bold text-green-700">
                                    ₹{(Number(consultation.billing.totalAmount) || 0).toFixed(2)}
                                  </span>
                                </div>
                                {consultation.billing.pendingAmount !== undefined &&
                                  Number(consultation.billing.pendingAmount) > 0 && (
                                    <div className="col-span-2 bg-red-50 p-2 rounded">
                                      <span className="text-sm font-semibold text-red-900">
                                        Pending Amount:
                                      </span>
                                      <span className="ml-2 text-base font-bold text-red-700">
                                        ₹{(Number(consultation.billing.pendingAmount) || 0).toFixed(2)}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        )}

                        {consultation.billing && <Divider />}

                        {/* Payments */}
                        {consultation.payments && consultation.payments.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Payments</h4>
                            <Table
                              dataSource={consultation.payments}
                              columns={[
                                {
                                  title: '#',
                                  key: 'index',
                                  width: 50,
                                  render: (_, __, index) => index + 1,
                                },
                                {
                                  title: 'Amount',
                                  dataIndex: 'amountPaid',
                                  key: 'amountPaid',
                                  width: 120,
                                  render: (amount: number) => {
                                    const amt = Number(amount) || 0;
                                    return (
                                      <span className="font-semibold text-green-700">
                                        ₹{amt.toFixed(2)}
                                      </span>
                                    );
                                  },
                                },
                                {
                                  title: 'Method',
                                  dataIndex: 'modeOfPayment',
                                  key: 'modeOfPayment',
                                  width: 120,
                                },
                                {
                                  title: 'Reference',
                                  dataIndex: 'paymentReference',
                                  key: 'paymentReference',
                                  render: (ref: string) => ref || '-',
                                },
                              ]}
                              pagination={false}
                              size="small"
                              bordered
                              rowKey={(record) => record.id || ''}
                              summary={() => (
                                <Table.Summary>
                                  <Table.Summary.Row className="bg-blue-50">
                                    <Table.Summary.Cell index={0}>
                                      <strong>Total Paid:</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                      <strong className="text-green-700">
                                        ₹
                                        {consultation.payments
                                          ?.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0)
                                          .toFixed(2)}
                                      </strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} colSpan={2} />
                                  </Table.Summary.Row>
                                </Table.Summary>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

ConsultationsTab.displayName = 'ConsultationsTab';
