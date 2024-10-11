import React from 'react';
import { FTILink } from './FTILink';
import { LoadingSpinner } from './LoadingSpinner';
import { ProfileImageInput } from './ProfileImageInput';

interface ProfileImageSectionProps {
  profileImg: string;
  isLoading: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ftiType: string | null;
}

export const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  profileImg,
  isLoading,
  handleImageChange,
  ftiType,
}) => {
  return (
    <div className="flex h-[35%] flex-col items-center justify-evenly p-[1rem]">
      <div className="relative mb-3 flex w-[30%] items-center justify-center pt-[10%] xs:w-[40%] xs:pt-[40%]">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <img
            className="absolute inset-0 h-full w-full rounded-full object-cover"
            src={profileImg}
            alt="프로필 이미지"
          />
        )}
        <ProfileImageInput handleImageChange={handleImageChange} />
      </div>
      <FTILink ftiType={ftiType} />
    </div>
  );
};
