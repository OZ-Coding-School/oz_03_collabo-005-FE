import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFoodStore } from '../../store/foodStore';
import Map from '../../components/foods/KakaoMap';
import { BsTelephone } from 'react-icons/bs';
import { HiLocationMarker } from 'react-icons/hi';
import { TbRulerMeasure } from 'react-icons/tb';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FaDirections } from 'react-icons/fa';

const FoodsId = () => {
  const { setFoodName, searchResults, selectedRestaurant, setSelectedRestaurant, foodsList } = useFoodStore();
  const location = useLocation();
  const { name } = location.state || {};
  const [selectedTab, setSelectedTab] = useState('전체');
  const [isLocationAllowed, setIsLocationAllowed] = useState<boolean>(false);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

  const handleRestaurantClick = (id: string) => {
    setSelectedRestaurant(id);
  };

  useEffect(() => {
    setFoodName(name);
  }, [setFoodName, foodsList]);

  useEffect(() => {
    // 현재 위치 표시 - getCurrentPosition
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocationAllowed(true);
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(position.coords.longitude, position.coords.latitude, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const address = result[0].address.address_name;
            setCurrentAddress(address);
          }
        });
      },
      () => setIsLocationAllowed(false),
    );
  }, []);

  const filteredResults = searchResults.filter((result) => {
    const distance = parseInt(result.distance) / 1000;
    if (selectedTab === '가까워요') {
      return distance <= 0.5 && distance >= 0.1;
    } else if (selectedTab === '조금 멀어요') {
      return distance > 0.5 && distance <= 1.0;
    } else if (selectedTab === '많이 멀어요') {
      return distance > 1.0 && distance <= 3.0;
    }
    return true;
  });

  return (
    <div className="relative flex h-[calc(100vh-72px)] flex-col overflow-y-hidden xs:h-[calc(100vh-52px)]">
      {isLocationAllowed ? (
        <>
          <Map className="z-10 grow" />
          {currentAddress && (
            <div className="absolute z-20 rounded-r-lg bg-white px-2 py-2 shadow-lg">
              <p className="text-[10px] text-gray-800">내 주변위치는 {currentAddress} 입니다.</p>
            </div>
          )}
        </>
      ) : (
        <div className="z-10 flex grow items-center justify-center bg-gray-100">
          <p className="text-center text-gray-600">지도를 불러오려면 위치정보 권한을 허용해주세요</p>
        </div>
      )}
      <div className="z-20 flex max-h-[40%] min-h-[134px] w-full flex-col rounded-t-[16px] bg-white shadow-[0_-2px_21px_0_rgba(0,0,0,0.25)]">
        <div className="mx-auto mb-[20px] mt-[12px] h-[6px] min-h-[6px] w-[66px] rounded-full bg-gray-d9" />

        <div className="mb-2 flex gap-2 px-[12px]">
          {['전체', '가까워요', '조금 멀어요', '많이 멀어요'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`rounded-xl px-3 py-1 text-sm transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95 md:py-2 md:text-[20px] ${
                selectedTab === tab ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {tab}
            </button>
          ))}
        </div>
        {selectedTab === '가까워요' && (
          <p className="mb-2 ml-1 flex items-center gap-1 px-[12px] text-[12px] text-gray-600 md:text-[20px]">
            <TbRulerMeasure className="text-gray-600" />
            현재위치에서 거리가 0.1km~0.5km 이하입니다.
          </p>
        )}
        {selectedTab === '조금 멀어요' && (
          <p className="mb-2 ml-1 flex items-center gap-1 px-[12px] text-[12px] text-gray-600 md:text-[20px]">
            <TbRulerMeasure className="text-gray-600" />
            현재위치에서 거리가 0.5km~1.0km 이하입니다.
          </p>
        )}
        {selectedTab === '많이 멀어요' && (
          <p className="mb-2 ml-1 flex items-center gap-1 px-[12px] text-[12px] text-gray-600 md:text-[20px]">
            <TbRulerMeasure className="text-gray-600" />
            현재위치에서 거리가 1.0km~3km 이하입니다.
          </p>
        )}

        <div className="mb-2 ml-1 flex items-center gap-1 px-[12px] text-gray-600 md:text-[20px] xs:text-[12px]">
          가게정보를 보려면 <AiOutlineInfoCircle className="text-gray-600" /> 아이콘을 눌러주세요.
        </div>

        <div className="mb-2 h-[1px] w-full bg-gray-200" />

        <div className="flex flex-col overflow-y-scroll scrollbar-hide">
          {filteredResults.map((result) => (
            <div
              className={`mb-1 flex max-h-[96px] gap-[12px] rounded-xl px-[12px] py-[8px] ${
                selectedRestaurant === result.id ? 'bg-[#FAF2F0]' : ''
              }`}
              key={result.id}
              onClick={() => handleRestaurantClick(result.id)}>
              <div className="max-h-[80px] flex-1">
                <div className="flex items-center">
                  <p className="text-[15px] font-medium md:text-[20px] xs:text-[12px]">{result.name}</p>
                  <a href={`https://place.map.kakao.com/${result.id}`} target="_blank" rel="noopener noreferrer">
                    <AiOutlineInfoCircle className="ml-1 text-gray-600 md:text-[20px] xs:text-[10px]" />
                  </a>
                  <div className="mx-1 h-4 w-[1px] bg-gray-300" />
                  <div className="flex items-center">
                    <TbRulerMeasure className="text-gray-600 md:text-[20px] xs:text-[10px]" />
                    <p className="ml-1 text-[10px] text-gray-800 md:text-[20px]">
                      {`${(parseInt(result.distance) / 1000).toFixed(2)}km`}
                      {parseInt(result.distance) / 1000 <= 0.5 && parseInt(result.distance) / 1000 >= 0.1 && (
                        <span className="ml-2 rounded-full border-2 bg-slate-200 px-2 py-1 text-gray-800">
                          가까워요
                        </span>
                      )}
                      {parseInt(result.distance) / 1000 > 0.5 && parseInt(result.distance) / 1000 <= 1.0 && (
                        <span className="ml-2 rounded-full bg-green-500 px-2 py-1 text-white">조금 멀어요</span>
                      )}
                      {parseInt(result.distance) / 1000 > 1.0 && parseInt(result.distance) / 1000 <= 3.0 && (
                        <span className="ml-2 rounded-full bg-indigo-500 px-2 py-1 text-white">많이 멀어요</span>
                      )}
                    </p>
                  </div>
                </div>

                <p className="flex items-center gap-1 text-[12px] md:text-[20px] xs:text-[10px]">
                  <BsTelephone className="text-gray-800" />
                  {result.number || '전화번호 없음'}
                </p>
                <p className="flex items-center gap-1 text-[12px] md:text-[20px] xs:text-[10px]">
                  <HiLocationMarker className="text-gray-800" />
                  {result.address}
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <a
                  href={
                    currentPosition
                      ? `https://map.kakao.com/link/from/${currentAddress},${currentPosition.lat},${currentPosition.lng}/to/${result.name},${result.y},${result.x}`
                      : `https://map.kakao.com/link/to/${result.name},${result.y},${result.x}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-sky-500 px-2 py-2 text-white transition-colors duration-200 ease-in-out hover:bg-sky-600 active:bg-sky-700"
                  onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col items-center">
                    <FaDirections className="text-[20px] md:text-[40px]" />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodsId;
