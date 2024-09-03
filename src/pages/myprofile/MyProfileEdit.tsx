import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import ModalCenter from '../../components/common/ModalCenter';
import ProfileModal from '../../components/myprofile/ProfileModal';
import imageCompression from 'browser-image-compression';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authInstance, baseInstance } from '../../api/util/instance';
import { getCookie } from '../../utils/cookie';
import { ProfileImageSection } from '../../components/myprofile/ProfileImageSection';
import { ProfileForm } from '../../components/myprofile/ProfileForm';

interface FormData {
  nickname: string;
  introduce: string;
}

const MyProfileEdit = () => {
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();

  const [profileImg, setProfileImg] = useState(user?.profile_image_url || '/images/anonymous_avatars.svg');
  const [duplicateNickname, setDuplicateNickname] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('profileImage');
  const [isLoading, setIsLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState<boolean | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // 이미지 파일을 저장하는 state

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      nickname: user?.nickname || '',
      introduce: user?.introduction || '',
    },
  });

  useEffect(() => {
    if (!getCookie('refresh')) {
      navigate('/');
    }
  }, [navigate]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setOriginalFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
          setIsModalOpen(true);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageCompression = async (croppedFile: File) => {
    setIsLoading(true);
    try {
      const compressedFile = await compressImage(croppedFile);
      setImageFile(compressedFile); // 압축된 이미지를 state에 저장
      const compressedImageUrl = URL.createObjectURL(compressedFile);
      setProfileImg(compressedImageUrl);
    } catch (error) {
      console.error('이미지 처리 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const compressImage = async (image: File) => {
    const options = { maxSizeMB: 1 };
    return await imageCompression(image, options);
  };

  const handleNicknameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    if (nickname === user?.nickname) {
      setDuplicateNickname('');
      return;
    }
    try {
      await checkDuplicateNickname(nickname);
      setDuplicateNickname('');
    } catch (error: any) {
      setDuplicateNickname(error.response?.data.error || '닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const checkDuplicateNickname = async (nickname: string) => {
    const response = await baseInstance.post(`/api/users/checkNickname/`, { nickname });
    if (response.status !== 200) {
      throw new Error('닉네임 중복 확인 실패');
    }
  };

  const uploadImage = async (file: File) => {
    const newFile = new File([file], file.name);
    const formData = new FormData();
    formData.append('input_source', 'profile');
    formData.append('images', newFile);
    const response = await authInstance.post('/api/common/image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.images_urls[0];
  };

  const onSubmit = async (data: FormData) => {
    if (duplicateNickname) return;

    try {
      let profileImageUrl = profileImg;

      if (imageFile) {
        // 이미지 파일이 있을 경우에만 업로드
        profileImageUrl = await uploadImage(imageFile);
      }

      const response = await authInstance.post('/api/profile/update/', {
        nickname: data.nickname,
        profile_image_url: profileImageUrl,
        introduction: data.introduce,
      });

      setValue('nickname', response.data.nickname);
      setProfileImg(response.data.profile_image_url);
      setValue('introduce', response.data.introduction);
      setModalSuccess(true);
    } catch (error) {
      console.error('프로필 업데이트 중 오류가 발생했습니다:', error);
      setModalSuccess(false);
    }
  };

  const closeModal = () => setModalSuccess(null);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ProfileImageSection
        profileImg={profileImg}
        isLoading={isLoading}
        handleImageChange={handleImageChange}
        ftiType={user?.ftiType}
      />
      <ProfileForm
        register={register}
        duplicateNickname={duplicateNickname}
        handleNicknameBlur={handleNicknameBlur}
        isLoading={isLoading}
      />
      {isModalOpen && preview && (
        <ProfileModal
          preview={preview}
          modalClose={() => setIsModalOpen(false)}
          handleCroppedImageToWebp={handleImageCompression}
          originalFileName={originalFileName}
        />
      )}
      {modalSuccess !== null && (
        <ModalCenter
          isOpen={modalSuccess !== null}
          onClose={closeModal}
          title1={modalSuccess ? '프로필이 성공적으로' : '프로필 업데이트에'}
          title2={modalSuccess ? '업데이트 되었습니다.' : '실패했습니다.'}>
          <Button
            buttonSize="normal"
            bgColor="filled"
            className="mt-5 h-[46px] w-[112px] font-bold"
            onClick={closeModal}>
            닫기
          </Button>
        </ModalCenter>
      )}
    </form>
  );
};

export default MyProfileEdit;
