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

interface FoodsCarouselProps {
  spicy: number | null;
}

const FoodsCarousel: React.FC<FoodsCarouselProps> = ({ spicy }) => {
  const [userFoods, setUserFoods] = useState<FoodsList[]>(FoodsCarouselList);
  const { setFoodsList } = useFoodsListStore();

  useEffect(() => {
    if (spicy) {
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
          recommends_cnt: 5,
        })
        .then((res) => {
          setUserFoods(res.data.recommendations);
          setFoodsList(res.data.recommendations);
        })
        .catch((err) => {
          console.error('Error fetching foods:', err);
        });
    }
  }, [spicy]);

  const listToUse = spicy ? userFoods : FoodsCarouselList;
  const defaultImageUrl = '/images/CuteEgg.svg';

  return (
    <div className="h-full w-full py-4">
      <Swiper
        slidesPerView={'auto'}
        pagination={{
          clickable: true,
        }}>
        {listToUse?.map((item) => (
          <SwiperSlide key={item.food_name} className="flex h-[70%] w-[70%] flex-col items-center justify-center pl-4">
            <Link to={`/foods/${item.food_id}`} className="relative w-full">
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
