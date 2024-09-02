import { useEffect, useState } from 'react';
import PostNav from '../../components/myprofile/PostNav';
import BoardCard from '../../components/board/BoardCard.tsx';
import { Link } from 'react-router-dom';
import { authInstance } from '../../api/util/instance.ts';
import Loading from '../../components/common/Loading.tsx';

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

const MyProfileBoard = () => {
  const [selectedItem, setSelectedItem] = useState<string>('작성한 글');
  const [boardList, setBoardList] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (selectedItem === '작성한 글') {
      authInstance.get('/api/profile/hosted/reviews').then((res) => {
        setBoardList(res.data);
        setIsLoading(false);
      });
    } else if (selectedItem === '댓글') {
      authInstance.get('/api/profile/commented/reviews').then((res) => {
        setBoardList(res.data);
        setIsLoading(false);
      });
    } else {
      authInstance.get('/api/profile/liked/reviews').then((res) => {
        setBoardList(res.data);
        setIsLoading(false);
      });
    }
  }, [selectedItem]);

  return (
    <>
      <PostNav list={['작성한 글', '댓글', '좋아요']} setSelectedItem={setSelectedItem} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="p-4 pt-0">
          {boardList.length === 0 ? (
            <div className="flex w-full flex-col items-center justify-evenly bg-[#EEEEEE] py-8">
              <p className="mt-10 text-[24px] text-[#666666] xs:text-[20px]">
                {`선택된 글 목록(${selectedItem})이 없어요`}
              </p>
              <img src="/images/CryingEgg.svg" className="inline-block h-[40vh]" alt="Crying Egg" />
              {selectedItem === '작성한 글' ? (
                <Link
                  to={'/board/boardpost'}
                  className="flex h-[42px] w-[90%] items-center justify-center rounded-[8px] bg-primary font-bold text-white">
                  게시글 만들기
                </Link>
              ) : null}
            </div>
          ) : (
            boardList?.map((item) => (
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
          )}
        </div>
      )}
    </>
  );
};

export default MyProfileBoard;
