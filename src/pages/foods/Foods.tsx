import { useState, useEffect } from 'react';
import Tag from '../../components/common/Tag';
import FoodCard from '../../components/foods/FoodCard';
import FOOD_DATA from '../../DUMMY_DATA/FOOD_DATA.json';

const filter: string[] = ['기본', '점심', '저녁', '야식', '데이트', '스트레스🔥', '다이어트'];

const Foods = () => {
  const [selectedTag, setSelectedTag] = useState<string>('기본');
  const [filteredFoods, setFilteredFoods] = useState(FOOD_DATA);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const filterFoods = (tag: string) => {
    if (tag === '기본') {
      return FOOD_DATA;
    }
    return FOOD_DATA.filter((food) => food.tag.includes(tag));
  };

  useEffect(() => {
    setFilteredFoods(filterFoods(selectedTag));
  }, [selectedTag]);

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
        {filteredFoods.map((item) => (
          <FoodCard key={item.id} id={item.id} info={item.info} name={item.name} tag={item.tag} img={item.img} />
        ))}
      </div>
    </div>
  );
};

export default Foods;
