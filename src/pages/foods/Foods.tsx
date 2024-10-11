import { useState, useEffect, useCallback } from 'react';
import Tag from '../../components/common/Tag';
import FoodCard from '../../components/foods/FoodCard';
import { FoodsList } from '../../types/types';
import { getItem } from '../../utils/storage';
import { postAllFoods } from '../../api/apis/foods';
import { getCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';

const filter: string[] = ['기본', '점심', '저녁', '간식', '데이트', '회식', '다이어트'];

const Foods = () => {
  const [selectedTag, setSelectedTag] = useState<string>('기본');
  const [filteredFoods, setFilteredFoods] = useState<FoodsList[]>([]);
  const [sessionFoods, setSessionFoods] = useState<FoodsList[]>([]);
  const [apiFoods, setApiFoods] = useState<FoodsList[]>([]);

  const navigate = useNavigate();

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const mapTags = (food: FoodsList): string[] => {
    const tags: string[] = [];
    if (food.is_lunch) tags.push('점심');
    if (food.is_dinner) tags.push('저녁');
    if (food.is_snack) tags.push('간식');
    if (food.is_date) tags.push('데이트');
    if (food.is_party) tags.push('회식');
    if (food.is_diet) tags.push('다이어트');
    return tags;
  };

  const filterFoods = useCallback(
    (tag: string): FoodsList[] => {
      const sessionFoodIds = new Set(sessionFoods.map((food) => food.food_id));
      const uniqueApiFoods = apiFoods.filter((food) => !sessionFoodIds.has(food.food_id));
      const combinedFoods = [...sessionFoods, ...uniqueApiFoods];

      if (tag === '기본') {
        return combinedFoods;
      }
      return combinedFoods.filter((food) => mapTags(food).includes(tag));
    },
    [sessionFoods, apiFoods],
  );

  const getAllFoods = async () => {
    const response = await postAllFoods();
    setApiFoods(response.recommendations);
  };

  useEffect(() => {
    const refresh = getCookie('refresh');
    if (!refresh) {
      return navigate('/signin');
    }
    const recommendedFoods = getItem('foodsList-storage');
    if (recommendedFoods) {
      const parsedFoods = JSON.parse(recommendedFoods).state.foodsList;
      setSessionFoods(parsedFoods);
    }
    getAllFoods(); // API 호출
  }, []);

  useEffect(() => {
    setFilteredFoods(filterFoods(selectedTag));
  }, [selectedTag, sessionFoods, apiFoods, filterFoods]);

  return (
    <div>
      <h1 className="mb-[12px] mt-[20px] px-[16px] text-[28px] md:ml-[80px]">맛있는 발견의 시작✨</h1>
      <div className="flex gap-[12px] overflow-x-scroll px-[12px] py-[8px] scrollbar-hide md:ml-[80px]">
        {filter.map((item) => (
          <Tag
            key={item}
            height="lg"
            rounded="lg"
            onClick={() => handleTagClick(item)}
            padding="lg"
            isSelected={selectedTag === item}
            className="cursor-pointer text-nowrap text-[14px] transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-orange-100 active:scale-95">
            {item}
          </Tag>
        ))}
      </div>
      <div className="flex flex-col gap-[20px] px-[16px] py-[12px] md:grid md:w-full md:grid-cols-2 md:flex-wrap md:gap-[50px] md:px-[100px] lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.isArray(filteredFoods) &&
          filteredFoods.map((item, index) => (
            <div
              key={`${item.food_id}-${index}`}
              className="transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
              <FoodCard id={item.food_id} name={item.food_name} tag={mapTags(item)} img={item.image_url || ''} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Foods;
