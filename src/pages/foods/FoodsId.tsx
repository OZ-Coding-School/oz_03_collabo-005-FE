import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FOOD_DATA from '../../DUMMY_DATA/FOOD_DATA.json';
import { useFoodStore } from '../../store/foodStore/foodStore';
import Map from '../../components/foods/KakaoMap';

const FoodsId = () => {
  const { foodsId } = useParams<string>();
  const { setFoodName, searchResults, selectedRestaurant, setSelectedRestaurant } = useFoodStore();

  const handleRestaurantClick = (id: string) => {
    setSelectedRestaurant(id);
    console.log(id);
  };

  useEffect(() => {
    const foodData = FOOD_DATA.find((item) => item.id === foodsId);
    if (foodData) {
      setFoodName(foodData.name);
    }
  }, [foodsId, setFoodName]);

  return (
    <div className="relative flex h-[100%] flex-col overflow-y-hidden">
      <Map className="z-10" />
      <div className="absolute bottom-0 z-20 flex max-h-[42%] min-h-[134px] w-full flex-col rounded-t-[16px] bg-white shadow-[0_-2px_21px_0_rgba(0,0,0,0.25)]">
        <div className="mx-auto mb-[20px] mt-[12px] h-[6px] min-h-[6px] w-[66px] rounded-full bg-gray-d9" />

        <div className="flex flex-col overflow-y-scroll scrollbar-hide">
          {searchResults.map((result) => (
            <div
              className={`flex max-h-[96px] gap-[12px] px-[12px] py-[8px] ${
                selectedRestaurant === result.id ? 'bg-[#FAF2F0]' : ''
              }`}
              key={result.id}
              onClick={() => handleRestaurantClick(result.id)}>
              <div className="max-h-[80px]">
                <p className="text-[16px] font-medium">{result.name}</p>
                <p className="text-[12px]">{result.number}</p>
                <p className="text-[12px]">{result.address}</p>
                <p className="text-[12px]">{`${(parseInt(result.distance) / 1000).toFixed(2)}km`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodsId;
