import { useState, useEffect } from 'react';
import ModalBottom from '../../components/common/ModalBottom';
import ThunderCard from '../../components/thunder/ThunderCard';
import RoundedButton from '../../components/thunder/RoundedButton';
import SelectionItem from '../../components/thunder/SelectionItem';
import { baseInstance } from '../../api/util/instance';
import Loading from '../../components/common/Loading';
import { getCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';

interface Meeting {
  uuid: string;
  title: string;
  description: string;
  meeting_time: string;
  age_group_name: string;
  payment_method_name: string;
  gender_group_name: string;
  meeting_image_url: string;
}

interface Category {
  id: number;
  location_name?: string;
  sort_name?: string;
}

const Thunder: React.FC = () => {
  const [filter, setFilter] = useState<{ location?: string; time?: string }>({
    location: undefined,
    time: undefined,
  });
  const [locationCategories, setLocationCategories] = useState<Category[]>([]);
  const [timeCategories, setTimeCategories] = useState<Category[]>([]);
  const [meetings, setMeetings] = useState<Meeting[] | null>(null);
  const [modalState, setModalState] = useState<'none' | 'filter' | 'login'>('none');
  const [isSelectedList, setIsSelectedList] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById('root')?.scrollTo(0, 0);
  }, [filter]);

  const fetchMeetings = (locationName: string | undefined, timeName: string | undefined) => {
    baseInstance
      .get(`/api/meetings/filter/${locationName}/${timeName}`)
      .then((res) => {
        setMeetings(res.data);
      })
      .catch((error) => {
        console.error('소셜 다이닝 목록을 가져오는 중 오류가 발생했습니다:', error);
      });
  };

  useEffect(() => {
    baseInstance
      .get('/api/meetings/')
      .then((res) => {
        setLocationCategories(res.data.location_categories);
        setTimeCategories(res.data.time_categories);
        const initialLocation = res.data.location_categories[0]?.location_name;
        const initialTime = res.data.time_categories[0]?.sort_name;
        setFilter({ location: initialLocation, time: initialTime });
        fetchMeetings(initialLocation, initialTime);
      })
      .catch(() => {
        // console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (filter.location && filter.time) {
      fetchMeetings(filter.location, filter.time);
    }
  }, [filter]);

  const toggleModal = () => {
    setModalState(modalState === 'filter' ? 'none' : 'filter');
  };

  const handleListSelection = (isAll: boolean) => {
    setModalState(modalState === 'filter' ? 'none' : 'filter');
    setIsSelectedList(isAll);
  };

  const checkLogin = () => {
    const token = getCookie('refresh');
    if (!token) {
      setModalState('login');
    } else {
      navigate('/thunder/thunderpost');
    }
  };

  if (meetings === null) {
    return <Loading />;
  }

  return (
    <div className="relative w-full max-w-[600px] p-4 pt-0">
      <div className="fixed top-[72px] z-20 w-full max-w-[600px] bg-white pr-8 xs:top-[52px]">
        <h1 className="my-[12px] min-w-[300px] text-2xl font-bold xs:text-xl">음식으로 시작되는 인연</h1>
        <div className="my-2 flex w-full min-w-[314px] max-w-[600px] items-center justify-between">
          <RoundedButton onClick={() => handleListSelection(true)}>
            {locationCategories.find((category) => category.location_name === filter.location)?.location_name ||
              '지역 선택'}
          </RoundedButton>
          <RoundedButton onClick={() => handleListSelection(false)}>
            {timeCategories.find((category) => category.sort_name === filter.time)?.sort_name || '시간 선택'}
          </RoundedButton>
        </div>
      </div>
      {meetings.length === 0 ? (
        <div className="mb-[72px] mt-[100px] flex w-full flex-col items-center justify-evenly bg-[#EEEEEE]">
          <p className="mt-10 text-[24px] text-[#666666] xs:text-[20px]">등록된 일정이 없어요</p>
          <img src="/images/CryingEgg.svg" className="inline-block h-[40vh]" alt="Crying Egg" />
          <p className="mb-4 flex items-center text-[20px] text-[#666666] xs:text-[16px]">
            <img src="/images/plusCircle.svg" className="mr-1 w-[2rem] xs:w-[1.5rem]" alt="Plus Circle" />
            버튼을 눌러 일정을 만들어보세요
          </p>
        </div>
      ) : (
        <div className="mb-[72px] mt-[100px] flex flex-col items-center overflow-auto">
          {meetings.map((item) => (
            <ThunderCard
              key={item.uuid}
              id={item.uuid}
              meeting_image_url={item.meeting_image_url}
              description={item.description}
              paymentMethod={item.payment_method_name}
              appointmentTime={item.meeting_time}
              title={item.title}
              genderGroup={item.gender_group_name}
              ageGroup={item.age_group_name}
            />
          ))}
        </div>
      )}
      <div
        onClick={checkLogin}
        className="fixed bottom-[120px] right-[calc(50%-260px)] z-10 cursor-pointer xs:bottom-[100px] xs:right-[5%]">
        <div className='h-[63px] w-[63px] bg-[url("/images/plusCircle.svg")] bg-cover bg-center bg-no-repeat transition-transform duration-200 ease-in-out hover:scale-110 active:scale-90 xs:h-[53px] xs:w-[53px]' />
      </div>
      <ModalBottom isOpen={modalState === 'filter'} onClose={toggleModal}>
        <div className="mx-auto h-[6px] w-[66px] rounded-[8px] bg-[#d9d9d9]" />
        <div className="flex flex-col gap-[20px] p-[20px]">
          <div className="text-[18px] font-bold">{isSelectedList ? '지역 선택' : '정렬 선택'}</div>
          {(isSelectedList ? locationCategories : timeCategories).map((item) => (
            <SelectionItem
              key={item.id}
              item={isSelectedList ? item.location_name : item.sort_name}
              isSelected={isSelectedList ? filter.location === item.location_name : filter.time === item.sort_name}
              onClick={() => {
                if (isSelectedList) {
                  setFilter((prev) => ({ ...prev, location: item.location_name }));
                } else {
                  setFilter((prev) => ({ ...prev, time: item.sort_name }));
                }
              }}
            />
          ))}
        </div>
      </ModalBottom>
      <ModalBottom isOpen={modalState === 'login'} onClose={() => setModalState('none')}>
        <div className="p-4 text-center">
          <p className="my-4 text-2xl font-semibold xs:text-xl">로그인이 필요한 서비스 입니다.</p>
          <p className="my-2 text-gray-600 xs:text-[14px]">일정을 만들려면 먼저 로그인해주세요.</p>
          <button
            className="mt-4 w-full rounded-lg bg-primary px-10 py-3 font-bold text-white"
            onClick={() => {
              setModalState('none');
              navigate('/signIn');
            }}>
            로그인하기
          </button>
        </div>
      </ModalBottom>
    </div>
  );
};

export default Thunder;
