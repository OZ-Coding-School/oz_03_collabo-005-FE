import 'swiper/css';
import 'swiper/css/pagination';
import axios from 'axios';
import ImageWithPlaceholder from './ImageWithPlaceHolder';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FoodsCarouselList } from '../../data/FoodsCarouselList';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FoodsList, User } from '../../types/types';
import { useFoodsListStore } from '../../store/store';

interface FoodsCarouselProps {
  user?: User;
}

const FoodsCarousel: React.FC<FoodsCarouselProps> = ({ user }) => {
  const [userFoods, setUserFoods] = useState<FoodsList[] | null>(null);
  const { foodsList, setFoodsList } = useFoodsListStore();

  useEffect(() => {
    if (user?.spicy_preference !== null) {
      axios
        .get('your-api-endpoint-here')
        .then((res) => {
          // setUserFoods(res.data);
          console.log(res);
          console.log(foodsList);
          // FoodsCarouselList로 박아놨는데, 데이터 통신해서 가져오면 됨
          setUserFoods(FoodsCarouselList);
          setFoodsList(FoodsCarouselList);
        })
        .catch((err) => {
          console.error('Error fetching foods:', err);
        });
    }
  }, [user]);

  const listToUse = user?.spicy_preference === null ? FoodsCarouselList : userFoods;

  return (
    <div className="h-full w-full py-4">
      <Swiper
        slidesPerView={'auto'}
        pagination={{
          clickable: true,
        }}>
        {listToUse?.map((item) => (
          <SwiperSlide key={item.id} className="flex w-[70%] flex-col items-center justify-center pl-4">
            <Link to={`/foods/${item.id}`} className="relative w-full">
              <ImageWithPlaceholder src={item.imageUrl} alt={item.name} />
            </Link>
            <p className="mt-2 font-medium">{item.name}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FoodsCarousel;
