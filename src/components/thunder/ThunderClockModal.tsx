import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const ThunderClockModal: React.FC<{ isOpen: boolean; onClose: () => void; onTimeSelect: (time: string) => void }> = ({
  isOpen,
  onClose,
  onTimeSelect,
}) => {
  const [selectedHour, setSelectedHour] = useState(1);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [period, setPeriod] = useState('오후');
  const [isEditingHour, setIsEditingHour] = useState(false);
  const [isEditingMinute, setIsEditingMinute] = useState(false);

  const handleConfirm = () => {
    const time = `${period} ${selectedHour}:${selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}`;
    onTimeSelect(time);
    onClose();
  };

  const togglePeriod = (event: React.MouseEvent) => {
    event.preventDefault();
    setPeriod((prevPeriod) => (prevPeriod === '오전' ? '오후' : '오전'));
  };

  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value >= 1 && value <= 12) {
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
              <div className="relative mx-2 flex h-32 w-32 flex-col items-center">
                <div className="flex flex-col">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePeriod}
                    className={`mt-[20px] h-[40px] w-[100px] rounded-lg px-2 text-[20px] ${period === '오전' ? 'bg-slate-500 text-white' : 'bg-gray-200 text-slate-500'}`}>
                    오전
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePeriod}
                    className={`mt-[10px] h-[40px] w-[100px] rounded-lg px-2 text-[20px] ${period === '오후' ? 'bg-slate-500 text-white' : 'bg-gray-200 text-slate-500'}`}>
                    오후
                  </motion.button>
                </div>

                <div className="flex h-16 items-center justify-center" />
              </div>
              <div className="relative mx-2 flex h-32 w-16 flex-col items-center">
                {isEditingHour ? (
                  <input
                    type="number"
                    value={selectedHour}
                    onChange={handleHourChange}
                    onBlur={() => setIsEditingHour(false)}
                    onClick={handleHourClick}
                    className="text-center text-4xl font-bold text-orange-500"
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <Swiper
                    direction="vertical"
                    slidesPerView={3}
                    centeredSlides={true}
                    onSlideChange={(swiper) => setSelectedHour(swiper.activeIndex + 1)}
                    onClick={() => setIsEditingHour(true)}>
                    {[...Array(12)].map((_, i) => (
                      <SwiperSlide key={i}>
                        <span
                          className={`text-4xl font-bold ${i + 1 === selectedHour ? 'text-orange-500' : 'text-gray-500'}`}>
                          {i + 1}
                        </span>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
              <span className="mx-1 text-orange-500">:</span>
              <div className="relative mx-2 flex h-32 w-16 flex-col items-center">
                {isEditingMinute ? (
                  <input
                    type="number"
                    value={selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}
                    onChange={handleMinuteChange}
                    onBlur={() => setIsEditingMinute(false)}
                    onClick={handleMinuteClick}
                    className="text-center text-4xl font-bold text-orange-500"
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <Swiper
                    direction="vertical"
                    slidesPerView={3}
                    centeredSlides={true}
                    onSlideChange={(swiper) => setSelectedMinute(swiper.activeIndex * 5)}
                    onClick={() => setIsEditingMinute(true)}>
                    {[...Array(12)].map((_, i) => (
                      <SwiperSlide key={i}>
                        <span
                          className={`text-4xl font-bold ${i * 5 === selectedMinute ? 'text-orange-500' : 'text-gray-500'}`}>
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
              className="mt-4 h-[50px] w-full rounded-md bg-orange-500 px-4 py-2 text-xl font-bold text-white transition-colors hover:bg-orange-600">
              확인
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThunderClockModal;
