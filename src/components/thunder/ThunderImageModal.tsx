import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { motion, AnimatePresence } from 'framer-motion';

interface ThunderImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

// ThunderImageModal 를 위한 컴포넌트.

const ThunderImageModal: React.FC<ThunderImageModalProps> = ({ isOpen, onClose, images }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setTotalPages(images.length);
  }, [images]);

  useEffect(() => {
    // 키보드 이벤트 핸들러 함수 정의
    const handleKeyDown = (event: KeyboardEvent) => {
      // Esc 키를 누르면 모달 닫기
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        // Modal Open 시 나타나는 애니메이션
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-100 xs:bg-opacity-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}>
          <motion.div
            className="relative h-[1000px] w-[600px] overflow-hidden rounded-xl bg-black shadow-lg xs:h-[600px] xs:w-[380px]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.1 }}>
            {/* modal 닫기 버튼 */}
            <motion.button
              className="absolute bottom-[500px] right-0 top-0 z-50 text-white hover:text-orange-500 xs:top-0"
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}>
              <IoClose size={32} />
            </motion.button>

            <Swiper
              spaceBetween={50}
              slidesPerView={1}
              onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
              className="h-full w-full">
              {images.map((image, index) => (
                <SwiperSlide key={index} className="flex items-center justify-center">
                  <img src={image} alt={`이미지 ${index + 1}`} className="w-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* pagination css 스타일 */}
            <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 transform items-center space-x-4 xs:bottom-0">
              {Array.from({ length: totalPages }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${index === currentPage ? 'bg-white' : 'bg-gray-700'}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,

    document.getElementById('modal-root')!,
  );
};

export default ThunderImageModal;
