/**
 * Billing & Payments Tab Component
 * Displays financial summary, bills, and payment history
 */

import React from 'react';
import { Card, Row, Col, Table, Tag, Alert, Spin, Empty, Statistic } from 'antd';
import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useConsultations } from '@/modules/consultation/hooks/useConsultations';
import { formatDate } from '../../utils/avatarUtils';
import { PaymentStatus } from '@/modules/consultation/types/consultation.types';

interface BillingTabProps {
  patientId: string;
}

export const BillingTab: React.FC<BillingTabProps> = ({ patientId }) => {
  // Fetch consultations with billing info
  const { data: consultations, isLoading, isError } = useConsultations({ patientId });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Loading billing information..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert
        message="Error Loading Billing Data"
        description="Failed to load billing information. Please try again."
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
          description="No billing records found for this patient"
        />
      </div>
    );
  }

  // Calculate totals - ensure values are numbers
  const totalBilled = consultations.reduce((sum, c) => sum + (Number(c.billing?.totalAmount) || 0), 0);
  const totalPending = consultations.reduce((sum, c) => sum + (Number(c.billing?.pendingAmount) || 0), 0);
  const totalPaid = totalBilled - totalPending;

  // Get all payments from all consultations
  const allPayments = consultations.flatMap((consultation) =>
    (consultation.payments || []).map((payment) => ({
      ...payment,
      consultationId: consultation.id,
      consultationDate: consultation.createdAt,
      doctor: consultation.doctor,
    }))
  );

  // Get payment status color
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

  // Bills table columns
  const billsColumns = [
    {
      title: 'Date',
      key: 'date',
      width: 120,
      render: (_: unknown, record: (typeof consultations)[0]) => formatDate(record.createdAt),
    },
    {
      title: 'Consultation ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (id: string) => <span className="font-mono text-xs">{id.slice(0, 8)}</span>,
    },
    {
      title: 'Doctor',
      key: 'doctor',
      width: 200,
      render: (_: unknown, record: (typeof consultations)[0]) =>
        record.doctor
          ? `Dr. ${record.doctor.firstName} ${record.doctor.lastName}`
          : 'Not specified',
    },
    {
      title: 'Total Amount',
      key: 'totalAmount',
      width: 120,
      align: 'right' as const,
      render: (_: unknown, record: (typeof consultations)[0]) => {
        const total = Number(record.billing?.totalAmount) || 0;
        return <span className="font-semibold">₹{total.toFixed(2)}</span>;
      },
    },
    {
      title: 'Paid',
      key: 'paid',
      width: 120,
      align: 'right' as const,
      render: (_: unknown, record: (typeof consultations)[0]) => {
        const total = Number(record.billing?.totalAmount) || 0;
        const pending = Number(record.billing?.pendingAmount) || 0;
        const paid = total - pending;
        return <span className="text-green-700 font-semibold">₹{paid.toFixed(2)}</span>;
      },
    },
    {
      title: 'Pending',
      key: 'pending',
      width: 120,
      align: 'right' as const,
      render: (_: unknown, record: (typeof consultations)[0]) => {
        const pending = Number(record.billing?.pendingAmount) || 0;
        return <span className="text-orange-600 font-semibold">₹{pending.toFixed(2)}</span>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: 140,
      render: (_: unknown, record: (typeof consultations)[0]) => (
        <Tag color={getPaymentStatusColor(record.billing?.paymentStatus)}>
          {record.billing?.paymentStatus || 'Unknown'}
        </Tag>
      ),
    },
  ];

  // Payments table columns
  const paymentsColumns = [
    {
      title: 'Date',
      key: 'date',
      width: 120,
      render: (_: unknown, record: (typeof allPayments)[0]) => formatDate(record.consultationDate),
    },
    {
      title: 'Consultation ID',
      dataIndex: 'consultationId',
      key: 'consultationId',
      width: 150,
      render: (id: string) => <span className="font-mono text-xs">{id.slice(0, 8)}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => {
        const amt = Number(amount) || 0;
        return <span className="font-semibold text-green-700">₹{amt.toFixed(2)}</span>;
      },
    },
    {
      title: 'Payment Method',
      dataIndex: 'modeOfPayment',
      key: 'modeOfPayment',
      width: 140,
    },
    {
      title: 'Reference',
      dataIndex: 'paymentReference',
      key: 'paymentReference',
      render: (ref: string) => ref || '-',
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 120,
      render: (status: PaymentStatus) => (
        <Tag color={getPaymentStatusColor(status)}>{status || 'Completed'}</Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Billed"
              value={totalBilled}
              prefix={<DollarOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff' }}
              precision={2}
              suffix="₹"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Paid"
              value={totalPaid}
              prefix={<CheckCircleOutlined className="text-green-600" />}
              valueStyle={{ color: '#52c41a' }}
              precision={2}
              suffix="₹"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Pending Amount"
              value={totalPending}
              prefix={
                totalPending > 0 ? (
                  <WarningOutlined className="text-orange-600" />
                ) : (
                  <CheckCircleOutlined className="text-green-600" />
                )
              }
              valueStyle={{ color: totalPending > 0 ? '#fa8c16' : '#52c41a' }}
              precision={2}
              suffix="₹"
            />
          </Card>
        </Col>
      </Row>

      {/* Pending Amount Alert */}
      {totalPending > 0 && (
        <Alert
          message="Pending Payment"
          description={`This patient has a pending amount of ₹${totalPending.toFixed(2)} to be paid.`}
          type="warning"
          showIcon
          icon={<ClockCircleOutlined />}
        />
      )}

      {/* Bills Table */}
      <Card
        title={
          <span className="text-lg font-semibold">
            <DollarOutlined className="mr-2" />
            Bills & Invoices
          </span>
        }
        className="shadow-sm"
      >
        <Table
          dataSource={consultations}
          columns={billsColumns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} bills`,
          }}
          scroll={{ x: 800 }}
          size="middle"
        />
      </Card>

      {/* Payment History Table */}
      <Card
        title={
          <span className="text-lg font-semibold">
            <CheckCircleOutlined className="mr-2" />
            Payment History
          </span>
        }
        className="shadow-sm"
      >
        {allPayments.length > 0 ? (
          <Table
            dataSource={allPayments}
            columns={paymentsColumns}
            rowKey={(record) => record.id || ''}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} payments`,
            }}
            scroll={{ x: 800 }}
            size="middle"
            summary={() => (
              <Table.Summary>
                <Table.Summary.Row className="bg-green-50">
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <strong className="text-base">Total Paid:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <strong className="text-lg text-green-700">
                      ₹
                      {allPayments
                        .reduce((sum, payment) => sum + (Number(payment.amountPaid) || 0), 0)
                        .toFixed(2)}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} colSpan={3} />
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No payment records found"
            className="py-8"
          />
        )}
      </Card>
    </div>
  );
};

BillingTab.displayName = 'BillingTab';
