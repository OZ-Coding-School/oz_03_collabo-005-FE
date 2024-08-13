import { ChangeEventHandler, InputHTMLAttributes } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  inputSize: InputSize;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

type InputSize = 'normal';

const inputClasses = {
  normal: 'w-full',
};

const Input = ({ title, inputSize, className, register, type, name, placeholder, error, onChange }: InputProps) => {
  const inputClass = twMerge(inputClasses[inputSize], className);
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
        className={`${inputClass} focus:border-gray-98 border-gray-d9 h-[56px] rounded-lg border py-[15px] pl-[15px]`}
      />
      <div className="mb-[24px]">{error?.message && <span className="text-red text-sm">{error.message}</span>}</div>
    </div>
  );
};

export default Input;
