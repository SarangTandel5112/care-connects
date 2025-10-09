import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import Input from '../Input/Input';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
}

const Field: React.FC<FieldProps> = ({ label, error, register, ...props }) => {
  return <Input label={label} error={error} {...register} {...props} />;
};

export default Field;
