import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ko } from 'date-fns/locale';

// ThunderCalendarModal 컴포넌트: 날짜 선택을 위한 Modal 창
const ThunderCalendarModal: React.FC<{
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 함수
  onDateSelect: (date: Date) => void; // 날짜 선택 시 호출되는 함수
}> = ({ isOpen, onClose, onDateSelect }) => {
  // 선택된 날짜 상태 관리
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // 확인 버튼 클릭 시 실행되는 함수
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
          {/* 모달 컨텐츠: 하단에서 올라오는 애니메이션 효과 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            // ThunderCalendarModal 스타일 정의
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex w-full max-w-[600px] flex-col items-center justify-center rounded-t-xl border-2 bg-white p-4 shadow-md xs:bottom-[62px]">
            {/* DayPicker - 날짜 선택 캘린더 컴포넌트 */}
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ko}
              className="flex"
              classNames={{
                today: `border-amber-500 bg-blue-500 rounded-full text-white`, // 오늘 날짜 스타일 정의
                selected: `bg-black rounded-full text-white`, // 선택된 날짜 스타일 정의
                chevron: `fill-black`, // 화살표 아이콘 색상 정의
                weekday: 'text-black font-bold', // 요일 텍스트 스타일 정의
                button_previous: 'text-gray-100', // 이전 버튼 스타일 정의
              }}
              formatters={{
                formatCaption: (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`, // 년월 표시 형식
                formatDay: (date) => {
                  const today = new Date();
                  if (date.toDateString() === today.toDateString()) {
                    return `오늘`;
                  }
                  return date.getDate().toString();
                },
              }}
              modifiers={{
                past: { before: new Date() }, // 과거 날짜 스타일 지정
              }}
              modifiersClassNames={{
                past: 'text-gray-500', // 과거 날짜 텍스트 색상
              }}
              disabled={{ before: new Date() }} // 과거 날짜 선택 비활성화
            />
            {/* 확인 버튼 */}
            <button
              onClick={(event) => {
                event.preventDefault();
                handleConfirm();
                onClose();
              }}
              className="mt-4 h-[50px] w-full rounded-2xl bg-orange-500 px-4 py-2 text-xl font-bold text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-orange-600 active:scale-95">
              확인
            </button>
            {/* 오늘 날짜 선택 버튼 */}
            <button
              onClick={(event) => {
                event.preventDefault();
                const today = new Date();
                setSelectedDate(today);
                onDateSelect(today); // 오늘 날짜 자동 선택
                onClose(); // Modal 자동 닫기
              }}
              className="mt-4 h-[50px] w-full rounded-2xl bg-blue-500 px-4 py-2 text-xl font-bold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600 active:scale-95">
              오늘 날짜로 선택
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThunderCalendarModal;
