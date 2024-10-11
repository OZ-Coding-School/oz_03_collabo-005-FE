import { Link } from 'react-router-dom';

// Member 인터페이스 정의
interface Member {
  id: number;
  nickname: string;
  profile_image_url: string;
  introduction: string;
}

// ThunderIdCommentsProps 인터페이스 정의: 컴포넌트의 props 타입
interface ThunderIdCommentsProps {
  meetingMembers: Member[];
}

// ThunderIdComments 컴포넌트: 모임 멤버들의 정보를 표시
const ThunderIdComments: React.FC<ThunderIdCommentsProps> = ({ meetingMembers }) => {
  return (
    <>
      {/* 같이 드실 멤버 header 스타일 정의 */}
      <div className="mb-4 flex h-full items-center">
        <div className="text-sm font-bold">같이 드실 멤버</div>
      </div>

      {/* 멤버 목록 렌더링 */}
      {meetingMembers
        .sort((a, b) => a.id - b.id) // ID 기준으로 멤버 정렬
        .map((member) => (
          <div key={member.id} className="flex flex-col">
            <div className="flex">
              {/* 멤버 프로필 이미지 링크 */}
              <Link to={`/profile/${member.nickname}`}>
                <img
                  src={member.profile_image_url || '../images/anonymous_avatars.svg'}
                  alt="같이 드실 멤버 프로필 사진"
                  className="mr-2 h-10 w-10 rounded-full"
                  onError={(e) => {
                    // 이미지 로드 실패 시 기본 이미지로 대체
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = '../images/anonymous_avatars.svg';
                  }}
                />
              </Link>
              {/* 멤버 정보 표시 */}
              <div className="ml-1 flex flex-col">
                <Link to={`/profile/${member.nickname}`} className="text-black">
                  {member.nickname}
                </Link>
                <div className="text-xs text-gray-500">{member.introduction}</div>
              </div>
            </div>
            {/* member가 표시될때 간격 조정 위한 여백 추가 */}
            <div className="mb-8" />
          </div>
        ))}
    </>
  );
};

export default ThunderIdComments;
