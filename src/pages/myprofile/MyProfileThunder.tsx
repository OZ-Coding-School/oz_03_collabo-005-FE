import { useEffect, useState } from 'react';
import PostNav from '../../components/myprofile/PostNav';
import ThunderCard from '../../components/thunder/ThunderCard';
import { Link } from 'react-router-dom';
import { authInstance } from '../../api/util/instance';
import Loading from '../../components/common/Loading';

interface ThunderItem {
  uuid: string;
  title: string;
  payment_method_name: string;
  age_group_name: string;
  gender_group_name: string;
  meeting_time: string;
  meeting_image_url: string;
  description: string;
}

const MyProfileThunder = () => {
  // 유저 확인해서 로그인 안되어있으면 redirect
  const [selectedItem, setSelectedItem] = useState<string>('작성한 글');
  const [userSocialList, setSocialList] = useState<ThunderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (selectedItem === '작성한 글') {
      authInstance.get('/api/profile/hosted/meetings/').then((res) => {
        setSocialList(res.data);
        setIsLoading(false);
      });
    } else if (selectedItem === '참여 내역') {
      authInstance.get('/api/profile/joined/meetings/').then((res) => {
        setSocialList(res.data);
        setIsLoading(false);
      });
    } else {
      authInstance.get('/api/profile/liked/meeting/').then((res) => {
        setSocialList(res.data);
        setIsLoading(false);
      });
    }
  }, [selectedItem]);

  return (
    <>
      <PostNav list={['작성한 글', '참여 내역', '좋아요']} setSelectedItem={setSelectedItem} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="p-4 pt-0">
          {userSocialList && userSocialList.length === 0 ? (
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
            userSocialList?.map((item) => {
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
            })
          )}
        </div>
      )}
    </>
  );
};

export default MyProfileThunder;
