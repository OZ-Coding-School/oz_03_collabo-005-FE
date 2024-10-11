import { Link } from 'react-router-dom';
import { formatCreatedAt } from '../../utils/formatCreatedAt'; // 추가된 import

interface ThunderMeetingInfoProps {
  meeting: {
    id: string;
    title: string;
    date: string;
    payment_method_name?: string;
    age_group_name?: string;
    gender_group_name?: string;
    nickname?: string;
    profile_image_url?: string;
    created_at?: string;
    meeting_time?: string;
    description?: string;
    meeting_image_url?: string;
  };
  profileImageUrl: string | null;
}

const ThunderMeetingInfo = ({ meeting, profileImageUrl }: ThunderMeetingInfoProps) => {
  return (
    <>
      <h1 className="mb-4 text-xl font-bold">{meeting.title}</h1>

      {/* 모임 정보 */}
      <div className="mb-4 flex items-center text-sm text-gray-500">
        <div className="mr-2 rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
          {meeting.payment_method_name}
        </div>
        <div className="mr-2 rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
          {meeting.age_group_name}
        </div>
        <div className="mr-2 rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-black">
          {meeting.gender_group_name}
        </div>
      </div>

      {/* 작성자 정보 */}
      <div className="mb-4 flex items-center">
        <Link to={`/profile/${meeting.nickname}`}>
          <img
            src={profileImageUrl || meeting.profile_image_url || '/images/anonymous_avatars.svg'}
            alt="프로필 사진"
            className="mr-2 h-10 w-10 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = '/images/anonymous_avatars.svg';
            }}
          />
        </Link>
        <div>
          <div className="flex items-center">
            <Link to={`/profile/${meeting.nickname}`} className="text-sm font-medium">
              {meeting.nickname}
            </Link>
            <div className="ml-2 text-xs font-medium text-gray-500">
              {meeting.created_at ? formatCreatedAt(meeting.created_at) : ''}
            </div>{' '}
          </div>
        </div>
      </div>

      {/* 모임 일정 */}
      <div className="mb-4 flex h-full w-full items-center rounded-[11.5px] border-2 border-[#ffe7e2] text-sm text-gray-500">
        <img src="/images/ThunderCalender.svg" alt="캘린더" className="mr-[10px] h-[70px] w-[70px]" />
        <p className="ml-2 text-[14px] text-[#333333]">
          {meeting.meeting_time ? new Date(meeting.meeting_time).toLocaleString() : ''}
        </p>
      </div>

      {/* 모임 설명 */}
      <p className="mb-4 text-[#333333]">{meeting.description}</p>

      {/* 모임 이미지 */}
      {meeting.meeting_image_url && (
        <img
          src={meeting.meeting_image_url}
          alt="소셜다이닝 게시판 이미지"
          className="mb-4 mt-8 h-full w-full cursor-pointer rounded-lg object-cover"
        />
      )}
    </>
  );
};

export default ThunderMeetingInfo;
