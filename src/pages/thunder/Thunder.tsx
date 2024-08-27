import { Link } from 'react-router-dom';
import { useState } from 'react';
import { meetingList } from '../../data/meetingList';
import ModalBottom from '../../components/common/ModalBottom';
import ThunderCard from '../../components/thunder/ThunderCard';
import RoundedButton from '../../components/thunder/RoundedButton';
import SelectionItem from '../../components/thunder/SelectionItem';

const Thunder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectedList, setIsSelectedList] = useState(true);
  const locationList = ['전체', '강동, 하남', '강남, 송파'];
  const listArray = ['가까운 일정 순', '최신 등록 순'];
  const [selectedLocation, setSelectedLocation] = useState<string>(locationList[0]);
  const [selectedArray, setSelectedArray] = useState<string>(listArray[0]);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleListSelection = (isAll: boolean) => {
    setIsModalOpen((prev) => !prev);
    setIsSelectedList(isAll);
  };

  return (
    <div className="relative w-full max-w-[600px] p-4 pt-0">
      <div className="fixed top-[55px] z-20 w-full max-w-[600px] bg-white pr-8 xs:top-[52px]">
        <h1 className="my-[12px] text-xl font-bold">음식으로 시작되는 인연</h1>
        <div className="my-2 flex w-full max-w-[600px] items-center justify-between">
          <RoundedButton onClick={() => handleListSelection(true)}>{selectedLocation}</RoundedButton>
          <RoundedButton onClick={() => handleListSelection(false)}>{selectedArray}</RoundedButton>
        </div>
      </div>
      {meetingList.length === 0 ? (
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
          {meetingList.map((item) => {
            return (
              <ThunderCard
                key={item.id}
                id={item.id}
                imageUrl={Array.isArray(item.image_url) ? item.image_url[0] : item.image_url}
                description={item.description}
                paymentMethod={item.payment_method}
                appointmentTime={item.appointment_time}
                title={item.title}
                genderGroup={item.gender_group}
                ageGroup={item.age_group}
              />
            );
          })}
        </div>
      )}
      <Link
        to={'/thunder/thunderpost'}
        className='fixed bottom-[120px] right-[calc(50%-260px)] z-10 h-[63px] w-[63px] bg-[url("/images/plusCircle.svg")] bg-cover bg-center bg-no-repeat xs:bottom-[100px] xs:right-[5%] xs:h-[53px] xs:w-[53px]'
      />
      <ModalBottom isOpen={isModalOpen} onClose={toggleModal}>
        <div className="mx-auto h-[6px] w-[66px] rounded-[8px] bg-[#d9d9d9]" />
        <div className="flex flex-col gap-[20px] p-[20px]">
          <div className="text-[18px] font-bold">{isSelectedList ? '지역 선택' : '정렬 선택'}</div>
          {(isSelectedList ? locationList : listArray).map((item) => (
            <SelectionItem
              key={item}
              item={item}
              isSelected={isSelectedList ? selectedLocation === item : selectedArray === item}
              onClick={() => {
                isSelectedList ? setSelectedLocation(item) : setSelectedArray(item);
              }}
            />
          ))}
        </div>
      </ModalBottom>
    </div>
  );
};

export default Thunder;
