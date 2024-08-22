import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

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

  const koreanWeekdays = ['일', '월', '화', '수', '목', '금', '토'];

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
              locale={{
                localize: {
                  day: (n) => koreanWeekdays[n],
                  month: (n) => n + 1 + '월',
                },
                formatLong: {
                  date: () => 'yyyy년 MM월 dd일',
                },
              }}
            />

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

export default ThunderCalendarModal;
