import { useState, useEffect } from 'react';
import Tag from '../../components/common/Tag';
import FoodCard from '../../components/foods/FoodCard';
import { useFoodStore } from '../../store/foodStore';
import { FoodsList } from '../../types/types';
import { getItem } from '../../utils/storage';
import { postAllFoods } from '../../api/apis/foods';

const filter: string[] = ['기본', '점심', '저녁', '간식', '데이트', '회식', '다이어트'];

const Foods = () => {
  const [selectedTag, setSelectedTag] = useState<string>('기본');
  const [filteredFoods, setFilteredFoods] = useState<FoodsList[]>([]);
  const { foodsList, setFoodsList } = useFoodStore();

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

  const filterFoods = (tag: string): FoodsList[] => {
    if (tag === '기본') {
      return foodsList;
    }
    return foodsList.filter((food) => mapTags(food).includes(tag));
  };

  const getAllFoods = async () => {
    const response = await postAllFoods();
    console.log('All foods fetched:', response.data);
  };

  useEffect(() => {
    const recommendedFoods = getItem('foodsList-storage');
    if (recommendedFoods) {
      const parsedFoods = JSON.parse(recommendedFoods).state.foodsList;
      setFoodsList(parsedFoods);
    }
  }, [setFoodsList]);

  useEffect(() => {
    setFilteredFoods(filterFoods(selectedTag));
  }, [selectedTag, foodsList]);

  useEffect(() => {
    getAllFoods();
  }, []);

  return (
    <div>
      <h1 className="mb-[12px] mt-[20px] px-[16px] text-[28px]">맛있는 발견의 시작✨</h1>
      <div className="flex gap-[12px] overflow-x-scroll px-[12px] py-[8px] scrollbar-hide">
        {filter.map((item) => (
          <Tag
            key={item}
            height="lg"
            rounded="lg"
            onClick={() => handleTagClick(item)}
            padding="lg"
            isSelected={selectedTag === item}
            className="cursor-pointer text-nowrap text-[14px]">
            {item}
          </Tag>
        ))}
      </div>
      <div className="flex flex-col gap-[20px] px-[16px] py-[12px]">
        {Array.isArray(filteredFoods) &&
          filteredFoods.map((item) => (
            <FoodCard
              key={item.food_id}
              id={item.food_id}
              name={item.food_name}
              tag={mapTags(item)}
              img={item.image_url || ''}
            />
          ))}
      </div>
    </div>
  );
};

export default Foods;
