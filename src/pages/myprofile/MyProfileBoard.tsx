import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import PostNav from '../../components/myprofile/PostNav';
import { authInstance } from '../../api/util/instance.ts';
import Loading from '../../components/common/Loading.tsx';
import { getCookie } from '../../utils/cookie.ts';
import { useNavigate } from 'react-router-dom';
import BoardList from '../../components/myprofile/BoardList.tsx';

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
  const [swiperIndex, setSwiperIndex] = useState<number>(0);
  const [boardData, setBoardData] = useState<{ hosted: BoardItem[]; commented: BoardItem[]; liked: BoardItem[] }>({
    hosted: [],
    commented: [],
    liked: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (!getCookie('refresh')) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      authInstance.get('/api/profile/hosted/reviews'),
      authInstance.get('/api/profile/commented/reviews'),
      authInstance.get('/api/profile/liked/reviews'),
    ]).then(([hostedRes, commentedRes, likedRes]) => {
      setBoardData({
        hosted: hostedRes.data,
        commented: commentedRes.data,
        liked: likedRes.data,
      });
      setIsLoading(false);
    });
  }, []);

  const handleSlideChange = (swiper: any) => {
    setSwiperIndex(swiper.activeIndex);
  };

  const handleNavClick = (index: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
    setSwiperIndex(index);
  };

  return (
    <>
      <PostNav list={['작성한 글', '댓글', '좋아요']} setSelectedItem={handleNavClick} selectedIndex={swiperIndex} />
      {isLoading ? (
        <Loading />
      ) : (
        <Swiper
          className="h-[calc(100vh-136px)] xs:h-[calc(100vh-106px)]"
          onSlideChange={handleSlideChange}
          slidesPerView={1}
          spaceBetween={50}
          ref={swiperRef}>
          <SwiperSlide>
            <BoardList boardItems={boardData.hosted} type="작성한 글" />
          </SwiperSlide>
          <SwiperSlide>
            <BoardList boardItems={boardData.commented} type="댓글" />
          </SwiperSlide>
          <SwiperSlide>
            <BoardList boardItems={boardData.liked} type="좋아요" />
          </SwiperSlide>
        </Swiper>
      )}
    </>
  );
};

export default MyProfileBoard;
