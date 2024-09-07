import { Link } from 'react-router-dom';
import ThunderCard from '../../components/thunder/ThunderCard';

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

interface ThunderListProps {
  thunderItems: ThunderItem[];
  type: string;
}

const ThunderList = ({ thunderItems, type }: ThunderListProps) => {
  return thunderItems.length === 0 ? (
    <div className="flex h-full w-full flex-col items-center justify-center py-8">
      <p className="mt-10 text-[24px] text-[#666666] xs:text-[20px]">{`선택된 글 목록(${type})이 없어요`}</p>
      <img src="/images/CryingEgg.svg" className="inline-block h-[40vh]" alt="Crying Egg" />
      {type === '작성한 글' && (
        <Link
          to={'/thunder/thunderpost'}
          className="flex h-[42px] w-[90%] items-center justify-center rounded-[8px] bg-primary font-bold text-white">
          게시글 만들기
        </Link>
      )}
    </div>
  ) : (
    thunderItems.map((item) => (
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
    ))
  );
};

export default ThunderList;
