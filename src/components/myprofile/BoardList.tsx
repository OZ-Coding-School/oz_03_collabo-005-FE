import { Link } from 'react-router-dom';
import BoardCard from '../../components/board/BoardCard.tsx';

interface BoardItem {
  uuid: string;
  category_name: string;
  title: string;
  content: string;
  hits: number;
  review_image_url: string;
  created_at: string;
  comment_count: number;
}

interface BoardListProps {
  boardItems: BoardItem[];
  type: string;
}

const BoardList = ({ boardItems, type }: BoardListProps) => {
  return boardItems.length === 0 ? (
    <div className="flex h-full w-full flex-col items-center justify-center py-8">
      <p className="mt-10 text-[24px] text-[#666666] xs:text-[20px]">{`선택된 글 목록(${type})이 없어요`}</p>
      <img src="/images/CryingEgg.svg" className="inline-block h-[40vh]" alt="Crying Egg" />
      {type === '작성한 글' && (
        <Link
          to={'/board/boardpost'}
          className="flex h-[42px] w-[90%] items-center justify-center rounded-[8px] bg-primary font-bold text-white">
          게시글 만들기
        </Link>
      )}
    </div>
  ) : (
    boardItems.map((item) => (
      <BoardCard
        key={item.uuid}
        id={item.uuid}
        category={item.category_name}
        title={item.title}
        content={item.content}
        hits={item.hits}
        review_image_url={item.review_image_url}
        createdAt={item.created_at}
        commentLength={item.comment_count}
      />
    ))
  );
};

export default BoardList;
