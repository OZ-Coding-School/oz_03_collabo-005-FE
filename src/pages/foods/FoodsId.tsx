import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFoodStore } from '../../store/foodStore';
import Map from '../../components/foods/KakaoMap';

const FoodsId = () => {
  const { setFoodName, searchResults, selectedRestaurant, setSelectedRestaurant, foodsList } = useFoodStore();
  const location = useLocation();
  const { name } = location.state || {};

  const handleRestaurantClick = (id: string) => {
    setSelectedRestaurant(id);
  };

  useEffect(() => {
    setFoodName(name);
  }, [setFoodName, foodsList]);

  return (
    <div className="relative flex h-[calc(100vh-72px)] flex-col overflow-y-hidden xs:h-[calc(100vh-52px)]">
      <Map className="z-10 grow" />
      <div className="z-20 flex max-h-[40%] min-h-[134px] w-full flex-col rounded-t-[16px] bg-white shadow-[0_-2px_21px_0_rgba(0,0,0,0.25)]">
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
