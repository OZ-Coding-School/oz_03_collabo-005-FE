import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import imageCompression from 'browser-image-compression';
import Button from '../../components/common/Button';
import ProfileModal from '../../components/myprofile/ProfileModal';
import { motion } from 'framer-motion';
import { authInstance, baseInstance } from '../../api/util/instance';
import { getCookie } from '../../utils/cookie';

type FormData = {
  nickname: string;
  introduce: string;
};

const MyProfileEdit = () => {
  const location = useLocation();
  const user = location.state?.user;
  const [profileImg, setProfileImg] = useState(user?.profileImageUrl || '/images/anonymous_avatars.svg');
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  console.log(compressedFile);
  const [duplicateNickname, setDuplicateNickname] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('profileImage');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      nickname: user?.nickname || '',
      introduce: user?.introduce || '',
    },
  });

  useEffect(() => {
    if (!getCookie('refresh')) {
      navigate('/');
    }
  }, []);

  const handleInputImageChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setOriginalFileName(file.name);
        //이미지 파일을 fileReader가 읽음
        const reader = new FileReader();
        // 읽기에 성공하면 내부코드를 실행함. result에 데이터 URL이 저장됨. readAsDataURL보다 먼저 정의 되어야 하는 이유는 이벤트는 실행되기 전에 먼저 정의되어 있어야 하기 때문. 41줄이 실행완료되면 reader.onload가 실행될 것
        reader.onload = () => {
          // 모달에서 이미지를 미리보기로 보기 위해서 preview로 전달함
          setPreview(reader.result as string);
          setIsModalOpen(true);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCroppedImageToWebp = async (croppedFile: File) => {
    try {
      setIsLoading(true);
      const options = {
        maxSizeMB: 1,
      };
      const compressedFile = await imageCompression(croppedFile, options);
      setCompressedFile(compressedFile);
      // 압축된 이미지의 미리보기를 위한 URL
      const compressedImageUrl = URL.createObjectURL(compressedFile);
      setProfileImg(compressedImageUrl);
    } catch (error) {
      console.error('이미지를 변환하는 중에 ' + error + '가 발생 했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (duplicateNickname !== '') {
      return;
    }
    const payload = {
      profile: {
        nickname: data.nickname,
        profile_image_url:
          'https://images.unsplash.com/photo-1725203574074-a33eae85ba71?q=80&w=1412&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        introduction: data.introduce,
      },
    };
    console.log(payload);
    const response = await authInstance.post('/api/profile', payload);
    console.log(response);
  };

  const handleNicknameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    if (nickname === user?.nickname) {
      setDuplicateNickname('');
      return;
    }
    try {
      const response = await baseInstance.post(`/api/users/checkNickname/`, { nickname: nickname });
      if (response.status === 200) {
        setDuplicateNickname('');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setDuplicateNickname(error.response.data.error);
      } else {
        console.error('닉네임 확인 중 오류가 발생했습니다.', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex h-[35%] flex-col items-center justify-evenly p-[1rem]">
        <div className="relative mb-3 flex w-[30%] items-center justify-center pt-[30%] xs:w-[35%] xs:pt-[35%]">
          {isLoading ? (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent" />
            </motion.div>
          ) : (
            <img
              className="absolute inset-0 h-full w-full rounded-full object-cover"
              src={profileImg}
              alt="프로필 이미지"
            />
          )}
          <input
            id="profileImg"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleInputImageChanged(e)}
          />
          <label
            htmlFor="profileImg"
            className="absolute bottom-2 right-2 h-[20%] w-[20%] cursor-pointer bg-[url('/images/edit_pencil.svg')] bg-cover xs:h-[30px] xs:w-[30px]"
          />
        </div>
        {user?.ftiType ? (
          <p className="text-[1rem] font-medium">{user?.ftiType}</p>
        ) : (
          <Link
            to={'/FTI'}
            className="mt-3 flex h-[52px] w-[33%] items-center justify-center rounded-lg bg-[#F5E3DB] text-[1rem] font-bold xs:h-[42px] xs:w-[40%] xs:text-[13px]">
            FTI 설정하기
          </Link>
        )}
      </div>
      <div className="m-[1rem]">
        <label htmlFor="nickname" className="mb-2 block font-medium xs:text-[14px]">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          className={`${duplicateNickname && 'border-primary'} h-[56px] w-full rounded-lg border py-[15px] pl-[15px] focus:border-gray-98 xs:h-[45px]`}
          {...register('nickname', { required: true })}
          onBlur={handleNicknameBlur}
        />
        <p className="ml-1 text-[12px] text-red">{duplicateNickname}</p>
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
      {isModalOpen && preview && (
        <ProfileModal
          preview={preview}
          modalClose={() => setIsModalOpen(false)}
          handleCroppedImageToWebp={handleCroppedImageToWebp}
          originalFileName={originalFileName}
        />
      )}
    </form>
  );
};

export default MyProfileEdit;
