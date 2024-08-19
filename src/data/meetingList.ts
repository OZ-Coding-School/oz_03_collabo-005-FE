export const meetingList = [
  {
    id: 1,
    user_id: 101, // User 엔티티의 참조
    title: '주간 음식 애호가 모임',
    location_id: '강동, 하남', // 위치 정보
    payment_method: '제가쏩니다', // 결제 방식
    age_group: '20대', // 연령대
    gender_group: '이성', // 젠더 그룹
    appointment_time: '2024-08-20T18:30:00Z', // 약속 시간
    description:
      '음식을 사랑하는 사람들이 최신 음식 트렌드에 대해 논의하고 리뷰하는 모임입니다.음식을 사랑하는 사람들이 최신 음식 트렌드에 대해 논의하고 리뷰하는 모임입니다.음식을 사랑하는 사람들이 최신 음식 트렌드에 대해 논의하고 리뷰하는 모임입니다.음식을 사랑하는 사람들이 최신 음식 트렌드에 대해 논의하고 리뷰하는 모임입니다.',
    image_url:
      'https://plus.unsplash.com/premium_photo-1663850684986-b9d15f1de6bc?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8JUVDJTlEJThDJUVDJThCJTlEJUVDJTgyJUFDJUVDJUE3JTg0fGVufDB8fDB8fHww', // 이미지 URL
    hits: 35,
    created_at: '2024-08-16T12:00:00Z',
    updated_at: '2024-08-16T12:00:00Z',
  },
  {
    id: 2,
    user_id: 102, // User 엔티티의 참조
    title: '월간 맛집 탐방 모임',
    location_id: '강동, 송파', // 위치 정보
    payment_method: '더치페이', // 결제 방식
    age_group: '30대', // 연령대
    gender_group: '상관없음', // 젠더 그룹
    appointment_time: '2024-09-05T19:00:00Z', // 약속 시간
    description: '지역의 숨은 맛집을 탐방하고 리뷰하는 월간 모임입니다.',
    image_url:
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fCVFQyU5RCU4QyVFQyU4QiU5RCVFQyU4MiVBQyVFQyVBNyU4NHxlbnwwfHwwfHx8MA%3D%3D', // 이미지 URL
    hits: 52,
    created_at: '2024-08-16T14:00:00Z',
    updated_at: '2024-08-16T14:00:00Z',
  },
  {
    id: 3,
    user_id: 103, // User 엔티티의 참조
    title: '비건 식단 체험 모임',
    location_id: '마포, 연남동', // 위치 정보
    payment_method: '더치페이', // 결제 방식
    age_group: '40대', // 연령대
    gender_group: '동성', // 젠더 그룹
    appointment_time: '2024-08-25T16:00:00Z', // 약속 시간
    description: '비건 식단을 체험하고 관련 요리를 함께 만드는 모임입니다.',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60', // 이미지 URL
    hits: 40,
    created_at: '2024-08-16T15:00:00Z',
    updated_at: '2024-08-16T15:00:00Z',
  },
  {
    id: 4,
    user_id: 104, // User 엔티티의 참조
    title: '주말 브런치 모임',
    location_id: '이태원, 한남동', // 위치 정보
    payment_method: '제가쏩니다', // 결제 방식
    age_group: '상관없음', // 연령대
    gender_group: '상관없음', // 젠더 그룹
    appointment_time: '2024-08-27T10:00:00Z', // 약속 시간
    description: '편안한 주말 아침, 함께 브런치를 즐기며 이야기 나누는 모임입니다.',
    hits: 60,
    created_at: '2024-08-16T16:00:00Z',
    updated_at: '2024-08-16T16:00:00Z',
  },
  {
    id: 5,
    user_id: 105, // User 엔티티의 참조
    title: '스시 마스터 클래스',
    location_id: '강남, 청담동', // 위치 정보
    payment_method: '제가쏩니다', // 결제 방식
    age_group: '30대', // 연령대
    gender_group: '이성', // 젠더 그룹
    appointment_time: '2024-09-01T18:00:00Z', // 약속 시간
    description: '전문 스시 셰프와 함께하는 스시 만들기 클래스입니다.',
    hits: 85,
    created_at: '2024-08-16T17:00:00Z',
    updated_at: '2024-08-16T17:00:00Z',
  },
  {
    id: 6,
    user_id: 106, // User 엔티티의 참조
    title: '디저트 애호가 모임',
    location_id: '홍대, 상수동', // 위치 정보
    payment_method: '더치페이', // 결제 방식
    age_group: '20대', // 연령대
    gender_group: '동성', // 젠더 그룹
    appointment_time: '2024-09-10T14:30:00Z', // 약속 시간
    description: '다양한 디저트를 함께 만들고 시식하는 모임입니다.',
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&auto=format&fit=crop&q=60', // 이미지 URL
    hits: 72,
    created_at: '2024-08-16T18:00:00Z',
    updated_at: '2024-08-16T18:00:00Z',
  },
  {
    id: 7,
    user_id: 107, // User 엔티티의 참조
    title: '프리미엄 와인 시음회',
    location_id: '종로, 삼청동', // 위치 정보
    payment_method: '제가쏩니다', // 결제 방식
    age_group: '40대', // 연령대
    gender_group: '이성', // 젠더 그룹
    appointment_time: '2024-09-15T19:00:00Z', // 약속 시간
    description: '세계 각국의 프리미엄 와인을 시음하며 즐기는 모임입니다.',
    hits: 90,
    created_at: '2024-08-16T19:00:00Z',
    updated_at: '2024-08-16T19:00:00Z',
  },
  {
    id: 8,
    user_id: 108, // User 엔티티의 참조
    title: '채식주의자 모임',
    location_id: '건대, 화양동', // 위치 정보
    payment_method: '더치페이', // 결제 방식
    age_group: '30대', // 연령대
    gender_group: '상관없음', // 젠더 그룹
    appointment_time: '2024-09-20T11:00:00Z', // 약속 시간
    description: '채식주의자들을 위한 정보 교류와 요리 체험 모임입니다.',
    hits: 45,
    created_at: '2024-08-16T20:00:00Z',
    updated_at: '2024-08-16T20:00:00Z',
  },
  {
    id: 9,
    user_id: 109, // User 엔티티의 참조
    title: '독서 토론 모임',
    location_id: '서초, 반포동', // 위치 정보
    payment_method: '제가쏩니다', // 결제 방식
    age_group: '상관없음', // 연령대
    gender_group: '동성', // 젠더 그룹
    appointment_time: '2024-09-25T17:00:00Z', // 약속 시간
    description: '매달 새로운 책을 읽고 함께 토론하는 독서 모임입니다.',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=60', // 이미지 URL
    hits: 58,
    created_at: '2024-08-16T21:00:00Z',
    updated_at: '2024-08-16T21:00:00Z',
  },
  {
    id: 10,
    user_id: 110, // User 엔티티의 참조
    title: '인문학 강의 모임',
    location_id: '광화문, 종로', // 위치 정보
    payment_method: '더치페이', // 결제 방식
    age_group: '40대', // 연령대
    gender_group: '이성', // 젠더 그룹
    appointment_time: '2024-09-30T14:00:00Z', // 약속 시간
    description: '인문학 주제로 강의를 듣고 토론하는 모임입니다.',
    image_url: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=400&auto=format&fit=crop&q=60', // 이미지 URL
    hits: 67,
    created_at: '2024-08-16T22:00:00Z',
    updated_at: '2024-08-16T22:00:00Z',
  },
];
