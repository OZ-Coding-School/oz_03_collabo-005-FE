import { useEffect, useState } from 'react';
import PostNav from '../../components/myprofile/PostNav';
import { BoardList } from '../../data/BoardList.tsx';
import BoardCard from '../../components/board/BoardCard.tsx';
import { Link } from 'react-router-dom';

const MyProfileBoard = () => {
  // 유저 확인해서 로그인 안되어있으면 redirect 아래는 토큰을 확인해야 하는 경우
  //  useEffect(() => {
  //    const token = localStorage.getItem('token');
  //    if (!token) {
  //      navigate('/login');
  //    } else {
  //      axios
  //        .get('/api/validateToken', { headers: { Authorization: `Bearer ${token}` } })
  //        .then((response) => {
  //          if (!response.data.valid) {
  //            navigate('/login');
  //          }
  //        })
  //        .catch((error) => {
  //          console.error('Token validation failed', error);
  //          navigate('/login');
  //        });
  //    }
  //  }, [navigate]);
  const [selectedItem, setSelectedItem] = useState<string>('작성한 글');
  useEffect(() => {
    // selectedItem으로 데이터 통신하면 됨. 그리고 그 결과로 아래에서 meetingList를 대체
    console.log(selectedItem);
  }, [selectedItem]);

  return (
    <>
      <PostNav list={['작성한 글', '댓글', '좋아요']} setSelectedItem={setSelectedItem} />
      <div className="p-4 pt-0">
        {BoardList.length === 0 ? (
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
          BoardList.map((item) => {
            return (
              <BoardCard
                key={item.id}
                id={item.id}
                category={item.category}
                title={item.title}
                content={item.description}
                hits={item.hits}
                image_url={item.image_url}
                createdAt={item.created_at}
                commentLength={item.comments.length}
              />
            );
          })
        )}
      </div>
    </>
  );
};

export default MyProfileBoard;
