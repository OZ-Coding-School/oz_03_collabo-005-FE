import { Link } from 'react-router-dom';
import { formatCreatedAt } from '../../utils/formatCreatedAt';
import { BoardItem } from '../../types/types';

interface BoardIdHeaderProps {
  selectedBoardItem: BoardItem;
  profileImageUrl: string;
  reviewImageUrl: string | null;
}

const BoardIdHeader = ({ selectedBoardItem, profileImageUrl, reviewImageUrl }: BoardIdHeaderProps) => (
  <div>
    <div className="mb-4 rounded-xl bg-gradient-to-r from-sky-100 to-yellow-100 px-4 py-2 text-left text-gray-800 backdrop-blur-lg md:block">
      [개선사항 - 24.10.08~10.09.] 게시글 작성자 프로필이 보이지 않는 현상 수정, 게시글 수정, 삭제 기능이 지원됩니다.{' '}
      <br />
      다음 업데이트 안내: 좋아요 상태를 확인할 수 있도록 ux가 개선됩니다. 댓글 수정시 수정사항이 바로 업데이트 됩니다.
    </div>
    <div className="mb-2 flex items-center">
      <div className="mr-2 rounded-lg border-2 border-gray-200 bg-slate-100 px-2 py-1 text-gray-800">
        {selectedBoardItem.category_name}
      </div>
    </div>
    <div className="mb-4 text-xl font-bold">{selectedBoardItem.title}</div>
    <div className="mb-4 flex items-center">
      <Link to={`/profile/${selectedBoardItem.nickname}`}>
        <img
          src={profileImageUrl || selectedBoardItem.profile_image_url || '../images/anonymous_avatars.svg'}
          alt="프로필 사진"
          className="mr-2 h-10 w-10 rounded-full"
          onError={(e) => {
            e.currentTarget.src = '../images/anonymous_avatars.svg';
          }}
        />
      </Link>
      <div>
        <div className="flex items-center">
          <Link to={`/profile/${selectedBoardItem.nickname}`} className="text-sm font-medium">
            {selectedBoardItem.nickname}
          </Link>
          <div className="ml-2 text-xs font-medium text-gray-500">{formatCreatedAt(selectedBoardItem.created_at)}</div>
        </div>
      </div>
    </div>
    {reviewImageUrl && (
      <div className="mb-4">
        <img src={reviewImageUrl} alt="리뷰 이미지" className="max-w-full rounded-lg" />
      </div>
    )}
  </div>
);

export default BoardIdHeader;
