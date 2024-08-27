import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ko } from 'date-fns/locale';

const ThunderCalendarModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
}> = ({ isOpen, onClose, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleConfirm = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
      onClose();
    }
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
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ko}
              className="flex"
              classNames={{
                today: `border-amber-500 bg-orange-500 rounded-full text-white`, // 오늘 날짜에 테두리와 배경색 추가
                selected: `bg-black rounded-full text-white`, // 선택된 날짜 강조
                chevron: `fill-black`, // Chevron 색상 변경
                weekday: 'text-black font-bold',
                button_previous: 'text-gray-100',
              }}
              formatters={{
                formatCaption: (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
                formatDay: (date) => {
                  const today = new Date();
                  if (date.toDateString() === today.toDateString()) {
                    return `오늘`;
                  }
                  return date.getDate().toString();
                },
              }}
            />

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

export default ThunderCalendarModal;
