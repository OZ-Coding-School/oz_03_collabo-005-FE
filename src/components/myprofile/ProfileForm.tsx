import React from 'react';
import Button from '../../components/common/Button';
import { UseFormRegister } from 'react-hook-form';

interface ProfileFormProps {
  register: UseFormRegister<any>;
  duplicateNickname: string;
  handleNicknameBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  register,
  duplicateNickname,
  handleNicknameBlur,
  isLoading,
}) => {
  return (
    <div className="m-[1rem]">
      <label htmlFor="nickname" className="mb-2 block font-medium xs:text-[14px]">
        닉네임
      </label>
      <input
        id="nickname"
        type="text"
        className={`${duplicateNickname ? 'border-primary' : ''} h-[56px] w-full rounded-lg border py-[15px] pl-[15px] focus:border-gray-98 xs:h-[45px]`}
        {...register('nickname', { required: true })}
        onBlur={handleNicknameBlur}
      />
      {duplicateNickname && <p className="ml-1 text-[12px] text-red">{duplicateNickname}</p>}
      <label htmlFor="introduce" className="mb-2 mt-5 block font-medium xs:mb-1 xs:mt-2 xs:text-[14px]">
        내 소개
      </label>
      <input
        id="introduce"
        type="text"
        className="h-[56px] w-full rounded-lg border py-[15px] pl-[15px] text-[#2D2C2C] focus:border-gray-98 xs:h-[45px]"
        {...register('introduce')}
      />
      <Button
        type="submit"
        className={`mt-10 h-[56px] font-bold xs:mt-8 xs:h-[45px] ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
        buttonSize="normal"
        bgColor="filled"
        disabled={duplicateNickname !== '' ? true : false}>
        저장하기
      </Button>
    </div>
  );
};
