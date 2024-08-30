import { IoCloseOutline } from 'react-icons/io5';
import { useState } from 'react';
import ModalCenter from '../../components/common/ModalCenter';
import 'react-day-picker/dist/style.css';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // useNavigate import 추가
import { authInstance } from '../../api/util/instance'; // authInstance 가져오기

interface FormData {
  title: string;
  category: number; // category 속성 수정
  content: string;
  review_image_url: string;
}

const BoardPost = () => {
  const { register, handleSubmit } = useForm<FormData>(); // useForm 훅을 사용하여 폼 데이터
  const navigate = useNavigate(); // useNavigate 훅 사용

  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false); // 중앙 모달의 열림/닫힘 상태
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // 선택된 카테고리 방법을 관리
  const [selectedImages, setSelectedImages] = useState<File[]>([]); // 선택된 이미지
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // 이미지 미리보기
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태
  const [uploadProgress, setUploadProgress] = useState(0); // 업로드 진행률
  const [currentUploadingIndex, setCurrentUploadingIndex] = useState(0); // 현재 업로드 중인 이미지 인덱스
  const [representativeImage, setRepresentativeImage] = useState<number | null>(null); // 대표 이미지
  const [modalMessage, setModalMessage] = useState({ title1: '', title2: '' }); // 모달 메시지

  // 중앙 모달의 열림/닫힘 상태 modal
  const toggleCenterModal = () => {
    setIsCenterModalOpen((prev) => !prev);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (selectedImages.length + files.length > 10) {
        setModalMessage({ title1: '이미지는 최대 10장까지', title2: '등록할 수 있습니다.' });
        toggleCenterModal();
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      setCurrentUploadingIndex(0);

      const compressedFiles = await Promise.all(
        files.map(async (file, index) => {
          setCurrentUploadingIndex(index + 1);
          console.log(`현재 ${index + 1}번째의 이미지를 처리하고 있습니다. (총 ${files.length}개 중)`);
          const compressedFile = await compressImageToWebp(file);
          setUploadProgress(((index + 1) / files.length) * 100);
          return compressedFile;
        }),
      );

      setSelectedImages((prevImages) => [...prevImages, ...compressedFiles]);

      const newPreviews = compressedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      setIsUploading(false);
      console.log('이미지 업로드가 완료되었습니다.');
    }
  };

  const compressImageToWebp = async (file: File): Promise<File> => {
    try {
      const options = {
        maxSizeMB: 1,
      };
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('이미지를 변환하는 중에 ' + error + '가 발생 했습니다.');
      throw error;
    }
  };

  const handleImageRemove = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    if (representativeImage === index) {
      setRepresentativeImage(null);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (selectedCategory === null) {
      setModalMessage({ title1: '카테고리를 선택해주세요', title2: '' });
      toggleCenterModal();
      return;
    }
    if (!data.title) {
      setModalMessage({ title1: '제목을 적어주세요', title2: '' });
      toggleCenterModal();
      return;
    }
    if (!data.content) {
      setModalMessage({ title1: '내용을 적어주세요', title2: '' });
      toggleCenterModal();
      return;
    }

    try {
      const formData = {
        title: data.title,
        category: selectedCategory === 0 ? 1 : 2,
        content: data.content,
        review_image_url: selectedImages.length > 0 ? selectedImages[0] : '',
      };

      try {
        const response = await authInstance.post('/api/reviews/detail/create/', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('폼 제출 성공:', response.data);
        setModalMessage({ title1: '폼 제출에 성공했습니다.', title2: '게시물이 등록되었습니다.' });
        toggleCenterModal();
      } catch (error) {
        console.error('서버 요청 중 오류가 발생했습니다:', error);
        setModalMessage({ title1: '서버 요청 중 오류가 발생했습니다.', title2: '다시 시도해주세요.' });
        toggleCenterModal();
      }
    } catch (error) {
      console.error('폼 제출 실패:', error);
      setModalMessage({ title1: '폼 제출에 실패했습니다.', title2: '다시 시도해주세요.' });
      toggleCenterModal();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative mx-auto max-w-full rounded-lg bg-white p-4">
        <div className="mb-2 flex items-center font-semibold">카테고리를 선택해주세요.</div>

        <div className="mb-2 flex items-center">
          <button
            type="button"
            className={`mr-2 h-[35px] rounded-lg px-2 ${selectedCategory === 0 ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
            onClick={() => {
              setSelectedCategory(0);
              return 1;
            }}>
            소셜 다이닝 후기
          </button>
          <button
            type="button"
            className={`mr-2 h-[35px] rounded-lg px-2 ${selectedCategory === 1 ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
            onClick={() => {
              setSelectedCategory(1);
              return 2;
            }}>
            맛집 추천
          </button>
        </div>

        <div className="mb-2 mt-5 flex items-center font-semibold">제목</div>
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          className="mt-1 block h-[40px] w-full rounded-md border border-gray-300 px-3"
          {...register('title')}
        />

        <div className="mb-2 mt-5 flex items-center font-semibold">내용</div>

        <textarea
          placeholder="내용을 입력해주세요"
          className="mt-1 block w-full resize-none rounded-md border border-gray-300 px-3 py-3"
          {...register('content')}
          rows={5} // 내용 입력 textarea에서 5줄이상 초과되면 자동으로 입력 칸 길이 확장
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        <div className="mb-2 mt-5 flex items-center font-semibold">이미지 등록</div>
        <div className="flex items-center">
          <label htmlFor="file-upload" className="cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center rounded-lg border border-gray-300 px-4 py-2">
              <img src="../images/ThunderImageUpdate.svg" alt="이미지 등록" className="h-[20px] text-gray-500" />
              <span className="text-gray-500">{`${selectedImages.length}/10`}</span>
            </motion.div>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreviews.length > 0 && (
            <div className="relative ml-2 mt-2 flex flex-wrap items-center">
              {imagePreviews.map((preview, index) => (
                <motion.div
                  key={index}
                  className="relative mb-2 mr-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}>
                  <motion.img
                    src={preview}
                    alt={`미리보기 ${index + 1}`}
                    className="h-16 w-16 cursor-pointer rounded-xl border-2 border-[#ECECEC]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <button
                    onClick={(event) => handleImageRemove(index, event)}
                    className="absolute -top-1 left-[55px] right-0"
                    title="이미지 삭제">
                    <IoCloseOutline className="text-md rounded-xl bg-black text-white" />
                  </button>
                  {index === 0 && (
                    <div className="absolute -bottom-0 left-1/2 flex h-[20px] w-[61px] -translate-x-1/2 transform items-center justify-center rounded-b-lg bg-black text-center">
                      <span className="items-center justify-center text-[10px] text-white">대표사진</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
        {isUploading && (
          <div className="mb-2 mt-2 text-center font-semibold">
            사진 업로드 하는 중입니다. <br />
            현재 {currentUploadingIndex}장의 사진이 업로드 중입니다.
            <div className="relative pt-1">
              <div className="flex h-4 overflow-hidden rounded bg-gray-200 text-xs">
                <motion.div
                  style={{
                    width: `${uploadProgress}%`,
                    transition: 'width 0.1s ease-in-out',
                  }}
                  className="flex flex-col justify-center whitespace-nowrap rounded-xl bg-blue-500 text-center text-white shadow-none"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-gray-500">이미지 압축을 처리하고 있습니다.</span>
            </div>
          </div>
        )}

        <div className="mb-20" />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className={`mt-4 flex w-full justify-center rounded-xl px-4 py-4 font-bold text-white ${isUploading ? 'animate-gradient bg-gradient-to-r from-orange-500 to-orange-700' : 'bg-orange-500'}`}
          disabled={isUploading}>
          {isUploading ? '현재 이미지 처리중입니다' : '등록하기'}
        </motion.button>
        {/* 이미지가 최대 10장이상을 넘어 업로드될 경우에 나오는 modal */}
        <ModalCenter
          isOpen={isCenterModalOpen}
          onClose={toggleCenterModal}
          title1={modalMessage.title1}
          title2={modalMessage.title2}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            onClick={() => {
              if (modalMessage.title1 === '폼 제출에 성공했습니다.') {
                navigate('/board');
              } else {
                toggleCenterModal();
              }
            }}
            className="mt-4 h-[50px] w-full rounded-xl bg-orange-500 px-4 py-2 font-bold text-white">
            확인
          </motion.button>
        </ModalCenter>
      </div>
    </form>
  );
};

export default BoardPost;
