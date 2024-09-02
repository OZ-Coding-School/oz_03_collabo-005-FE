import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authInstance } from '../../api/util/instance'; // authInstance 가져오기
import BoardCard from '../../components/board/BoardCard'; // BoardCard 컴포넌트 추가
import { motion } from 'framer-motion'; // framer-motion 적용
import Loading from '../../components/common/Loading'; // Loading 컴포넌트 추가

const Board = () => {
  const [selectedBoard, setSelectedBoard] = useState<string>('전체'); // 초기값을 '전체'로 설정
  const [boardList, setBoardList] = useState<any[]>([]); // 게시판 목록 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 추가

  useEffect(() => {
    setSelectedBoard('전체'); // 컴포넌트가 처음 렌더링될 때 '전체'로 설정
    fetchBoardList(); // 게시판 목록 가져오기
  }, []);

  const fetchBoardList = async () => {
    try {
      const response = await authInstance.get('/api/reviews/');
      setBoardList(response.data.reviews);
      setIsLoading(false);
    } catch (error) {
      console.error('게시판 목록을 가져오는 중 오류가 발생했습니다:', error);
      setIsLoading(false);
    }
  };

  // 카테고리 선택
  const filteredBoardList =
    selectedBoard === '전체'
      ? boardList
      : boardList.filter((item) => {
          if (!item) return false;
          if (selectedBoard === '맛집 추천') {
            return item.category === 1; // 맛집 추천
          } else if (selectedBoard === '소셜 다이닝 후기') {
            return item.category === 2; // 소셜 다이닝 후기
          }
          return false;
        });

  // 로딩 상태일 때 Loading 컴포넌트 렌더링
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative mb-2 h-full w-full max-w-[600px] p-4 pt-0">
      <div className="fixed top-[72px] z-20 w-full max-w-[600px] bg-white pr-8 xs:top-[52px]">
        <h1 className="my-[12px] text-2xl font-bold xs:text-xl">맛있는 이야기의 시작</h1>
        <div className="my-2 flex w-full max-w-[600px] items-center justify-between" />
        <div className="flex gap-2">
          <div className="mb-2 flex items-center">
            <button
              type="button"
              className={`mr-2 h-[35px] w-[60px] rounded-2xl px-2 ${selectedBoard === '전체' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedBoard('전체')}>
              전체
            </button>
            <button
              type="button"
              className={`mr-2 h-[35px] w-[80px] rounded-xl px-2 ${selectedBoard === '맛집 추천' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedBoard('맛집 추천')}>
              맛집 추천
            </button>
            <button
              type="button"
              className={`mr-2 h-[35px] w-[150px] rounded-xl px-2 ${selectedBoard === '소셜 다이닝 후기' ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'}`}
              onClick={() => setSelectedBoard('소셜 다이닝 후기')}>
              소셜 다이닝 후기
            </button>
          </div>
        </div>
      </div>
      {filteredBoardList.length === 0 ? (
        <div className="mb-[72px] mt-[100px] flex w-full flex-col items-center justify-evenly bg-[#EEEEEE]">
          <p className="mt-10 text-[24px] text-[#666666] xs:text-[20px]">등록된 일정이 없어요</p>
          <img src="/images/CryingEgg.svg" className="inline-block h-[40vh]" alt="Crying Egg" />
          <p className="mb-4 flex items-center text-[20px] text-[#666666] xs:text-[16px]">
            <img src="/images/plusCircle.svg" className="mr-1 w-[2rem] xs:w-[1.5rem]" alt="Plus Circle" />
            버튼을 눌러 일정을 만들어보세요
          </p>
        </div>
      ) : (
        <div className="mt-[107px] flex flex-col items-center overflow-auto">
          {filteredBoardList.map((item) => {
            if (!item) return null;
            console.log('Board Item:', item);
            return (
              <BoardCard
                key={item.uuid}
                id={item.uuid}
                category={item.category === 1 ? '맛집 추천' : '소셜 다이닝 후기'}
                title={item.title}
                content={item.content}
                hits={item.hits}
                review_image_url={item.review_image_url}
                createdAt={item.created_at}
                commentLength={item.comment_count} // commentLength를 숫자로 변환
              />
            );
          })}
        </div>
      )}
      <Link
        to={'/board/boardpost'}
        className="fixed bottom-[120px] right-[calc(50%-260px)] z-10 xs:bottom-[100px] xs:right-[calc(5%)]">
        <motion.div
          className='h-[63px] w-[63px] bg-[url("/images/plusCircle.svg")] bg-cover bg-center bg-no-repeat xs:h-[53px] xs:w-[53px]'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      </Link>
    </div>
  );
};

export default Board;
