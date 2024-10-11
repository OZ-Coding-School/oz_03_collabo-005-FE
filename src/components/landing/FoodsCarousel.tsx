import 'swiper/css';
import 'swiper/css/pagination';
import ImageWithPlaceholder from './ImageWithPlaceHolder';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FoodsCarouselList } from '../../data/FoodsCarouselList';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FoodsList } from '../../types/types';
import { useFoodsListStore } from '../../store/store';
import { authInstance } from '../../api/util/instance';

// FoodsCarousel 컴포넌트의 props 타입 정의
interface FoodsCarouselProps {
  spicy: number | null;
}

// FoodsCarousel 컴포넌트 정의
const FoodsCarousel: React.FC<FoodsCarouselProps> = ({ spicy }) => {
  // 사용자 음식 목록 상태 관리
  const [userFoods, setUserFoods] = useState<FoodsList[]>(FoodsCarouselList);
  // 전역 상태에서 음식 목록 설정
  const { setFoodsList } = useFoodsListStore();

  // spicy 값이 변경될 때마다 실행되는 효과
  useEffect(() => {
    if (spicy) {
      // 서버에 음식 추천 요청
      authInstance
        .post('/api/foods/recommends/', {
          filters: {
            is_lunch: false,
            is_dinner: false,
            is_snack: false,
            is_date: false,
            is_party: false,
            is_diet: false,
          },
          recommends_cnt: window.innerWidth >= 768 ? 10 : 5, // 화면 크기(768 해상도를 기준으로 10개씩 음식 리스트) 모바일 화면에서는 기존에 5개씩 추천 개수 조정
        })
        .then((res) => {
          // 응답 데이터로 상태 업데이트
          setUserFoods(res.data.recommendations);
          setFoodsList(res.data.recommendations);
        })
        .catch((err) => {
          console.error('음식 데이터 가져오기 오류:', err);
        });
    }
  }, [spicy]);

  // spicy 값에 따라 사용할 음식 목록 결정
  const listToUse = spicy ? userFoods : FoodsCarouselList;
  // 기본 이미지 URL 설정
  const defaultImageUrl = '/images/CuteEgg.svg';
  // 단일 아이템인지 확인
  const isSingleItem = listToUse.length === 1;

  return (
    <div className="h-full w-full py-4">
      <Swiper
        slidesPerView={'auto'}
        pagination={{
          clickable: true,
        }}
        className={isSingleItem ? 'flex-start flex justify-center' : ''}>
        {listToUse?.map((item) => (
          <SwiperSlide
            key={item.food_name}
            className={`flex h-[70%] w-[70%] flex-col items-center justify-center pl-4 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 md:h-[350px] md:w-[300px] ${isSingleItem ? 'mx-auto' : ''}`}>
            <Link to={`/foods/${item.food_id}`} state={{ name: item.food_name }} className="relative w-full">
              <ImageWithPlaceholder src={`/${item.image_url}` || defaultImageUrl} alt={item.food_name} />
            </Link>
            <p className="mt-2 font-medium">{item.food_name}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FoodsCarousel;
