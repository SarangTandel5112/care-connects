/**
 * Billing Section
 * Handles billing calculations with auto-computed totals
 * Features:
 * - Auto-calculated procedure amount from procedures section
 * - Consultation fee and other charges
 * - Discount support
 * - GST calculation (5%)
 * - Real-time total calculation
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, FormikProps, FieldArray } from 'formik';
import { InputNumber, Switch, Card, Divider, Button, Select, Input } from 'antd';
import {
  DollarOutlined,
  PercentageOutlined,
  CalculatorOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { ConsultationFormValues, PaymentMethod, PaymentStatus } from '../types/consultation.types';

interface BillingSectionProps {
  formik: FormikProps<ConsultationFormValues>;
}

export const BillingSection: React.FC<BillingSectionProps> = ({ formik }) => {
  const [editingPaymentIndex, setEditingPaymentIndex] = useState<number | null>(null);

  // Calculate procedure amount from procedures
  const procedureAmount = useMemo(() => {
    return formik.values.procedures.reduce((total, procedure) => {
      const baseAmount = (procedure.unitCost || 0) * (procedure.quantity || 1);
      const subtotal = Math.max(0, baseAmount - (procedure.discount || 0));
      return total + subtotal;
    }, 0);
  }, [formik.values.procedures]);

  // Calculate subtotal (procedureAmount + consultationFee + otherAmount)
  const subTotal = useMemo(() => {
    return (
      procedureAmount +
      (formik.values.billing.consultationFee || 0) +
      (formik.values.billing.otherAmount || 0)
    );
  }, [procedureAmount, formik.values.billing.consultationFee, formik.values.billing.otherAmount]);

  // Calculate tax (5% if GST is applied)
  const tax = useMemo(() => {
    return formik.values.billing.applyGst ? subTotal * 0.05 : 0;
  }, [subTotal, formik.values.billing.applyGst]);

  // Calculate total amount (subTotal + tax - discount)
  const totalAmount = useMemo(() => {
    return Math.max(0, subTotal + tax - (formik.values.billing.discount || 0));
  }, [subTotal, tax, formik.values.billing.discount]);

  // Calculate total paid from payments
  const totalPaid = useMemo(() => {
    return formik.values.payments.reduce((total, payment) => {
      return total + (payment.amountPaid || 0);
    }, 0);
  }, [formik.values.payments]);

  // Calculate pending amount
  const pendingAmount = useMemo(() => {
    return Math.max(0, totalAmount - totalPaid);
  }, [totalAmount, totalPaid]);

  // Determine payment status
  const paymentStatus = useMemo(() => {
    if (totalPaid === 0) return PaymentStatus.PENDING;
    if (pendingAmount === 0) return PaymentStatus.PAID;
    return PaymentStatus.PARTIALLY_PAID;
  }, [totalPaid, pendingAmount]);

  // Update billing values when calculations change
  // Note: pendingAmount and paymentStatus are NOT sent to backend - they are calculated server-side
  useEffect(() => {
    formik.setFieldValue('billing.procedureAmount', procedureAmount);
    formik.setFieldValue('billing.subTotal', subTotal);
    formik.setFieldValue('billing.tax', tax);
    formik.setFieldValue('billing.totalAmount', totalAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [procedureAmount, subTotal, tax, totalAmount]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <DollarOutlined className="text-2xl text-green-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">Billing & Payment</h3>
      </div>

      {/* Billing Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input Fields */}
        <div className="space-y-4">
          {/* Procedure Amount (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Procedure Amount (Auto-calculated)
            </label>
            <div className="bg-gray-100 px-3 py-2 rounded border border-gray-300">
              <span className="text-lg font-semibold text-gray-900">
                ₹{procedureAmount.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Sum of all procedure subtotals from Procedures section
            </p>
          </div>

          {/* Consultation Fee, Other Charges, Discount in One Row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Consultation Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Fee
              </label>
              <Field name="billing.consultationFee">
                {({ field }: FieldProps) => (
                  <InputNumber
                    {...field}
                    value={field.value || 0}
                    onChange={(value) => formik.setFieldValue('billing.consultationFee', value || 0)}
                    min={0}
                    precision={2}
                    className="w-full"
                    size="large"
                    prefix="₹"
                  />
                )}
              </Field>
            </div>

            {/* Other Charges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Charges</label>
              <Field name="billing.otherAmount">
                {({ field }: FieldProps) => (
                  <InputNumber
                    {...field}
                    value={field.value || 0}
                    onChange={(value) => formik.setFieldValue('billing.otherAmount', value || 0)}
                    min={0}
                    precision={2}
                    className="w-full"
                    size="large"
                    prefix="₹"
                  />
                )}
              </Field>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
              <Field name="billing.discount">
                {({ field }: FieldProps) => (
                  <InputNumber
                    {...field}
                    value={field.value || 0}
                    onChange={(value) => formik.setFieldValue('billing.discount', value || 0)}
                    min={0}
                    max={subTotal + tax}
                    precision={2}
                    className="w-full"
                    size="large"
                    prefix="₹"
                  />
                )}
              </Field>
            </div>
          </div>

          {/* Apply GST */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
            <div>
              <label className="text-sm font-medium text-gray-700">Apply GST (5%)</label>
              <p className="text-xs text-gray-500 mt-1">Include 5% tax in total</p>
            </div>
            <Field name="billing.applyGst">
              {({ field }: FieldProps) => (
                <Switch
                  checked={field.value || false}
                  onChange={(checked) => formik.setFieldValue('billing.applyGst', checked)}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              )}
            </Field>
          </div>

          {/* Payment Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-gray-900">Payment Records</h4>
              {pendingAmount > 0 && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => {
                    const newPayment = {
                      amountPaid: Math.min(pendingAmount, totalAmount),
                      modeOfPayment: PaymentMethod.CASH,
                      paymentReference: '',
                      paymentStatus: PaymentStatus.PAID,
                    };
                    formik.setFieldValue('payments', [...formik.values.payments, newPayment]);
                  }}
                >
                  Add Payment
                </Button>
              )}
            </div>

            <FieldArray name="payments">
              {() => (
                <div className="space-y-4">
                  {formik.values.payments.length > 0 ? (
                    <>
                      {/* Payment Edit Form (Only show when editing) */}
                      {editingPaymentIndex !== null && (
                        <div className="p-4 bg-blue-50 rounded border-2 border-blue-300 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-blue-900">
                              Editing Payment #{editingPaymentIndex + 1}
                            </span>
                            <Button
                              type="default"
                              size="small"
                              onClick={() => setEditingPaymentIndex(null)}
                            >
                              Done
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            {/* Amount Paid */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Amount <span className="text-red-500">*</span>
                              </label>
                              <Field name={`payments.${editingPaymentIndex}.amountPaid`}>
                                {({ field }: FieldProps) => (
                                  <InputNumber
                                    {...field}
                                    value={field.value || 0}
                                    onChange={(value) =>
                                      formik.setFieldValue(`payments.${editingPaymentIndex}.amountPaid`, value || 0)
                                    }
                                    min={0}
                                    max={pendingAmount + (formik.values.payments[editingPaymentIndex]?.amountPaid || 0)}
                                    precision={2}
                                    className="w-full"
                                    prefix="₹"
                                    size="middle"
                                  />
                                )}
                              </Field>
                            </div>

                            {/* Mode of Payment */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Method <span className="text-red-500">*</span>
                              </label>
                              <Field name={`payments.${editingPaymentIndex}.modeOfPayment`}>
                                {({ field }: FieldProps) => (
                                  <Select
                                    {...field}
                                    value={field.value || PaymentMethod.CASH}
                                    onChange={(value) =>
                                      formik.setFieldValue(`payments.${editingPaymentIndex}.modeOfPayment`, value)
                                    }
                                    className="w-full"
                                    size="middle"
                                    options={Object.values(PaymentMethod).map((method) => ({
                                      label: method,
                                      value: method,
                                    }))}
                                  />
                                )}
                              </Field>
                            </div>

                            {/* Payment Reference */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Reference
                              </label>
                              <Field name={`payments.${editingPaymentIndex}.paymentReference`}>
                                {({ field }: FieldProps) => (
                                  <Input
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) =>
                                      formik.setFieldValue(
                                        `payments.${editingPaymentIndex}.paymentReference`,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ref #"
                                    size="middle"
                                  />
                                )}
                              </Field>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Payment Table Display */}
                      <div className="mt-4 border border-gray-200 rounded overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                                #
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                                Amount
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                                Method
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                                Reference
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {formik.values.payments.map((payment, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-gray-900">{index + 1}</td>
                                <td className="px-3 py-2 font-semibold text-gray-900">
                                  ₹{(payment.amountPaid || 0).toFixed(2)}
                                </td>
                                <td className="px-3 py-2 text-gray-700">{payment.modeOfPayment}</td>
                                <td className="px-3 py-2 text-gray-600 text-xs">
                                  {payment.paymentReference || '-'}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <div className="flex justify-center gap-1">
                                    <Button
                                      type="text"
                                      size="small"
                                      icon={<EditOutlined />}
                                      onClick={() => setEditingPaymentIndex(index)}
                                      className="text-blue-600 hover:text-blue-700"
                                    />
                                    <Button
                                      type="text"
                                      size="small"
                                      danger
                                      icon={<DeleteOutlined />}
                                      onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this payment record?')) {
                                          const newPayments = formik.values.payments.filter((_, i) => i !== index);
                                          formik.setFieldValue('payments', newPayments);
                                        }
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-blue-50 font-semibold">
                              <td className="px-3 py-2 text-gray-900" colSpan={1}>
                                Total
                              </td>
                              <td className="px-3 py-2 text-blue-700">₹{totalPaid.toFixed(2)}</td>
                              <td className="px-3 py-2" colSpan={3}></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded">
                      <p className="text-sm">No payments recorded yet</p>
                      <p className="text-xs mt-1">Click &quot;Add Payment&quot; to record a payment</p>
                    </div>
                  )}
                </div>
              )}
            </FieldArray>
          </div>
        </div>

        {/* Right Column - Calculation Summary */}
        <div>
          <Card
            title={
              <span>
                <CalculatorOutlined className="mr-2" />
                Billing Summary
              </span>
            }
            className="shadow-md"
          >
            <div className="space-y-3">
              {/* Procedure Amount */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Procedure Amount:</span>
                <span className="font-semibold text-gray-900">₹{procedureAmount.toFixed(2)}</span>
              </div>

              {/* Consultation Fee */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Consultation Fee:</span>
                <span className="font-semibold text-gray-900">
                  ₹{(formik.values.billing.consultationFee || 0).toFixed(2)}
                </span>
              </div>

              {/* Other Amount */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Other Charges:</span>
                <span className="font-semibold text-gray-900">
                  ₹{(formik.values.billing.otherAmount || 0).toFixed(2)}
                </span>
              </div>

              <Divider className="my-2" />

              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium">Subtotal:</span>
                <span className="font-bold text-gray-900">₹{subTotal.toFixed(2)}</span>
              </div>

              {/* Tax (if applicable) */}
              {formik.values.billing.applyGst && (
                <div className="flex justify-between items-center text-blue-700">
                  <span>
                    <PercentageOutlined className="mr-1" />
                    GST (5%):
                  </span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
              )}

              {/* Discount (if applicable) */}
              {(formik.values.billing.discount || 0) > 0 && (
                <div className="flex justify-between items-center text-red-600">
                  <span>Discount:</span>
                  <span className="font-semibold">
                    -₹{(formik.values.billing.discount || 0).toFixed(2)}
                  </span>
                </div>
              )}

              <Divider className="my-2" />

              {/* Total Amount */}
              <div className="flex justify-between items-center bg-green-50 p-3 rounded">
                <span className="text-lg font-bold text-green-900">Total Amount:</span>
                <span className="text-2xl font-bold text-green-700">₹{totalAmount.toFixed(2)}</span>
              </div>

              {/* Payment Information */}
              <Divider className="my-2" />

              {/* Total Paid */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Paid:</span>
                <span className="font-semibold text-blue-600">₹{totalPaid.toFixed(2)}</span>
              </div>

              {/* Pending Amount */}
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium">Pending Amount:</span>
                <span
                  className={`font-bold text-lg ${pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}
                >
                  ₹{pendingAmount.toFixed(2)}
                </span>
              </div>

              {/* Payment Status */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Payment Status:</span>
                <span
                  className={`font-semibold px-2 py-1 rounded text-sm ${
                    paymentStatus === PaymentStatus.PAID
                      ? 'bg-green-100 text-green-700'
                      : paymentStatus === PaymentStatus.PARTIALLY_PAID
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {paymentStatus}
                </span>
              </div>
            </div>

            {/* Calculation Formula Info */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-900 font-medium mb-1">Calculation Formula:</p>
              <p className="text-xs text-blue-800">
                Total = (Procedures + Consultation Fee + Other){' '}
                {formik.values.billing.applyGst ? '+ GST (5%)' : ''} - Discount
              </p>
              <p className="text-xs text-blue-700 mt-1">
                = ({procedureAmount.toFixed(2)} +{' '}
                {(formik.values.billing.consultationFee || 0).toFixed(2)} +{' '}
                {(formik.values.billing.otherAmount || 0).toFixed(2)})
                {formik.values.billing.applyGst && ` + ${tax.toFixed(2)}`}
                {(formik.values.billing.discount || 0) > 0 &&
                  ` - ${(formik.values.billing.discount || 0).toFixed(2)}`}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Info Box */}
      {/* <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-900">
          <strong>💡 Note:</strong> All amounts are auto-calculated in real-time. The procedure amount
          is automatically summed from the Procedures section. Adjust consultation fee, other charges,
          discount, and GST as needed.
        </p>
      </div> */}
    </div>
  );
};

BillingSection.displayName = 'BillingSection';
