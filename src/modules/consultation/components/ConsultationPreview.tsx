/**
 * Consultation Preview Section
 * Displays all consultation data in a printable format
 */

import React from 'react';
import { FormikProps } from 'formik';
import { Button, Table, Divider } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { ConsultationFormValues } from '../types/consultation.types';

interface ConsultationPreviewProps {
  formik: FormikProps<ConsultationFormValues>;
}

export const ConsultationPreview: React.FC<ConsultationPreviewProps> = ({ formik }) => {
  const handlePrint = () => {
    window.print();
  };

  const { values } = formik;

  // Calculate totals
  const proceduresTotal = values.procedures.reduce(
    (sum, proc) => sum + (proc.unitCost * proc.quantity - (proc.discount || 0)),
    0
  );

  const billingSubtotal = (values.billing?.consultationFee || 0) + proceduresTotal + (values.billing?.otherAmount || 0);
  const billingDiscount = values.billing?.discount || 0;
  const billingGST = values.billing?.applyGst ? (billingSubtotal - billingDiscount) * 0.18 : 0;
  const billingTotal = billingSubtotal - billingDiscount + billingGST;

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
      render: (_: any, record: any) =>
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
      render: (strength: string, record: any) => strength && record.unit ? `${strength} ${record.unit}` : '-',
    },
    {
      title: 'Dosage (M-N-E)',
      key: 'dosage',
      align: 'center' as const,
      render: (_: any, record: any) => `${record.morning}-${record.noon}-${record.evening}`,
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_: any, record: any) =>
        record.duration && record.durationType
          ? `${record.duration} ${record.durationType}${record.duration > 1 ? 's' : ''}`
          : '-',
    },
  ];

  return (
    <div className="consultation-preview">
      {/* Print Button - Only visible on screen */}
      <div className="flex justify-end mb-4 print:hidden">
        <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          Print Consultation
        </Button>
      </div>

      {/* Preview Content */}
      <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
        {/* Basic Information */}
        {(values.complaints || values.examination || values.advice) && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                Basic Information
              </h3>
              <Table
                dataSource={[
                  values.complaints && {
                    key: 'complaints',
                    field: 'Chief Complaints',
                    value: values.complaints,
                  },
                  values.examination && {
                    key: 'examination',
                    field: 'Clinical Examination',
                    value: values.examination,
                  },
                  values.advice && {
                    key: 'advice',
                    field: 'Advice & Recommendations',
                    value: values.advice,
                  },
                ].filter(Boolean)}
                columns={[
                  {
                    title: 'Field',
                    dataIndex: 'field',
                    key: 'field',
                    width: '25%',
                    render: (text: string) => <strong>{text}</strong>,
                  },
                  {
                    title: 'Details',
                    dataIndex: 'value',
                    key: 'value',
                    render: (text: string) => (
                      <div className="whitespace-pre-wrap">{text}</div>
                    ),
                  },
                ]}
                pagination={false}
                bordered
                size="small"
              />
            </div>
            <Divider />
          </>
        )}

        {/* Clinical Examinations (Teeth) */}
        {values.clinicalExaminations.length > 0 && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                Clinical Examinations (Teeth)
              </h3>
              <Table
                dataSource={values.clinicalExaminations}
                columns={[
                  {
                    title: 'Tooth Number',
                    dataIndex: 'toothNumber',
                    key: 'toothNumber',
                    width: '15%',
                    align: 'center' as const,
                    render: (num: number) => <strong>Tooth {num}</strong>,
                  },
                  {
                    title: 'Condition Type',
                    dataIndex: 'conditionType',
                    key: 'conditionType',
                    width: '25%',
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
                size="small"
              />
            </div>
            <Divider />
          </>
        )}

        {/* Procedures */}
        {values.procedures.length > 0 && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                Procedures
              </h3>
              <Table
                dataSource={values.procedures}
                columns={proceduresColumns}
                rowKey={(_, index) => index?.toString() || '0'}
                pagination={false}
                bordered
                size="small"
                summary={() => (
                  <Table.Summary>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={4} align="right">
                        <strong>Total:</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <strong>₹{proceduresTotal.toFixed(2)}</strong>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </div>
            <Divider />
          </>
        )}

        {/* Prescriptions */}
        {values.prescriptions.length > 0 && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                Prescriptions
              </h3>

              {values.prescriptionNotes && (
                <div className="mb-4 bg-purple-50 p-3 rounded border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-1">Prescription Notes:</p>
                  <p className="text-sm text-purple-800">{values.prescriptionNotes}</p>
                </div>
              )}

              <Table
                dataSource={values.prescriptions}
                columns={prescriptionsColumns}
                rowKey={(_, index) => index?.toString() || '0'}
                pagination={false}
                bordered
                size="small"
              />
            </div>
            <Divider />
          </>
        )}

        {/* Billing Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
            Billing Summary
          </h3>
          <div className="max-w-2xl ml-auto">
            <Table
              dataSource={[
                {
                  key: 'consultation',
                  description: 'Consultation Fee',
                  amount: (values.billing?.consultationFee || 0).toFixed(2),
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
                  amount: (values.billing?.otherAmount || 0).toFixed(2),
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
                ...(values.billing?.applyGst
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
                  render: (text: string, record: any) => (
                    <span
                      className={
                        record.type === 'total'
                          ? 'font-bold text-lg'
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
                  width: '30%',
                  render: (amount: string, record: any) => (
                    <span
                      className={
                        record.type === 'total'
                          ? 'font-bold text-lg text-green-700'
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
              size="small"
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

        {/* Payments */}
        {values.payments.length > 0 && (
          <>
            <Divider />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                Payment Details
              </h3>
              <div className="max-w-2xl ml-auto space-y-4">
                {/* Payments Table */}
                <Table
                  dataSource={values.payments.map((payment, index) => ({
                    ...payment,
                    key: index,
                  }))}
                  columns={[
                    {
                      title: 'Payment Method',
                      dataIndex: 'paymentMethod',
                      key: 'paymentMethod',
                      render: (method: string) => (
                        <span className="font-medium">{method}</span>
                      ),
                    },
                    {
                      title: 'Transaction ID',
                      dataIndex: 'transactionId',
                      key: 'transactionId',
                      render: (txnId: string) => txnId || '-',
                    },
                    {
                      title: 'Amount',
                      dataIndex: 'amount',
                      key: 'amount',
                      align: 'right' as const,
                      width: '25%',
                      render: (amount: number) => (
                        <span className="font-semibold text-green-700">
                          ₹{amount.toFixed(2)}
                        </span>
                      ),
                    },
                  ]}
                  pagination={false}
                  bordered
                  size="small"
                  summary={() => (
                    <Table.Summary>
                      <Table.Summary.Row className="bg-green-50">
                        <Table.Summary.Cell index={0} colSpan={2}>
                          <strong className="text-base">Total Paid:</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="right">
                          <strong className="text-base text-green-700">
                            ₹{values.payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                          </strong>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />

                {/* Balance Due */}
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900">Balance Due:</span>
                    <span className="font-bold text-xl text-red-700">
                      ₹{(billingTotal - values.payments.reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .consultation-preview,
          .consultation-preview * {
            visibility: visible;
          }
          .consultation-preview {
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

ConsultationPreview.displayName = 'ConsultationPreview';
