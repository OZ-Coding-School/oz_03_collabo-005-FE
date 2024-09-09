import { IoCloseOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import ModalCenter from '../../components/common/ModalCenter';
import 'react-day-picker/dist/style.css';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // useNavigate import 추가
import { authInstance } from '../../api/util/instance'; // authInstance 가져오기
import { getCookie } from '../../utils/cookie';

interface FormData {
  title: string;
  content: string;
  category_name: string;
  review_image_url: string;
}

interface Category {
  id: number;
  category: string;
}

const BoardPost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>(); // useForm 훅을 사용하여 폼 데이터
  const navigate = useNavigate(); // useNavigate 훅 사용

  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false); // 중앙 모달의 열림/닫힘 상태
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // 선택된 카테고리 방법을 관리
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택된 이미지
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 이미지 미리보기
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태
  const [uploadProgress, setUploadProgress] = useState(0); // 업로드 진행률
  const [currentUploadingIndex, setCurrentUploadingIndex] = useState(0); // 현재 업로드 중인 이미지 인덱스
  // const [representativeImage, setRepresentativeImage] = useState<number | null>(null); // 대표 이미지
  const [modalMessage, setModalMessage] = useState({ title1: '', title2: '' }); // 모달 메시지
  const [categories, setCategories] = useState<Category[]>([]); // 카테고리 목록
  const [step, setStep] = useState(0); // 스텝 상태

  const watchTitle = watch('title');
  const watchContent = watch('content');

  useEffect(() => {
    if (!getCookie('refresh')) {
      navigate('/');
    }

    const fetchCategories = async () => {
      try {
        const response = await authInstance.get('/api/categories/reviewfilter/');
        setCategories(response.data);
      } catch (error) {
        console.error('카테고리를 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchCategories();
  }, [navigate]);

  // 중앙 모달의 열림/닫힘 상태 modal
  const toggleCenterModal = () => {
    setIsCenterModalOpen((prev) => !prev);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setIsUploading(true);
      setUploadProgress(0);
      setCurrentUploadingIndex(0);

      try {
        const compressedFile = await compressImageToWebp(file);
        setSelectedImage(compressedFile);
        const preview = URL.createObjectURL(compressedFile);
        setImagePreview(preview);
        setIsUploading(false);
        console.log('이미지 업로드가 완료되었습니다.');
      } catch (error) {
        console.error('이미지 업로드 중 오류가 발생했습니다:', error);
        setIsUploading(false);
      }
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

  const handleImageRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSelectedImage(null);
    setImagePreview(null);
  };

  //  폼 데이터 제출 시 미입력 필드에 따른 Modal 알림
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
      let reviewImageUrl = '';
      if (selectedImage) {
        // 선택된 이미지를 새로운 파일로 생성
        const newFile = new File([selectedImage], selectedImage.name);
        const formData = new FormData();
        // 폼 데이터에 input_source - s3 에 저정될 폴더이름과 images 파일이 들어갈 공간 추가
        formData.append('input_source', 'board');
        formData.append('images', newFile);

        // 이미지 업로드 API 호출
        const response = await authInstance.post('/api/common/image/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // 업로드된 이미지 URL 저장
        reviewImageUrl = response.data.images_urls[0];
      }

      // 리뷰 생성 API 호출
      const response = await authInstance.post('/api/reviews/detail/create/', {
        title: data.title, // 제목
        category_name: selectedCategory, // 카테고리 이름
        content: data.content, // 내용
        review_image_url: reviewImageUrl, // 리뷰 이미지 URL
      });

      console.log(response.data);
      setModalMessage({ title1: '맛있는 발견 글 쓰기가 완료되었습니다.', title2: '' });
      const reviewUuid = response.data.review_uuid;
      toggleCenterModal();
      navigate(`/board/${reviewUuid}`);
    } catch (error) {
      console.error('글 쓰기 중 오류가 발생했습니다:', error);
      setModalMessage({ title1: '글 쓰기 중 오류가 발생했습니다.', title2: '다시 시도해주세요.' });
      toggleCenterModal();
    }
  };

  {
    /* 폼 제출에 문제 알림 modal */
  }
  <ModalCenter
    isOpen={isCenterModalOpen}
    onClose={toggleCenterModal}
    title1={modalMessage.title1}
    title2={modalMessage.title2}>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1 }}
      onClick={async () => {
        if (modalMessage.title1 === '맛있는 발견 글 쓰기가 완료되었습니다.') {
          navigate('/board');
        } else {
          toggleCenterModal();
        }
      }}
      className="mt-4 h-[50px] w-full rounded-xl bg-orange-500 px-4 py-2 font-bold text-white">
      확인
    </motion.button>
  </ModalCenter>;

  useEffect(() => {
    let newStep = 0;
    if (selectedCategory) newStep++;
    if (watchTitle) newStep++;
    if (watchContent) newStep++;
    setStep(newStep);
  }, [selectedCategory, watchTitle, watchContent]);

  const totalSteps = 3;
  const stepsCompleted = step;

  const getButtonText = () => {
    if (isUploading) return '현재 이미지 처리중입니다';
    switch (stepsCompleted) {
      case 0:
        return 'Step.1 카테고리를 선택해주세요';
      case 1:
        return 'Step.2 제목을 입력해주세요';

      case 2:
        return 'Step.3 내용을 입력해주세요';
      case 3:
        return '여기를 눌러 등록을 완료해주세요';
      default:
        return '등록하기';
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false); // 폼 제출 상태

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <div className="relative mx-auto max-w-full rounded-2xl bg-white p-4 shadow-2xl">
        <div className="mb-2 flex items-center font-semibold">1. 카테고리를 선택해주세요.</div>
        <div className="mb-2 flex flex-wrap items-center">
          {categories.map((category: Category) => (
            <button
              key={category.id}
              type="button"
              className={`my-1 mr-2 h-[35px] rounded-lg border-2 px-2 transition-all duration-100 ease-in-out hover:underline hover:shadow-md ${selectedCategory === category.category ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'} hover:scale-105 hover:bg-[#E0D4C3] active:scale-90 active:bg-[#D1C4B2]`}
              onClick={() => {
                setSelectedCategory(category.category);
                return category.category;
              }}>
              {category.category}
            </button>
          ))}
        </div>

        <div className="mb-2 mt-5 flex items-center font-semibold">2. 제목</div>
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          className="mt-1 block h-[40px] w-full rounded-md border border-gray-300 px-3 transition-all duration-100 ease-in-out hover:shadow-md"
          {...register('title', { required: true })}
        />
        {errors.title && <p className="font-semibold text-orange-900">※ 제목은 필수 입력입니다</p>}

        <div className="mb-2 mt-5 flex items-center font-semibold">3. 내용</div>

        <textarea
          placeholder="내용을 입력해주세요"
          className="mt-1 block w-full resize-none rounded-md border border-gray-300 px-3 py-3 transition-all duration-100 ease-in-out hover:shadow-md"
          {...register('content', { required: true })}
          rows={5} // 내용 입력 textarea에서 5줄이상 초과되면 자동으로 입력 칸 길이 확장
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
        {errors.content && <p className="font-semibold text-orange-900">※ 내용은 필수 입력입니다</p>}

        <div className="mb-3 mt-10 flex items-center font-semibold">(선택) 이미지 등록</div>
        <div className="flex items-center">
          <label htmlFor="file-upload" className="cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center rounded-lg border border-gray-300 px-4 py-2 transition-all duration-100 hover:shadow-md">
              <img src="../images/ThunderImageUpdate.svg" alt="이미지 등록" className="h-[20px] text-gray-500" />
              <span className="text-gray-500">{selectedImage ? '1/1' : '0/1'}</span>
            </motion.div>
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          {imagePreview && (
            <div className="relative ml-2 mt-2 flex flex-wrap items-center">
              <motion.div
                className="relative mb-2 mr-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}>
                <motion.img
                  src={imagePreview}
                  alt="미리보기"
                  className="h-16 w-16 cursor-pointer rounded-xl border-2 border-[#ECECEC]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
                <button onClick={handleImageRemove} className="absolute -top-1 left-[55px] right-0" title="이미지 삭제">
                  <IoCloseOutline className="text-md rounded-xl bg-black text-white" />
                </button>
                <div className="absolute -bottom-0 left-1/2 flex h-[20px] w-[61px] -translate-x-1/2 transform items-center justify-center rounded-b-lg bg-black text-center">
                  <span className="items-center justify-center text-[10px] text-white">대표사진</span>
                </div>
              </motion.div>
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

        <div className="mb-20 xs:mb-10" />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className={`mt-4 flex w-full justify-center rounded-xl px-4 py-4 font-bold text-white shadow-lg transition-colors duration-200 ease-in-out ${
            isUploading || stepsCompleted < totalSteps ? 'cursor-not-allowed' : ''
          }`}
          style={{
            background: `linear-gradient(to right, #FFA500 ${(stepsCompleted / totalSteps) * 100}%, #1c3e8e)`,
          }}
          disabled={isUploading || stepsCompleted < totalSteps}
          onClick={() => setIsSubmitting(true)}>
          {getButtonText()}
        </motion.button>
      </div>
      {isSubmitting && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-white"
        />
      )}
    </motion.form>
  );
};

export default BoardPost;
