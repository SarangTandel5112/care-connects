/**
 * Consultation Details Component
 * Displays full consultation information in an attractive, professional format
 * Used for consultation detail page view
 */

import React from 'react';
import { Table, Divider, Button, Tag, Empty } from 'antd';
import {
  PrinterOutlined,
  CalendarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Consultation, CreateProcedure, CreatePrescription } from '../types/consultation.types';
import { format } from 'date-fns';

interface BillingRow {
  key: string;
  description: string;
  amount: string;
  type: string;
}

interface ConsultationDetailsProps {
  consultation: Consultation;
  onPrint?: () => void;
}

export const ConsultationDetails: React.FC<ConsultationDetailsProps> = ({
  consultation,
  onPrint,
}) => {
  // Calculate totals
  const proceduresTotal =
    consultation.procedures?.reduce(
      (sum, proc) => sum + proc.unitCost * proc.quantity - (proc.discount || 0),
      0
    ) || 0;

  const billingSubtotal =
    (consultation.billing?.consultationFee || 0) +
    proceduresTotal +
    (consultation.billing?.otherAmount || 0);
  const billingDiscount = consultation.billing?.discount || 0;
  const billingGST = consultation.billing?.applyGst ? (billingSubtotal - billingDiscount) * 0.18 : 0;
  const billingTotal = billingSubtotal - billingDiscount + billingGST;

  const totalPaid =
    consultation.payments?.reduce((sum, p) => sum + (p.amountPaid || 0), 0) || 0;
  const balanceDue = billingTotal - totalPaid;

  // Procedures columns
  const proceduresColumns = [
    {
      title: 'Procedure',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unitCost',
      key: 'unitCost',
      align: 'right' as const,
      render: (cost: number) => `₹${cost.toFixed(2)}`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      align: 'right' as const,
      render: (discount: number) => `₹${(discount || 0).toFixed(2)}`,
    },
    {
      title: 'Total',
      key: 'total',
      align: 'right' as const,
      render: (_: unknown, record: CreateProcedure) =>
        `₹${(record.unitCost * record.quantity - (record.discount || 0)).toFixed(2)}`,
    },
  ];

  // Prescriptions columns
  const prescriptionsColumns = [
    {
      title: 'Medicine',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: 'Strength',
      dataIndex: 'strength',
      key: 'strength',
      render: (strength: string, record: CreatePrescription) =>
        strength && record.unit ? `${strength} ${record.unit}` : '-',
    },
    {
      title: 'Dosage (M-N-E)',
      key: 'dosage',
      align: 'center' as const,
      render: (_: unknown, record: CreatePrescription) =>
        `${record.morning}-${record.noon}-${record.evening}`,
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_: unknown, record: CreatePrescription) =>
        record.duration && record.durationType
          ? `${record.duration} ${record.durationType}${record.duration > 1 ? 's' : ''}`
          : '-',
    },
  ];

  return (
    <div className="consultation-details-page">
      {/* Header with Print Button */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-100 shadow-sm print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md">
              <MedicineBoxOutlined className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Consultation Details</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <CalendarOutlined />
                  <span>
                    {consultation.createdAt
                      ? format(new Date(consultation.createdAt), 'MMM dd, yyyy')
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <UserOutlined />
                  <span>
                    {consultation.patient
                      ? `${consultation.patient.firstName} ${consultation.patient.lastName}`
                      : 'Unknown Patient'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PrinterOutlined />}
            onClick={onPrint || (() => window.print())}
          >
            Print
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        {/* Patient Information Card */}
        {consultation.patient && (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserOutlined className="text-blue-600" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">
                    {consultation.patient.firstName} {consultation.patient.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900">
                    {consultation.patient.mobile || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Age / Gender</p>
                  <p className="font-semibold text-gray-900">
                    {consultation.patient.age ? `${consultation.patient.age} years` : 'N/A'}
                    {consultation.patient.age && consultation.patient.gender && ' • '}
                    {consultation.patient.gender || ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">
                    {consultation.patient.location || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <Divider />
          </>
        )}

        {/* Doctor Information */}
        {consultation.doctor && (
          <>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-gray-600 mb-1">Consulting Doctor</p>
              <p className="font-semibold text-gray-900">
                Dr. {consultation.doctor.firstName} {consultation.doctor.lastName}
              </p>
            </div>
            <Divider />
          </>
        )}

        {/* Basic Information */}
        {(consultation.complaints || consultation.examination || consultation.advice) && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b-2 border-blue-500 pb-2">
                Clinical Information
              </h3>
              <Table
                dataSource={
                  [
                    {
                      key: 'titles',
                      chiefComplaints: 'Chief Complaints',
                      clinicalExamination: 'Clinical Examination',
                      adviceRecommendations: 'Advice & Recommendations',
                    },
                    {
                      key: 'descriptions',
                      chiefComplaints: consultation.complaints || '-',
                      clinicalExamination: consultation.examination || '-',
                      adviceRecommendations: consultation.advice || '-',
                    },
                  ] as Array<{
                    key: string;
                    chiefComplaints: string;
                    clinicalExamination: string;
                    adviceRecommendations: string;
                  }>
                }
                columns={[
                  {
                    title: 'Chief Complaints',
                    dataIndex: 'chiefComplaints',
                    key: 'chiefComplaints',
                    width: '33%',
                    render: (text: string, record: { key: string }) => (
                      <div className="whitespace-pre-wrap">
                        {record.key === 'titles' ? (
                          <strong className="text-gray-800">{text}</strong>
                        ) : (
                          <span className="text-gray-700">{text}</span>
                        )}
                      </div>
                    ),
                  },
                  {
                    title: 'Clinical Examination',
                    dataIndex: 'clinicalExamination',
                    key: 'clinicalExamination',
                    width: '33%',
                    render: (text: string, record: { key: string }) => (
                      <div className="whitespace-pre-wrap">
                        {record.key === 'titles' ? (
                          <strong className="text-gray-800">{text}</strong>
                        ) : (
                          <span className="text-gray-700">{text}</span>
                        )}
                      </div>
                    ),
                  },
                  {
                    title: 'Advice & Recommendations',
                    dataIndex: 'adviceRecommendations',
                    key: 'adviceRecommendations',
                    width: '34%',
                    render: (text: string, record: { key: string }) => (
                      <div className="whitespace-pre-wrap">
                        {record.key === 'titles' ? (
                          <strong className="text-gray-800">{text}</strong>
                        ) : (
                          <span className="text-gray-700">{text}</span>
                        )}
                      </div>
                    ),
                  },
                ]}
                pagination={false}
                bordered
                size="middle"
                showHeader={false}
                rowClassName={(record) => (record.key === 'titles' ? 'bg-gray-50' : '')}
              />
            </div>
            <Divider />
          </>
        )}

        {/* Clinical Examinations (Teeth) */}
        {consultation.clinicalExaminations && consultation.clinicalExaminations.length > 0 && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b-2 border-green-500 pb-2">
                Clinical Examinations (Teeth)
              </h3>
              <Table
                dataSource={consultation.clinicalExaminations}
                columns={[
                  {
                    title: 'Tooth Number',
                    dataIndex: 'toothNumber',
                    key: 'toothNumber',
                    width: '15%',
                    align: 'center' as const,
                    render: (num: number) => (
                      <Tag color="blue" className="font-semibold">
                        Tooth {num}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Condition Type',
                    dataIndex: 'conditionType',
                    key: 'conditionType',
                    width: '25%',
                    render: (type: string) => (
                      <span className="font-medium text-gray-900 capitalize">{type}</span>
                    ),
                  },
                  {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                    render: (desc: string) => desc || '-',
                  },
                ]}
                rowKey={(_, index) => index?.toString() || '0'}
                pagination={false}
                bordered
                size="middle"
              />
            </div>
            <Divider />
          </>
        )}

        {/* Procedures */}
        {consultation.procedures && consultation.procedures.length > 0 ? (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b-2 border-purple-500 pb-2 flex items-center gap-2">
                <MedicineBoxOutlined className="text-purple-600" />
                Procedures Performed
              </h3>
              <Table
                dataSource={consultation.procedures}
                columns={proceduresColumns}
                rowKey={(_, index) => index?.toString() || '0'}
                pagination={false}
                bordered
                size="middle"
                summary={() => (
                  <Table.Summary>
                    <Table.Summary.Row className="bg-purple-50">
                      <Table.Summary.Cell index={0} colSpan={4} align="right">
                        <strong className="text-base">Total:</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <strong className="text-base text-purple-700">
                          ₹{proceduresTotal.toFixed(2)}
                        </strong>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </div>
            <Divider />
          </>
        ) : null}

        {/* Prescriptions */}
        {consultation.prescriptions && consultation.prescriptions.length > 0 ? (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b-2 border-pink-500 pb-2 flex items-center gap-2">
                <MedicineBoxOutlined className="text-pink-600" />
                Prescriptions
              </h3>

              {consultation.prescriptionNotes && (
                <div className="mb-4 bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <p className="text-sm font-semibold text-pink-900 mb-1">Prescription Notes:</p>
                  <p className="text-sm text-pink-800">{consultation.prescriptionNotes}</p>
                </div>
              )}

              <Table
                dataSource={consultation.prescriptions}
                columns={prescriptionsColumns}
                rowKey={(_, index) => index?.toString() || '0'}
                pagination={false}
                bordered
                size="middle"
              />
            </div>
            <Divider />
          </>
        ) : null}

        {/* Billing and Payment Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b-2 border-green-500 pb-2 flex items-center gap-2">
            <DollarOutlined className="text-green-600" />
            Billing & Payment Summary
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Payment Details */}
            {consultation.payments && consultation.payments.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-gray-800 mb-2">Payment Details</h4>
                {/* Payments Table */}
                <Table
                  dataSource={consultation.payments.map((payment, index) => ({
                    ...payment,
                    key: index,
                  }))}
                  columns={[
                    {
                      title: '#',
                      key: 'index',
                      width: '15%',
                      align: 'center' as const,
                      render: (_: unknown, __: unknown, index: number) => index + 1,
                    },
                    {
                      title: 'Method',
                      dataIndex: 'modeOfPayment',
                      key: 'modeOfPayment',
                      render: (method: string) => <span className="font-medium">{method}</span>,
                    },
                    {
                      title: 'Amount',
                      dataIndex: 'amountPaid',
                      key: 'amountPaid',
                      align: 'right' as const,
                      width: '30%',
                      render: (amount: number) => (
                        <span className="font-semibold text-green-700">
                          ₹{(amount || 0).toFixed(2)}
                        </span>
                      ),
                    },
                  ]}
                  pagination={false}
                  bordered
                  size="middle"
                  summary={() => (
                    <Table.Summary>
                      <Table.Summary.Row className="bg-green-50">
                        <Table.Summary.Cell index={0} colSpan={2} align="right">
                          <strong className="text-base">Total Paid:</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="right">
                          <strong className="text-base text-green-700">
                            ₹{totalPaid.toFixed(2)}
                          </strong>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />

                {/* Balance Due */}
                <div
                  className={`${balanceDue > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base text-gray-900">
                      {balanceDue > 0 ? 'Balance Due:' : 'Paid in Full'}
                    </span>
                    <span
                      className={`font-bold text-xl ${balanceDue > 0 ? 'text-red-700' : 'text-green-700'}`}
                    >
                      ₹{balanceDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <Empty
                  description="No payments recorded"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="my-2"
                />
              </div>
            )}

            {/* Right: Billing Summary */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">Billing Summary</h4>
              <Table<BillingRow>
                dataSource={[
                  {
                    key: 'consultation',
                    description: 'Consultation Fee',
                    amount: (consultation.billing?.consultationFee || 0).toFixed(2),
                    type: 'item',
                  },
                  {
                    key: 'procedures',
                    description: 'Procedures Total',
                    amount: proceduresTotal.toFixed(2),
                    type: 'item',
                  },
                  {
                    key: 'other',
                    description: 'Other Charges',
                    amount: (consultation.billing?.otherAmount || 0).toFixed(2),
                    type: 'item',
                  },
                  {
                    key: 'subtotal',
                    description: 'Subtotal',
                    amount: billingSubtotal.toFixed(2),
                    type: 'subtotal',
                  },
                  ...(billingDiscount > 0
                    ? [
                        {
                          key: 'discount',
                          description: 'Discount',
                          amount: `-${billingDiscount.toFixed(2)}`,
                          type: 'discount',
                        },
                      ]
                    : []),
                  ...(consultation.billing?.applyGst
                    ? [
                        {
                          key: 'gst',
                          description: 'GST (18%)',
                          amount: billingGST.toFixed(2),
                          type: 'tax',
                        },
                      ]
                    : []),
                  {
                    key: 'total',
                    description: 'Total Amount',
                    amount: billingTotal.toFixed(2),
                    type: 'total',
                  },
                ]}
                columns={[
                  {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                    render: (text: string, record: { type: string }) => (
                      <span
                        className={
                          record.type === 'total'
                            ? 'font-bold text-base'
                            : record.type === 'subtotal'
                              ? 'font-semibold'
                              : ''
                        }
                      >
                        {text}
                      </span>
                    ),
                  },
                  {
                    title: 'Amount',
                    dataIndex: 'amount',
                    key: 'amount',
                    align: 'right' as const,
                    width: '40%',
                    render: (amount: string, record: { type: string }) => (
                      <span
                        className={
                          record.type === 'total'
                            ? 'font-bold text-base text-green-700'
                            : record.type === 'discount'
                              ? 'text-red-600 font-semibold'
                              : record.type === 'tax'
                                ? 'text-blue-600 font-semibold'
                                : record.type === 'subtotal'
                                  ? 'font-semibold'
                                  : ''
                        }
                      >
                        ₹{amount}
                      </span>
                    ),
                  },
                ]}
                rowKey="key"
                pagination={false}
                bordered
                size="middle"
                rowClassName={(record) =>
                  record.type === 'total'
                    ? 'bg-green-50'
                    : record.type === 'subtotal'
                      ? 'bg-gray-50'
                      : ''
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .consultation-details-page,
          .consultation-details-page * {
            visibility: visible;
          }
          .consultation-details-page {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

ConsultationDetails.displayName = 'ConsultationDetails';
