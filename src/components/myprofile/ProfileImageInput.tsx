import React from 'react';

interface ProfileImageInputProps {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileImageInput: React.FC<ProfileImageInputProps> = ({ handleImageChange }) => (
  <>
    <input id="profileImg" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
    <label
      htmlFor="profileImg"
      className="absolute bottom-2 right-2 h-[20%] w-[20%] cursor-pointer bg-[url('/images/edit_pencil.svg')] bg-cover xs:h-[30px] xs:w-[30px]"
    />
  </>
);
