import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
import { authInstance } from '../../api/util/instance';
import Loading from '../../components/common/Loading';
import { getCookie } from '../../utils/cookie';
import PostNav from '../../components/myprofile/PostNav';
import ThunderList from '../../components/myprofile/ThunderList';

interface ThunderItem {
  uuid: string;
  title: string;
  payment_method_name: string;
  age_group_name: string;
  gender_group_name: string;
  meeting_time: string;
  meeting_image_url: string;
  description: string;
  locationName: string;
}

const MyProfileThunder = () => {
  const [swiperIndex, setSwiperIndex] = useState<number>(0);
  const [userData, setUserData] = useState<{ hosted: ThunderItem[]; joined: ThunderItem[]; liked: ThunderItem[] }>({
    hosted: [],
    joined: [],
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
      authInstance.get('/api/profile/hosted/meetings/'),
      authInstance.get('/api/profile/joined/meetings/'),
      authInstance.get('/api/profile/liked/meeting/'),
    ]).then(([hostedRes, joinedRes, likedRes]) => {
      setUserData({
        hosted: hostedRes.data,
        joined: joinedRes.data,
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
      <PostNav
        list={['작성한 글', '참여 내역', '좋아요']}
        setSelectedItem={handleNavClick}
        selectedIndex={swiperIndex}
      />
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
            <ThunderList thunderItems={userData.hosted} type="작성한 글" />
          </SwiperSlide>
          <SwiperSlide>
            <ThunderList thunderItems={userData.joined} type="참여 내역" />
          </SwiperSlide>
          <SwiperSlide>
            <ThunderList thunderItems={userData.liked} type="좋아요" />
          </SwiperSlide>
        </Swiper>
      )}
    </>
  );
};

export default MyProfileThunder;
