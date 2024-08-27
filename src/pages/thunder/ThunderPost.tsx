import { MdKeyboardArrowRight } from 'react-icons/md';
import { IoMdCheckmark } from 'react-icons/io';
import { IoCloseOutline } from 'react-icons/io5';
import { useState } from 'react';
import ModalBottom from '../../components/common/ModalBottom';
import ModalCenter from '../../components/common/ModalCenter';
import ThunderClockModal from '../../components/thunder/ThunderClockModal';
import ThunderCalendarModal from '../../components/thunder/ThunderCalendarModal';
import 'react-day-picker/dist/style.css';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { useForm, SubmitHandler } from 'react-hook-form';

interface FormData {
  title: string;
  content: string;
}

const ThunderPost = () => {
  const { register, handleSubmit, watch } = useForm<FormData>(); // useForm 훅을 사용하여 폼 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열림/닫힘 상태
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false); // 중앙 모달의 열림/닫힘 상태
  const [isThunderClockModalOpen, setIsThunderClockModalOpen] = useState(false); // clock modal의 열림/닫힘 상태
  const [isThunderCalendarModalOpen, setIsThunderCalendarModalOpen] = useState(false); // 캘린더 모달의 열림/닫힘 상태
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // 폼 모달의 열림/닫힘 상태
  const [selectedLocation, setSelectedLocation] = useState('지역 선택하기'); // 선택된 위치
  const [selectedPayment, setSelectedPayment] = useState(''); // 선택된 결제 방법
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(''); // 선택된 연령대
  const [selectedGenderGroup, setSelectedGenderGroup] = useState(''); // 선택된 성별 그룹
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 선택된 날짜
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // 선택된 시간
  const [selectedImages, setSelectedImages] = useState<File[]>([]); // 선택된 이미지
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // 이미지 미리보기
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태
  const [uploadProgress, setUploadProgress] = useState(0); // 업로드 진행률
  const [currentUploadingIndex, setCurrentUploadingIndex] = useState(0); // 현재 업로드 중인 이미지 인덱스
  const [maxPeople, setMaxPeople] = useState(1); // 최대 인원
  const [representativeImage, setRepresentativeImage] = useState<number | null>(null); // 대표 이미지
  const [modalMessage, setModalMessage] = useState({ title1: '', title2: '' }); // 모달 메시지

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const toggleCenterModal = () => {
    setIsCenterModalOpen((prev) => !prev);
  };

  const toggleThunderClockModal = () => {
    setIsThunderClockModalOpen((prev) => !prev);
  };

  const toggleThunderCalendarModal = () => {
    setIsThunderCalendarModalOpen((prev) => !prev);
  };

  const toggleFormModal = () => {
    setIsFormModalOpen((prev) => !prev);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsModalOpen(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsThunderClockModalOpen(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsThunderCalendarModalOpen(false);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (selectedImages.length + files.length > 10) {
        toggleCenterModal();
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      const compressedFiles = await Promise.all(
        files.map(async (file, index) => {
          setCurrentUploadingIndex(index + 1);
          const compressedFile = await compressImageToWebp(file);
          setUploadProgress(((index + 1) / files.length) * 100);
          return compressedFile;
        }),
      );

      setSelectedImages((prevImages) => [...prevImages, ...compressedFiles]);

      const newPreviews = compressedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      setIsUploading(false);
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

  // 모임 장소 목록 정의
  const locations = ['강동, 하남', '강남, 송파', '강북, 노원', '강서, 양천', '관악, 동작', '광진, 성동'];

  const increasePeople = () => {
    setMaxPeople((prev) => prev + 1);
  };

  const decreasePeople = () => {
    setMaxPeople((prev) => (prev > 1 ? prev - 1 : 1));
  };

  //  폼 데이터 제출 시 미입력 필드에 따른 Modal 알림
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const missingFieldsList: string[] = [];
    if (!selectedPayment) {
      missingFieldsList.push('지불 방식');
    }
    if (!selectedDate) {
      missingFieldsList.push('날짜');
    }
    if (!selectedTime) {
      missingFieldsList.push('시간');
    }
    if (!data.title) {
      missingFieldsList.push('제목');
    }
    if (!data.content) {
      missingFieldsList.push('내용');
    }

    if (missingFieldsList.length > 0) {
      setModalMessage({ title1: '필수항목을 선택해주세요.', title2: missingFieldsList.join(', ') });
      toggleCenterModal();
      return;
    }

    console.log(data);
    toggleFormModal();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative mx-auto max-w-full rounded-lg bg-white p-4">
          <div className="mb-2 flex items-center font-semibold">지불 방식을 선택해주세요.</div>

          <div className="mb-2 flex items-center">
            <button
              type="button"
              className={`mr-2 h-[35px] rounded-lg px-2 ${selectedPayment === '제가 쏩니다' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedPayment('제가 쏩니다')}>
              제가 쏩니다
            </button>
            <button
              type="button"
              className={`mr-2 h-[35px] rounded-lg px-2 ${selectedPayment === '더치페이' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedPayment('더치페이')}>
              더치페이
            </button>
          </div>
          <div className="mb-2 mt-5 flex items-center font-semibold">연령대를 선택해주세요</div>
          <div className="mb-2 flex items-center">
            <button
              type="button"
              className={`mr-2 h-[35px] w-[80px] rounded-lg px-2 ${selectedAgeGroup === '20대' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedAgeGroup('20대')}>
              20대
            </button>
            <button
              type="button"
              className={`mr-2 h-[35px] w-[80px] rounded-lg px-2 ${selectedAgeGroup === '30대' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedAgeGroup('30대')}>
              30대
            </button>
            <button
              type="button"
              className={`mr-2 h-[35px] w-[80px] rounded-lg px-2 ${selectedAgeGroup === '40대' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedAgeGroup('40대')}>
              40대
            </button>
            <button
              type="button"
              className={`mr-2 h-[35px] w-[80px] rounded-lg px-2 ${selectedAgeGroup === '상관없음' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedAgeGroup('상관없음')}>
              상관없음
            </button>
          </div>

          <div className="mb-2 mt-5 flex items-center font-semibold">성별을 선택해주세요</div>
          <div className="mb-2 flex items-center">
            <button
              type="button"
              className={`mr-2 h-[35px] w-[80px] rounded-lg px-2 ${selectedGenderGroup === '이성' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedGenderGroup('이성')}>
              이성
            </button>

            <button
              type="button"
              className={`mr-2 h-[35px] w-[80px] rounded-lg px-2 ${selectedGenderGroup === '동성' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedGenderGroup('동성')}>
              동성
            </button>

            <button
              type="button"
              className={`mr-2 h-[35px] w-[80px] rounded-lg px-2 ${selectedGenderGroup === '상관없음' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedGenderGroup('상관없음')}>
              상관없음
            </button>
          </div>

          <div className="mb-2 mt-5 flex items-center font-semibold">약속시간을 설정해주세요</div>
          <div className="mb-2 flex items-center">
            <button
              type="button"
              onClick={toggleThunderCalendarModal}
              className="mt-1 block h-[40px] w-[170px] rounded-l-lg border border-gray-300 px-3">
              {selectedDate ? selectedDate.toLocaleDateString() : '여기를 눌러 날짜선택'}
            </button>

            {isThunderCalendarModalOpen && (
              <ThunderCalendarModal
                isOpen={isThunderCalendarModalOpen}
                onClose={toggleThunderCalendarModal}
                onDateSelect={handleDateSelect}
              />
            )}

            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleThunderClockModal}
                className="mt-1 block h-[40px] w-[170px] rounded-r-lg border border-gray-300 px-3">
                {selectedTime ? selectedTime : '여기를 눌러 시간선택'}
              </button>

              {isThunderClockModalOpen && (
                <ThunderClockModal
                  isOpen={isThunderClockModalOpen}
                  onClose={toggleThunderClockModal}
                  onTimeSelect={handleTimeSelect}
                />
              )}
            </div>
          </div>

          <div className="mb-2 mt-5 flex items-center font-semibold">지역을 선택해주세요</div>
          <div className="mb-4 flex items-center">
            <button
              type="button"
              className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left"
              onClick={toggleModal}>
              {selectedLocation}
              <MdKeyboardArrowRight className="h-[30px] w-[50px] text-gray-500" />
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
                  <div className="relative mb-2 mr-2" key={index}>
                    <img
                      src={preview}
                      alt={`미리보기 ${index + 1}`}
                      className="h-16 w-16 rounded-xl border-2 border-[#ECECEC]"
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
                  </div>
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

          <div className="mb-2 mt-10 flex items-center font-semibold">최대 인원을 선택해주세요</div>
          <div className="mb-2 flex items-center">
            <span className="mr-2 flex h-[40px] w-[200px] items-center justify-center rounded-lg bg-[#F2F2F2] text-center text-xl">
              {maxPeople}
            </span>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              onClick={decreasePeople}
              className="mr-2 flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-[#F2F2F2] text-2xl">
              -
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              onClick={increasePeople}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-[#F2F2F2] text-2xl">
              +
            </motion.button>
          </div>
          <div className="mb-20" />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className={`mt-4 flex w-full justify-center rounded-xl px-4 py-4 font-bold text-white ${isUploading ? 'animate-gradient bg-gradient-to-r from-orange-500 to-orange-700' : 'bg-orange-500'}`}
            disabled={isUploading}>
            {isUploading ? '현재 이미지 처리중입니다' : '등록하기'}
          </motion.button>

          {/* 지역을 선택해주세요 modal open */}
          <ModalBottom isOpen={isModalOpen} onClose={toggleModal}>
            <div className="mx-auto h-[6px] w-[66px] rounded-[8px] bg-[#d9d9d9]" />
            <div className="p-4 text-left font-bold">지역</div>
            <div className="flex flex-col justify-start text-left">
              {locations.map((location) => (
                <button
                  key={location}
                  className={`ml-4 mt-4 flex items-center justify-between text-left ${selectedLocation === location ? 'text-orange-500' : 'text-gray-800'}`}
                  onClick={() => {
                    handleLocationSelect(location);
                    toggleModal();
                  }}>
                  {location}
                  {selectedLocation === location && <IoMdCheckmark className="ml-2 text-2xl text-orange-500" />}
                </button>
              ))}
            </div>
          </ModalBottom>

          {/* 이미지가 최대 10장이상을 넘어 업로드될 경우에 나오는 modal */}
          <ModalCenter
            isOpen={isCenterModalOpen}
            onClose={toggleCenterModal}
            title1="이미지는 최대 10장까지"
            title2="등록할 수 있습니다.">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              onClick={toggleCenterModal}
              className="mt-4 h-[50px] w-full rounded-xl bg-orange-500 px-4 py-2 font-bold text-white">
              확인
            </motion.button>
          </ModalCenter>
        </div>
      </form>
      {/* 폼 제출 테스트에 따른 modal open*/}
      <ModalCenter
        isOpen={isCenterModalOpen}
        onClose={toggleCenterModal}
        title1={modalMessage.title1}
        title2={modalMessage.title2}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          onClick={toggleCenterModal}
          className="mt-4 h-[50px] w-full rounded-xl bg-orange-500 px-4 py-2 font-bold text-white">
          확인
        </motion.button>
      </ModalCenter>

      <ModalCenter isOpen={isFormModalOpen} onClose={toggleFormModal} title1="폼 제출 테스트" title2="">
        <>
          <p className="text-center">지불 방식: {selectedPayment}</p>
          <p className="text-center">연령대: {selectedAgeGroup}</p>
          <p className="text-center">성별: {selectedGenderGroup}</p>
          <p className="text-center">
            약속시간: {selectedDate ? selectedDate.toLocaleDateString() : ''} {selectedTime}
          </p>
          <p className="text-center">지역: {selectedLocation}</p>
          <p className="text-center">제목: {watch('title')}</p>
          <p className="text-center">내용: {watch('content')}</p>
          <p className="text-center">이미지 등록-첫번째 사진이 대표사진이 됩니다.</p>
          <div className="flex flex-wrap justify-center">
            {imagePreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`preview-${index}`}
                className="m-1 h-20 w-20 rounded-xl object-cover"
              />
            ))}
          </div>
          <p className="text-center">최대인원: {maxPeople}</p>
        </>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          onClick={toggleFormModal}
          className="mt-4 h-[50px] w-full rounded-xl bg-orange-500 px-4 py-2 font-bold text-white">
          확인
        </motion.button>
      </ModalCenter>
    </>
  );
};

export default ThunderPost;
