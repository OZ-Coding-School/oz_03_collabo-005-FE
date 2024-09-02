import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModalBottom from '../../components/common/ModalBottom';
import ThunderCard from '../../components/thunder/ThunderCard';
import RoundedButton from '../../components/thunder/RoundedButton';
import SelectionItem from '../../components/thunder/SelectionItem';
import { baseInstance } from '../../api/util/instance';
import Loading from '../../components/common/Loading';

interface Meeting {
  uuid: string;
  meeting_image_url: string;
  description: string;
  payment_method_name: string;
  meeting_time: string;
  title: string;
  gender_group_name: string;
  age_group_name: string;
}

interface Category {
  id: number;
  location_name?: string;
  sort_name?: string;
}

const Thunder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectedList, setIsSelectedList] = useState(true);
  const [locationCategories, setLocationCategories] = useState<Category[]>([]);
  const [timeCategories, setTimeCategories] = useState<Category[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMeetings = (locationId?: number, timeId?: number) => {
    console.log(locationId, timeId);
    // baseInstance.get(`/api/meetings/filter/${Number(locationId)}/${Number(timeId)}`).then((res) => {
    //   console.log(res);
    //   setMeetings(res.data);
    // });
  };

  useEffect(() => {
    baseInstance
      .get('/api/meetings/')
      .then((res) => {
        console.log(res.data);
        setLocationCategories(res.data.location_categories);
        setSelectedLocation(res.data.location_categories[0].id);
        setTimeCategories(res.data.time_categories);
        setSelectedTime(res.data.time_categories[0].id);
        setMeetings(res.data.meetings);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedLocation !== null && selectedTime !== null) {
      fetchMeetings(selectedLocation, selectedTime);
    }
  }, [selectedLocation, selectedTime]);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleListSelection = (isAll: boolean) => {
    setIsModalOpen((prev) => !prev);
    setIsSelectedList(isAll);
  };

  useEffect(() => {
    document.getElementById('root')?.scrollTo(0, 0);
  }, [selectedLocation, selectedTime]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative w-full max-w-[600px] p-4 pt-0">
      <div className="fixed top-[72px] z-20 w-full max-w-[600px] bg-white pr-8 xs:top-[52px]">
        <h1 className="my-[12px] min-w-[300px] text-2xl font-bold xs:text-xl">음식으로 시작되는 인연</h1>
        <div className="my-2 flex w-full min-w-[314px] max-w-[600px] items-center justify-between">
          <RoundedButton onClick={() => handleListSelection(true)}>
            {locationCategories.find((category) => category.id === selectedLocation)?.location_name || '지역 선택'}
          </RoundedButton>
          <RoundedButton onClick={() => handleListSelection(false)}>
            {timeCategories.find((category) => category.id === selectedTime)?.sort_name || '시간 선택'}
          </RoundedButton>
        </div>
      </div>
      {meetings.length === 0 ? (
        <div className="mb-[72px] mt-[100px] flex w-full flex-col items-center justify-evenly bg-[#EEEEEE]">
          <p className="mt-10 text-[24px] text-[#666666] xs:text-[20px]">등록된 일정이 없어요</p>
          <img src="/images/CryingEgg.svg" className="inline-block h-[40vh]" />
          <p className="mb-4 flex items-center text-[20px] text-[#666666] xs:text-[16px]">
            <img src="/images/plusCircle.svg" className="mr-1 w-[2rem] xs:w-[1.5rem]" />
            버튼을 눌러 일정을 만들어보세요
          </p>
        </div>
      ) : (
        <div className="mb-[72px] mt-[100px] flex flex-col items-center overflow-auto">
          {meetings.map((item) => {
            return (
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
            );
          })}
        </div>
      )}
      <Link
        to={'/thunder/thunderpost'}
        className="fixed bottom-[120px] right-[calc(50%-260px)] z-10 xs:bottom-[100px] xs:right-[5%]">
        <motion.div
          className='h-[63px] w-[63px] bg-[url("/images/plusCircle.svg")] bg-cover bg-center bg-no-repeat xs:h-[53px] xs:w-[53px]'
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      </Link>
      <ModalBottom isOpen={isModalOpen} onClose={toggleModal}>
        <div className="mx-auto h-[6px] w-[66px] rounded-[8px] bg-[#d9d9d9]" />
        <div className="flex flex-col gap-[20px] p-[20px]">
          <div className="text-[18px] font-bold">{isSelectedList ? '지역 선택' : '정렬 선택'}</div>
          {(isSelectedList ? locationCategories : timeCategories).map((item) => (
            <SelectionItem
              key={item.id}
              item={isSelectedList ? item.location_name : item.sort_name}
              isSelected={isSelectedList ? selectedLocation === item.id : selectedTime === item.id}
              onClick={() => {
                isSelectedList ? setSelectedLocation(item.id) : setSelectedTime(item.id);
              }}
            />
          ))}
        </div>
      </ModalBottom>
    </div>
  );
};

export default Thunder;
