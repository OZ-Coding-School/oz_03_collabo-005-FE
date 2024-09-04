import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import { useState, useEffect } from 'react';
import { baseInstance } from '../../api/util/instance'; // baseInstance 가져오기
import { getCookie } from '../../utils/cookie'; // getCookie 가져오기
import BoardCard from '../../components/board/BoardCard'; // BoardCard 컴포넌트 추가
import Loading from '../../components/common/Loading'; // Loading 컴포넌트 추가
import ModalBottom from '../../components/common/ModalBottom';

const Board = () => {
  const [selectedBoard, setSelectedBoard] = useState<string>('전체'); // 초기값을 '전체'로 설정
  const [boardList, setBoardList] = useState<
    {
      uuid: string;
      category_name: string;
      title: string;
      content: string;
      hits: number;
      review_image_url: string;
      created_at: string;
      comment_count: number;
      image_url: string;
    }[]
  >([]); // 게시판 목록 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 추가
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false); // 로그인 모달 상태 추가
  const [categories, setCategories] = useState<{ category: string }[]>([]); // 카테고리 목록 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    setSelectedBoard('전체'); // 컴포넌트가 처음 렌더링될 때 '전체'로 설정
    fetchBoardList(); // 게시판 목록 가져오기
    fetchCategories(); // 카테고리 목록 가져오기
  }, []);

  const fetchBoardList = async () => {
    try {
      const response = await baseInstance.get('/api/reviews/');
      setBoardList(response.data.reviews);
      setIsLoading(false);
    } catch (error) {
      console.error('게시판 목록을 가져오는 중 오류가 발생했습니다:', error);
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await baseInstance.get('/api/categories/reviewfilter/');
      setCategories(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('카테고리 목록을 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  const checkLogin = () => {
    const token = getCookie('refresh');
    if (!token) {
      setIsLoginModalOpen(true); // 로그인 모달 열기
    } else {
      navigate('/board/boardpost'); // 로그인 되어 있으면 게시물 작성 페이지로 이동
    }
  };

  const filteredBoardList =
    selectedBoard === '전체'
      ? boardList
      : boardList.filter((item) => {
          if (!item) return false;
          return item.category_name === selectedBoard;
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
            {categories.map((category, index) => (
              <button
                key={index}
                type="button"
                className={`mr-2 h-[35px] w-[85px] rounded-xl border-2 px-2 transition-transform duration-200 ease-in-out ${selectedBoard === category.category ? 'bg-[#F5E3DB]' : 'bg-[#F2F2F2]'} hover:scale-105 hover:bg-orange-200 active:scale-90`}
                onClick={() => setSelectedBoard(category.category)}>
                {category.category}
              </button>
            ))}
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
            // console.log('Board Item:', item);
            return (
              <BoardCard
                key={item.uuid}
                id={item.uuid}
                category={item.category_name}
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
      <div
        onClick={checkLogin} // 링크 대신 onClick으로 로그인 체크
        className="fixed bottom-[120px] right-[calc(50%-260px)] z-10 cursor-pointer xs:bottom-[100px] xs:right-[calc(5%)]">
        <div className='h-[63px] w-[63px] bg-[url("/images/plusCircle.svg")] bg-cover bg-center bg-no-repeat transition-transform duration-200 ease-in-out hover:scale-110 active:scale-90 xs:h-[53px] xs:w-[53px]' />
      </div>
      {/* 로그인 모달 추가 */}
      <ModalBottom isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <div className="p-4 text-center">
          <p className="text-lg font-semibold">로그인이 필요한 서비스 입니다.</p>
          <p className="mt-2 text-sm text-gray-600">게시글을 만들려면 먼저 로그인해주세요.</p>
          <button
            className="mt-4 w-full rounded-lg bg-primary px-10 py-2 font-bold text-white"
            onClick={() => {
              setIsLoginModalOpen(false);
              navigate('/signIn');
            }}>
            로그인하기
          </button>
        </div>
      </ModalBottom>
    </div>
  );
};

export default Board;
