import { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useFoodStore } from '../../store/foodStore';
import { SearchResult } from '../../store/foodStore';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  className?: string;
}

interface PositionProps {
  lat: number;
  lng: number;
}

const { kakao } = window;

function Map({ className }: KakaoMapProps) {
  const mapClass = twMerge(className);
  const [map, setMap] = useState<any>(null);
  const [currentPosition, setCurrentPosition] = useState<PositionProps | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  const defaultMarkerImage = new kakao.maps.MarkerImage('/images/marker2.svg', new kakao.maps.Size(40, 45));
  const clickedMarkerImage = new kakao.maps.MarkerImage('/images/marker.svg', new kakao.maps.Size(40, 45));

  // 스토어에서 가져오기
  const { foodName, setSearchResults, selectedRestaurant, setSelectedRestaurant, setIsLoading } = useFoodStore();

  // 지도 생성
  const initMap = () => {
    if (!currentPosition || map) return;
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(`${currentPosition.lat - 0.003}`, currentPosition.lng),
      level: 5,
    };
    const newMap = new kakao.maps.Map(container as HTMLElement, options);
    setMap(newMap);
  };

  // 마커 생성
  const createMarker = (place: any) => {
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(place.y, place.x),
      image: defaultMarkerImage,
    });
    marker.id = place.id; // 마커에 id 추가
    marker.customOverlay = createCustomOverlay(place); // 마커에 커스텀 오버레이 추가
    return marker;
  };

  // 커스텀 오버레이 생성
  const createCustomOverlay = (place: any) => {
    const content =
      `<a href=${place.url} target="_blank" class="customoverlay" style="background-color: white; padding: 5px; border-radius: 5px; border: 1px solid #ccc; font-size: 12px;">` +
      `${place.name}` +
      '</a>';
    return new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(place.y, place.x),
      content: content,
      yAnchor: 2.8,
    });
  };

  // 마커 클릭 이벤트 생성
  const setupMarkerClickEvent = (marker: any) => {
    kakao.maps.event.addListener(marker, 'click', () => {
      setSelectedRestaurant(marker.id); // 마커 클릭 시 선택된 식당 업데이트
    });
  };

  // 마커 추가 및 이벤트 설정
  const addMarker = (place: any) => {
    const marker = createMarker(place);
    setupMarkerClickEvent(marker);
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
    return marker;
  };

  // 기존 마크 제거
  const removeAllMarkers = () => {
    markers.forEach((marker) => {
      marker.setMap(null);
      if (marker.customOverlay) {
        marker.customOverlay.setMap(null);
      }
    });
    setMarkers([]);
  };

  // 위치 새로고침
  const refreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(newPosition);

          if (map) {
            map.setCenter(new kakao.maps.LatLng(newPosition.lat, newPosition.lng));
            searchPlaces(); // 새 위치에서 다시 검색
          }
        },
        (error) => {
          console.error('Error getting current position:', error);
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  // 장소 검색
  const searchPlaces = () => {
    if (!map || !currentPosition || !foodName) return;

    removeAllMarkers();
    setIsLoading(true); // 검색 시작 시 로딩 상태를 true로 설정

    const places = new kakao.maps.services.Places();

    const callback = (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        console.log('Search places success', result);
        const formattedResults: SearchResult[] = result.map((place: any) => ({
          id: place.id,
          name: place.place_name,
          number: place.phone,
          address: place.address_name,
          distance: place.distance,
          url: place.place_url,
          x: place.x,
          y: place.y,
        }));

        setSearchResults(formattedResults);

        // 새 마커 생성
        formattedResults.forEach((place) => {
          const marker = addMarker(place);
          marker.setMap(map); // 마커를 지도에 추가
        });
      } else {
        console.log('No results found or error occurred. Status:', status);
        setSearchResults([]);
      }
      setIsLoading(false);
    };

    places.keywordSearch(foodName, callback, {
      location: new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng),
      radius: 2000,
      sort: kakao.maps.services.SortBy.DISTANCE,
      size: 15,
    });
  };

  useEffect(() => {
    if (map && selectedRestaurant) {
      const selectedPlace = markers.find((marker) => marker.id === selectedRestaurant);
      if (selectedPlace) {
        markers.forEach((marker) => {
          if (marker.id === selectedRestaurant) {
            marker.setImage(clickedMarkerImage);
            // 선택된 마커의 커스텀 오버레이 표시
            if (marker.customOverlay) {
              marker.customOverlay.setMap(map);
            }
          } else {
            marker.setImage(defaultMarkerImage);
            // 다른 마커의 커스텀 오버레이 숨기기
            if (marker.customOverlay) {
              marker.customOverlay.setMap(null);
            }
          }
        });
      }
    }
  }, [selectedRestaurant, map, markers]);

  useEffect(() => {
    refreshLocation(); // 컴포넌트 마운트 시 초기 위치 설정
  }, []);

  useEffect(() => {
    if (currentPosition) {
      kakao.maps.load(() => {
        initMap();
      });
    }
  }, [currentPosition]);

  useEffect(() => {
    if (map && foodName) {
      searchPlaces();
    }
  }, [map, foodName]);

  return (
    <div className="relative h-full w-full">
      <button
        onClick={refreshLocation}
        className="absolute right-[10px] top-[10px] z-20 w-[40px] rounded-full bg-white p-[5px] font-bold text-white shadow-[0_0px_8px_0_rgba(0,0,0,0.20)]">
        <img src="/images/reload.svg" className="h-full w-full" alt="" />
      </button>
      <div id="map" className={`${mapClass} h-full w-full`} />
    </div>
  );
}

export default Map;
