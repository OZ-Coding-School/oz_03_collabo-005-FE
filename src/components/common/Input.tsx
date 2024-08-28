import { ChangeEventHandler, InputHTMLAttributes } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  inputSize: InputSize;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  isFilled?: boolean;
}

type InputSize = 'normal';

const inputClasses = {
  normal: 'w-full',
};

const Input = ({
  title,
  inputSize,
  className,
  register,
  type,
  name,
  placeholder,
  error,
  onChange,
  maxLength,
  isFilled,
}: InputProps) => {
  const inputClass = twMerge(
    inputClasses[inputSize],
    className,
    isFilled ? 'border-gray-98' : 'border-gray-d9',
    error ? 'border-red' : '',
  );
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-[8px]">
        {title}
      </label>
      <input
        {...register}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className={`${inputClass} h-[56px] rounded-lg border border-gray-d9 py-[15px] pl-[15px] focus:border-gray-98`}
        maxLength={maxLength}
      />
      <div className="mb-[24px]">{error?.message && <span className="text-sm text-red">{error.message}</span>}</div>
    </div>
  );
};

export default Input;
