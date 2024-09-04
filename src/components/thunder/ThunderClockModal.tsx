import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// ThunderClockModal 컴포넌트 정의
const ThunderClockModal: React.FC<{ isOpen: boolean; onClose: () => void; onTimeSelect: (time: string) => void }> = ({
  isOpen,
  onClose,
  onTimeSelect,
}) => {
  // 선택된 시간을 저장하는 상태, 초기값 0시
  const [selectedHour, setSelectedHour] = useState(0);
  // 선택된 분을 저장하는 상태, 초기값 0분
  const [selectedMinute, setSelectedMinute] = useState(0);
  // 시간을 편집 중인지 여부를 저장하는 상태, 초기값 false
  const [isEditingHour, setIsEditingHour] = useState(false);
  // 분을 편집 중인지 여부를 저장하는 상태, 초기값 false
  const [isEditingMinute, setIsEditingMinute] = useState(false);

  // 시간과 분을 선택하고 모달을 닫는 함수
  const handleConfirm = () => {
    const time = `${selectedHour < 10 ? `0${selectedHour}` : selectedHour}:${selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}`;
    onTimeSelect(time);
    onClose();
  };

  // 시간 입력값이 변경될 때 호출되는 함수
  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value >= 0 && value < 24) {
      setSelectedHour(value);
    }
  };

  // 분 입력값이 변경될 때 호출되는 함수
  const handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value >= 0 && value < 60) {
      setSelectedMinute(value);
    }
  };

  // 시간 입력 필드를 클릭할 때 호출되는 함수
  const handleHourClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  // 분 입력 필드를 클릭할 때 호출되는 함수
  const handleMinuteClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} // 모달이 처음 열릴 때의 투명도
          animate={{ opacity: 1 }} // 모달이 열릴 때의 투명도
          exit={{ opacity: 0 }} // 모달이 닫힐 때의 투명도
          className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
          {' '}
          {/* // modal의 스타일 설정 */}
          <motion.div
            initial={{ y: '100%' }} // 모달이 처음 열릴 때의 위치
            animate={{ y: 0 }} // 모달이 열릴 때의 위치
            exit={{ y: '100%' }} // 모달이 닫힐 때의 위치
            transition={{ type: 'spring', stiffness: 300, damping: 30 }} // 모달의 애니메이션
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex w-full max-w-[600px] flex-col items-center justify-center rounded-t-xl border-2 bg-white p-4 shadow-md">
            {' '}
            {/* // modal의 스타일 설정 */}
            <div className="flex items-center text-2xl">
              <div className="mx-2 flex h-[150px] w-[50px] flex-col items-center">
                {isEditingHour ? (
                  <input
                    type="number"
                    value={selectedHour}
                    onChange={handleHourChange}
                    onBlur={() => setIsEditingHour(false)}
                    onClick={handleHourClick}
                    className="text-center text-4xl font-bold text-orange-500"
                    style={{ width: '150%', height: '100%' }}
                  />
                ) : (
                  <Swiper
                    direction="vertical" // 슬라이더의 방향
                    slidesPerView={3} // 한 번에 보여질 슬라이드 수 (바깥쪽에 보이게 사용자 경험 개선)
                    centeredSlides={true} // 슬라이드가 중앙에 위치
                    onSlideChange={(swiper) => setSelectedHour(swiper.activeIndex)} // 슬라이드가 변경될 때 호출
                    onClick={() => setIsEditingHour(true)}>
                    {' '}
                    {/* // 슬라이드를 클릭할 때 호출 - 시간이 24시간제이므로 24까지 표시되도록 00~23*/}
                    {[...Array(24)].map((_, i) => (
                      <SwiperSlide key={i}>
                        <span
                          className={`text-4xl font-bold ${i === selectedHour ? 'text-orange-500' : 'bg-gradient-to-t from-gray-100 to-gray-500 bg-clip-text text-left text-transparent'}`}>
                          {i < 10 ? `0${i}` : i}
                        </span>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
              <span className="text-orange-500">:</span>
              <div className="relative flex h-[150px] w-16 flex-col items-center">
                {/* 슬라이더를 원하지 않는 사용자가 있을 수 있으므로, 직접 시, 분을 클릭하여 사용자가 입력할 수 있도록 input을 제공 */}
                {isEditingMinute ? (
                  <input
                    type="number"
                    value={selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}
                    onChange={handleMinuteChange}
                    onBlur={() => setIsEditingMinute(false)}
                    onClick={handleMinuteClick}
                    className="text-center text-4xl font-bold text-orange-500"
                    style={{ width: '150%', height: '100%' }}
                  />
                ) : (
                  // 사용자가 임의로 슬라이더가 가능하게 한다. 슬라이드가 중앙에 위치 1~5값내에서 중앙에 위치하면 그 값을 받을 수 있게 처리
                  // 바깥으로는 값으로 인식 안하게 처리
                  <Swiper
                    direction="vertical" // 슬라이더의 방향 설정
                    slidesPerView={3} // 한 번에 보여질 슬라이드 수 설정(바깥쪽에 보이게 사용자 경험 개선)
                    centeredSlides={true} // 슬라이드가 중앙에 위치하도록 설정
                    onSlideChange={(swiper) => setSelectedMinute(swiper.activeIndex * 5)} // 슬라이드가 변경될 때 호출되는 함수
                    onClick={() => setIsEditingMinute(true)} // 슬라이드를 클릭할 때 호출되는 함수
                    // 슬라이더의 속도 설정 - speed 값 500
                    speed={500}>
                    {/* 배열 12 로 구성 - 00~55*/}
                    {[...Array(12)].map((_, i) => (
                      <SwiperSlide key={i}>
                        {/* 활성화 된 시, 분은 주황색으로 처리, 활성화 안된 시, 분은 회색 그라데이션으로 처리 */}
                        <span
                          className={`text-4xl font-bold ${i * 5 === selectedMinute ? 'text-orange-500' : 'bg-gradient-to-t from-gray-100 to-gray-500 bg-clip-text text-transparent'}`}>
                          {i * 5 < 10 ? `0${i * 5}` : i * 5}
                        </span>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            </div>
            <button
              onClick={(event) => {
                event.preventDefault();
                handleConfirm();
                onClose();
              }}
              className="mt-4 h-[50px] w-full rounded-2xl bg-orange-500 px-4 py-2 text-xl font-bold text-white transition-colors hover:bg-orange-600">
              확인
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThunderClockModal;
