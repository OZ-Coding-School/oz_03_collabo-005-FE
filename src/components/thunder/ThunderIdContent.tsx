import ContentLoader from 'react-content-loader';

interface ThunderIdContentProps {
  selectedMeeting: {
    meeting_time: string;
    description: string;
    meeting_image_url?: string;
  };
  isImageLoaded: boolean;
  setIsImageLoaded: (loaded: boolean) => void;
  openThunderImageModal: () => void;
}

const ThunderIdContent: React.FC<ThunderIdContentProps> = ({
  selectedMeeting,
  isImageLoaded,
  setIsImageLoaded,
  openThunderImageModal,
}) => {
  return (
    <>
      {/* 모임 일정 */}
      <div className="mb-4 flex h-full w-full items-center rounded-[11.5px] border-2 border-[#ffe7e2] text-sm text-gray-500">
        <img src="../images/ThunderCalender.svg" alt="캘린더" className="mr-[10px] h-[70px] w-[70px]" />
        <p className="ml-2 text-[14px] text-[#333333]">{new Date(selectedMeeting.meeting_time).toLocaleString()}</p>
      </div>
      {/* 모임 설명 */}
      <p className="mb-4 text-[#333333]">{selectedMeeting.description}</p>
      {/* <hr className="mb-5 mt-5 border border-gray-200" /> */}
      {/* 이미지 불러올 때  content-loader 표시*/}
      {selectedMeeting.meeting_image_url && !isImageLoaded && (
        <ContentLoader height={200} width={300} speed={2} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
          <rect x="0" y="56" rx="3" ry="3" width="300" height="10" />
          <rect x="0" y="72" rx="3" ry="3" width="200" height="10" />
          <rect x="0" y="88" rx="3" ry="3" width="100" height="10" />
        </ContentLoader>
      )}
      {/* 이미지 불러오기 완료 후 나오는 이미지 경로 */}
      {selectedMeeting.meeting_image_url && (
        <img
          src={selectedMeeting.meeting_image_url}
          alt="소셜다이닝 게시판 이미지"
          className={`mb-4 mt-8 h-full w-full cursor-pointer rounded-lg object-cover ${isImageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setIsImageLoaded(true)}
          onClick={() => openThunderImageModal()}
        />
      )}
    </>
  );
};

export default ThunderIdContent;
