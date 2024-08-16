import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../store/store';
import { useForm } from 'react-hook-form';
import imageCompression from 'browser-image-compression';
import Button from '../../components/common/Button';
import ProfileModal from '../../components/myprofile/ProfileModal';

type FormData = {
  nickname: string;
  introduce: string;
};

const MyProfileEdit = () => {
  const { user } = useUserStore();
  const [profileImg, setProfileImg] = useState(user?.profileImageUrl || '/images/anonymous_avatars.svg');
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [duplicateNickname, setDuplicateNickname] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('profileImage');

  const { register, handleSubmit } = useForm({
    defaultValues: {
      nickname: user?.nickname || '',
      introduce: user?.introduce || '',
    },
  });

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
    // 사실 모달에서 이미지 크롭하면서 webp로 전환을 하지만, 용량까지 맞춰주진 않기 때문에 굳이 한번 더 함
    try {
      const options = {
        maxSizeMB: 1,
        fileType: 'image/webp',
      };
      const compressedFile = await imageCompression(croppedFile, options);
      setCompressedFile(compressedFile);
      // 압축된 이미지의 미리보기를 위한 URL
      const compressedImageUrl = URL.createObjectURL(compressedFile);
      setProfileImg(compressedImageUrl);
    } catch (error) {
      console.error('이미지를 변환하는 중에 ' + error + '가 발생 했습니다.');
    }
  };

  const onSubmit = async (data: FormData) => {
    if (duplicateNickname !== '') {
      return;
    }
    const formData = new FormData();
    formData.append('nickname', data.nickname);
    formData.append('introduce', data.introduce);
    if (compressedFile) {
      formData.append('profileImage', compressedFile);
    } else if (user?.profileImageUrl) {
      formData.append('profileImage', user.profileImageUrl);
    }
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    // formData를 서버에 제출할 코드
  };

  const handleNicknameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    console.log(nickname);
    setDuplicateNickname('사용할 수 없는 닉네임 입니다.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex h-[35%] flex-col items-center justify-evenly p-[1rem]">
        <div className="relative mb-3 flex w-[30%] items-center justify-center pt-[30%] xs:w-[35%] xs:pt-[35%]">
          <img
            className="absolute inset-0 h-full w-full rounded-full object-cover"
            src={profileImg}
            alt="프로필 이미지"
          />
          <input
            id="profileImg"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleInputImageChanged(e)}
          />
          <label
            htmlFor="profileImg"
            className="absolute bottom-2 right-2 h-[20%] w-[20%] cursor-pointer bg-[url('/images/edit_pencil.svg')] bg-cover"></label>
        </div>
        {user?.ftiType ? (
          <p className="text-[1rem] font-medium">{user?.ftiType}</p>
        ) : (
          <Link
            to={'/FTI'}
            className="mt-3 flex h-[62px] w-[33%] items-center justify-center rounded-lg bg-[#F5E3DB] text-[1rem] font-bold xs:h-[42px] xs:w-[40%] xs:text-[13px]">
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
          className="mt-10 h-[56px] font-bold xs:mt-8 xs:h-[45px]"
          buttonSize="normal"
          bgColor="filled">
          저장하기
        </Button>
      </div>
      {isModalOpen && preview && (
        <ProfileModal
          preview={preview}
          modalClose={() => setIsModalOpen(false)}
          handleCroppedImageToWebp={handleCroppedImageToWebp}
          originalFileName={originalFileName} // 동적으로 저장된 파일 이름을 전달
        />
      )}
    </form>
  );
};

export default MyProfileEdit;
