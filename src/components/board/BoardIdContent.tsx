// ContentLoader를 사용하여 로딩 상태를 표시하기 위해 import
import ContentLoader from 'react-content-loader';
// BoardItem 타입을 사용하기 위해 import
import { BoardItem } from '../../types/types';

// BoardIdContent 컴포넌트의 props 타입 정의
interface BoardIdContentProps {
  selectedBoardItem: BoardItem; // 선택된 게시물 정보
  isImageLoaded: boolean; // 이미지 로딩 완료 여부
  setIsImageLoaded: (loaded: boolean) => void; // 이미지 로딩 상태 설정
  openThunderImageModal: () => void; // 이미지 modal 열기
}

// BoardIdContent 컴포넌트 정의
const BoardIdContent = ({
  selectedBoardItem,
  isImageLoaded,
  setIsImageLoaded,
  openThunderImageModal,
}: BoardIdContentProps) => (
  <div>
    {/* 게시물 내용 표시 */}
    <p className="mb-4 text-[#333333]">{selectedBoardItem.content}</p>
    {/* 이미지 URL이 있고 아직 로딩되지 않았을 때 로딩 */}
    {selectedBoardItem.review_image_url && !isImageLoaded && (
      <ContentLoader height={200} width={300} speed={2} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
        <rect x="0" y="56" rx="3" ry="3" width="300" height="10" />
        <rect x="0" y="72" rx="3" ry="3" width="200" height="10" />
        <rect x="0" y="88" rx="3" ry="3" width="100" height="10" />
      </ContentLoader>
    )}
    {/* 이미지 URL이 있을 때 이미지 */}
    {selectedBoardItem.review_image_url && (
      <img
        src={selectedBoardItem.review_image_url}
        alt="게시물 이미지"
        className={`mb-4 mt-8 h-full w-full cursor-pointer rounded-lg object-cover ${isImageLoaded ? 'block' : 'hidden'}`}
        onLoad={() => setIsImageLoaded(true)} // 이미지 로딩 완료 시 상태 업데이트
        onClick={openThunderImageModal} // 이미지 클릭 시 모달 열기
      />
    )}
  </div>
);

export default BoardIdContent;
