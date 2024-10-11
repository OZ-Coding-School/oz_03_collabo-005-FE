import { Link } from 'react-router-dom';
import { formatCreatedAt } from '../../utils/formatCreatedAt';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoWalletOutline } from 'react-icons/io5';
import { GoPeople } from 'react-icons/go';
import { PiSpinnerGap } from 'react-icons/pi';

// ThunderIdHeader 컴포넌트의 props 타입 정의
interface ThunderIdHeaderProps {
  selectedMeeting: {
    uuid: string;
    title: string;
    payment_method_name: string;
    age_group_name: string;
    gender_group_name: string;
    meeting_time: string;
    meeting_image_url: string;
    description: string;
    created_at: string;
    nickname: string;
    profile_image_url?: string;
    is_liked: boolean;
    maximum: number;
    location_name: string;
  };
  profileImageUrl: string;
}

// ThunderIdHeader 컴포넌트 정의
const ThunderIdHeader = ({ selectedMeeting, profileImageUrl }: ThunderIdHeaderProps) => {
  return (
    <>
      {/* 모임 제목 */}
      <div className="mb-4 flex items-center justify-between text-xl font-bold">{selectedMeeting.title}</div>

      {/* 모임 정보 */}
      <div className="mb-4 flex flex-wrap items-center text-sm text-gray-500">
        {/* 모임 위치 */}
        <div className="mr-2 flex items-center rounded-md border-2 border-gray-200 bg-white px-2 py-1 text-black">
          <FaMapMarkerAlt className="mr-1" />
          {selectedMeeting.location_name}
        </div>

        {/* 결제 방식 */}
        <div className="mr-2 flex items-center rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
          <IoWalletOutline className="mr-1" />
          {selectedMeeting.payment_method_name}
        </div>

        {/* 성별 */}
        <div className="mr-2 flex items-center rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
          <GoPeople className="mr-1" />
          {selectedMeeting.gender_group_name}
        </div>

        {/* 연령대 */}
        <div className="mr-2 flex items-center rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
          <PiSpinnerGap className="mr-1" />
          {selectedMeeting.age_group_name}
        </div>
      </div>

      {/* 작성자 정보 */}
      <div className="mb-4 flex items-center">
        {/* 프로필 이미지 링크 */}
        <Link to={`/profile/${selectedMeeting.nickname}`}>
          <img
            src={profileImageUrl || selectedMeeting.profile_image_url || '../images/anonymous_avatars.svg'}
            alt="프로필 사진"
            className="mr-2 h-10 w-10 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = '../images/anonymous_avatars.svg';
            }}
          />
        </Link>
        <div>
          <div className="flex items-center">
            {/* 작성자 닉네임 링크 */}
            <Link to={`/profile/${selectedMeeting.nickname}`} className="text-sm font-medium">
              {selectedMeeting.nickname}
            </Link>
            {/* 작성 시간 */}
            <div className="ml-2 text-xs font-medium text-gray-500">{formatCreatedAt(selectedMeeting.created_at)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThunderIdHeader;
