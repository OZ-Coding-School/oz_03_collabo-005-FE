import { getCookie } from './cookie';

// 로그인 상태를 확인하고 적절한 동작을 수행하는 함수
export const checkLoginAndExecute = (action: () => void, setIsLoginModalOpen: (isOpen: boolean) => void) => {
  const token = getCookie('refresh');
  if (!token) {
    setIsLoginModalOpen(true);
  } else {
    action();
  }
};

// 엔터 키 입력 시 댓글 제출 함수를 실행하는 이벤트 handler
export const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, handleCommentSubmit: () => void) => {
  if (e.key === 'Enter') {
    handleCommentSubmit();
  }
};

// 번개 이미지 모달을 열고 선택된 이미지를 설정
export const openThunderImageModal = (
  selectedBoardItem: any,
  setSelectedImages: (images: string[]) => void,
  setIsThunderImageModalOpen: (isOpen: boolean) => void
) => {
  setSelectedImages([selectedBoardItem.review_image_url]);
  setIsThunderImageModalOpen(true);
};

// 번개 이미지 Modal 닫기
export const closeThunderImageModal = (setIsThunderImageModalOpen: (isOpen: boolean) => void) => {
  setIsThunderImageModalOpen(false);
};

// 모달의 상태를 토글
export const toggleModal = (setModalState: React.Dispatch<React.SetStateAction<boolean>>) => {
  setModalState(prev => !prev);
};