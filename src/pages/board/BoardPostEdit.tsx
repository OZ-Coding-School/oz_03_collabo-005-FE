import { IoCloseOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import ModalCenter from '../../components/common/ModalCenter';
import 'react-day-picker/dist/style.css';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { authInstance } from '../../api/util/instance';
import { getCookie } from '../../utils/cookie';

interface FormData {
  review_uuid: string;
  title: string;
  content: string;
  category_name: string;
  review_image_url: string;
  nickname: string;
}

interface Category {
  id: number;
  category: string;
}

const BoardPostEdit = () => {
  const location = useLocation();
  const { uuid } = useParams<{ uuid: string }>();
  const postData = location.state as {
    review_uuid: string;
    title: string;
    content: string;
    category_name: string;
    review_image_url: string | null;
    nickname: string;
  } | null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      review_uuid: postData?.review_uuid || uuid || '',
      nickname: postData?.nickname || '',
      category_name: postData?.category_name || '',
      title: postData?.title || '',
      content: postData?.content || '',
    },
  });

  const navigate = useNavigate();

  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(postData?.category_name || null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(postData?.review_image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadingIndex, setCurrentUploadingIndex] = useState(0);
  const [modalMessage, setModalMessage] = useState({ title1: '', title2: '' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [step, setStep] = useState(0);

  const watchTitle = watch('title');
  const watchContent = watch('content');

  useEffect(() => {
    if (!getCookie('refresh')) {
      navigate('/');
    }

    const fetchCategories = async () => {
      try {
        const response = await authInstance.get('/api/categories/reviewfilter/');
        const filteredCategories = response.data.filter((category: Category) => category.category !== '전체');
        setCategories(filteredCategories);
      } catch (error) {
        console.error('카테고리를 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchCategories();
  }, [navigate]);

  useEffect(() => {
    if (postData) {
      setValue('review_uuid', postData.review_uuid);
      setValue('title', postData.title);
      setValue('content', postData.content);
      setValue('category_name', postData.category_name);
      setValue('nickname', postData.nickname);
      setImagePreview(postData.review_image_url);
    }
  }, [postData, setValue]);

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
      let reviewImageUrl = imagePreview;
      if (selectedImage) {
        const newFile = new File([selectedImage], selectedImage.name);
        const formData = new FormData();
        formData.append('input_source', 'board');
        formData.append('images', newFile);

        const response = await authInstance.post('/api/common/image/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        reviewImageUrl = response.data.images_urls[0];
      }

      // 수정하기 요청 시 - api post
      const response = await authInstance.post(`/api/reviews/detail/update/`, {
        review_uuid: data.review_uuid,
        title: data.title,
        category_name: selectedCategory, // 여기를 수정했습니다
        nickname: data.nickname,
        content: data.content,
        review_image_url: reviewImageUrl,
      });

      console.log(response.data);
      setModalMessage({ title1: '맛있는 발견 글 수정이 완료되었습니다.', title2: '' });
      setIsCenterModalOpen(true);
    } catch (error) {
      console.error('글 수정 중 오류가 발생했습니다:', error);
      setModalMessage({ title1: '글 수정 중 오류가 발생했습니다.', title2: '다시 시도해주세요.' });
      toggleCenterModal();
    }
  };

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
    if (!selectedCategory) return 'Step.1 카테고리를 선택해주세요';
    if (!watchTitle) return 'Step.2 제목을 입력해주세요';
    if (!watchContent) return 'Step.3 내용을 입력해주세요';
    return '여기를 눌러 수정을 완료해주세요';
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <div className="relative mx-auto max-w-full rounded-2xl border-2 bg-white p-4 shadow-2xl md:mx-auto md:max-w-[1000px] md:pt-2 xs:mb-20">
        <div className="mb-2 flex items-center font-semibold">1. 카테고리를 선택해주세요.</div>
        <div className="mb-2 flex flex-wrap items-center">
          {categories.map((category: Category) => (
            <button
              key={category.id}
              type="button"
              className={`my-1 mr-2 h-[35px] rounded-lg border-2 px-2 transition-all duration-100 ease-in-out hover:underline hover:shadow-md ${
                selectedCategory === category.category ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'
              } hover:scale-105 hover:bg-[#E0D4C3] active:scale-90 active:bg-[#D1C4B2]`}
              onClick={() => {
                setSelectedCategory(category.category);
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
          rows={5}
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
              <span className="text-gray-500">{imagePreview ? '1/1' : '0/1'}</span>
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

      <ModalCenter
        isOpen={isCenterModalOpen}
        onClose={() => setIsCenterModalOpen(false)}
        title1={modalMessage.title1}
        title2={modalMessage.title2}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          onClick={() => {
            setIsCenterModalOpen(false);
            navigate('/board');
          }}
          className="mt-4 h-[50px] w-full rounded-xl bg-orange-500 px-4 py-2 font-bold text-white">
          확인
        </motion.button>
      </ModalCenter>
    </motion.form>
  );
};

export default BoardPostEdit;
