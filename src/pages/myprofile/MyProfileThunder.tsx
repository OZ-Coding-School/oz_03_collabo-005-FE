import { useEffect, useState } from 'react';
import PostNav from '../../components/myprofile/PostNav';
import { meetingList } from '../../data/meetingList';
import ThunderCard from '../../components/thunder/ThunderCard';
import { Link } from 'react-router-dom';

const MyProfileThunder = () => {
  // 유저 확인해서 로그인 안되어있으면 redirect
  const [selectedItem, setSelectedItem] = useState<string>('작성한 글');

  useEffect(() => {
    // selectedItem으로 데이터 통신하면 됨. 그리고 그 결과로 아래에서 meetingList를 대체
    console.log(selectedItem);
  }, [selectedItem]);

  return (
    <>
      <PostNav list={['작성한 글', '참여 내역', '좋아요']} setSelectedItem={setSelectedItem} />
      <div className="mb-[72px] p-4 pt-0">
        {meetingList.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-evenly bg-[#EEEEEE] py-8">
            <p className="mt-10 text-[24px] text-[#666666] xs:text-[20px]">
              {`선택된 글 목록(${selectedItem})이 없어요`}
            </p>
            <img src="/images/CryingEgg.svg" className="inline-block h-[40vh]" />
            {selectedItem === '작성한 글' ? (
              <Link
                to={'/thunder/thunderpost'}
                className="flex h-[42px] w-[90%] items-center justify-center rounded-[8px] bg-primary font-bold text-white">
                게시글 만들기
              </Link>
            ) : (
              <></>
            )}
          </div>
        ) : (
          meetingList.map((item) => {
            return (
              <ThunderCard
                key={item.id}
                id={item.id}
                imageUrl={item.image_url}
                description={item.description}
                paymentMethod={item.payment_method}
                appointmentTime={item.appointment_time}
                title={item.title}
                genderGroup={item.gender_group}
                ageGroup={item.age_group}
              />
            );
          })
        )}
      </div>
    </>
  );
};

export default MyProfileThunder;
