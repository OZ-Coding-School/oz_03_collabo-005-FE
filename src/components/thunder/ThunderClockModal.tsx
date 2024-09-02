import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const ThunderClockModal: React.FC<{ isOpen: boolean; onClose: () => void; onTimeSelect: (time: string) => void }> = ({
  isOpen,
  onClose,
  onTimeSelect,
}) => {
  const [selectedHour, setSelectedHour] = useState(0); // 선택된 시간을 저장하는 상태, 초기값 0시
  const [selectedMinute, setSelectedMinute] = useState(0); // 선택된 분을 저장 초기값 0분
  const [isEditingHour, setIsEditingHour] = useState(false); // 시간을 편집 중인지 여부 저장 초기값 false
  const [isEditingMinute, setIsEditingMinute] = useState(false); // 분을 편집 중인지 여부 저장 초기값 false

  const handleConfirm = () => {
    const time = `${selectedHour < 10 ? `0${selectedHour}` : selectedHour}:${selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}`;
    onTimeSelect(time);
    onClose();
  };

  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value >= 0 && value < 24) {
      setSelectedHour(value);
    }
  };

  const handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value >= 0 && value < 60) {
      setSelectedMinute(value);
    }
  };

  const handleHourClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  const handleMinuteClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex w-full max-w-[600px] flex-col items-center justify-center rounded-t-xl border-2 bg-white p-4 shadow-md">
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
                    direction="vertical"
                    slidesPerView={3}
                    centeredSlides={true}
                    onSlideChange={(swiper) => setSelectedHour(swiper.activeIndex)}
                    onClick={() => setIsEditingHour(true)}>
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
                  <Swiper
                    direction="vertical"
                    slidesPerView={3}
                    centeredSlides={true}
                    onSlideChange={(swiper) => setSelectedMinute(swiper.activeIndex * 5)}
                    onClick={() => setIsEditingMinute(true)}
                    speed={500}>
                    {[...Array(12)].map((_, i) => (
                      <SwiperSlide key={i}>
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
