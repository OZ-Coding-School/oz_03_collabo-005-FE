import { baseInstance, authInstance } from '../util/instance';

// FE: Thunder - BE: Meeting 정보를 가져오는 함수
export const fetchMeeting = async (meetingId: string) => {
  const response = await baseInstance.get(`/api/meetings/${meetingId}`);
  return response.data;
};

// 좋아요 상태 가져오기
export const fetchLikeStatus = async (meetingId: string) => {
  const response = await authInstance.get(`/api/meetings/${meetingId}`);
  return response.data;
};

// 프로필 이미지 가져오기
export const fetchProfileImage = async (nickname: string) => {
  const response = await baseInstance.get(`/api/profile/${nickname}/`);
  return response.data.profile_image_url;
};

// 참여 취소
export const deleteParticipation = async (meetingId: string) => {
  await authInstance.post(`/api/meetings/member/delete/`, { meeting_uuid: meetingId });
};

// 좋아요 토글
export const toggleLikeApi = async (meetingId: string, isLiked: boolean) => {
  if (isLiked) {
    await authInstance.post(`/api/likes/delete/`, { uuid: meetingId });
  } else {
    await authInstance.post(`/api/likes/`, { uuid: meetingId });
  }
};

// FE: Thunder - BE: Meeting 삭제하는 함수
export const deleteMeeting = async (meetingId: string) => {
  await authInstance.post(`/api/meetings/delete/`, { meeting_uuid: meetingId });
};

// API 함수들을 객체로 묶어서 내보내기
const thunderIdApi = {
  fetchMeeting,
  fetchLikeStatus,
  fetchProfileImage,
  deleteParticipation,
  toggleLikeApi,
  deleteMeeting,
};

export default thunderIdApi;
