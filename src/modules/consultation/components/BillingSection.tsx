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

import React, { useEffect, useMemo } from 'react';
import { Field, FieldProps, FormikProps } from 'formik';
import { InputNumber, Switch, Card, Divider } from 'antd';
import { DollarOutlined, PercentageOutlined, CalculatorOutlined } from '@ant-design/icons';
import { ConsultationFormValues } from '../types/consultation.types';

interface BillingSectionProps {
  formik: FormikProps<ConsultationFormValues>;
}

export const BillingSection: React.FC<BillingSectionProps> = ({ formik }) => {
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

  // Update billing values when calculations change
  useEffect(() => {
    formik.setFieldValue('billing.procedureAmount', procedureAmount);
    formik.setFieldValue('billing.subTotal', subTotal);
    formik.setFieldValue('billing.tax', tax);
    formik.setFieldValue('billing.totalAmount', totalAmount);
  }, [procedureAmount, subTotal, tax, totalAmount]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <DollarOutlined className="text-2xl text-green-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">Billing & Payment</h3>
      </div>

      {/* Billing Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Other Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Other Charges
            </label>
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
            <p className="text-xs text-gray-500 mt-1">
              Additional charges (lab tests, materials, etc.)
            </p>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount
            </label>
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
            </div>

            {/* Calculation Formula Info */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-900 font-medium mb-1">Calculation Formula:</p>
              <p className="text-xs text-blue-800">
                Total = (Procedures + Consultation Fee + Other) {formik.values.billing.applyGst ? '+ GST (5%)' : ''} - Discount
              </p>
              <p className="text-xs text-blue-700 mt-1">
                = ({procedureAmount.toFixed(2)} + {(formik.values.billing.consultationFee || 0).toFixed(2)} + {(formik.values.billing.otherAmount || 0).toFixed(2)})
                {formik.values.billing.applyGst && ` + ${tax.toFixed(2)}`}
                {(formik.values.billing.discount || 0) > 0 && ` - ${(formik.values.billing.discount || 0).toFixed(2)}`}
              </p>
            </div>
          </Card>

          {/* Payment Section Placeholder */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Payment Records</h4>
            <p className="text-xs text-gray-600">
              Payment tracking functionality can be added here (amount paid, balance due, payment method)
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-900">
          <strong>💡 Note:</strong> All amounts are auto-calculated in real-time. The procedure amount
          is automatically summed from the Procedures section. Adjust consultation fee, other charges,
          discount, and GST as needed.
        </p>
      </div>
    </div>
  );
};

BillingSection.displayName = 'BillingSection';
