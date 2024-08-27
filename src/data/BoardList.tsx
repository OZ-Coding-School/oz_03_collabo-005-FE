export const BoardList = [
  {
    id: 1,
    user_id: 101, // User 엔티티의 참조
    category: '맛집 추천',
    title: '길동역 앞 할머니 된장찌게 추천',
    description: '길동역 앞에서 할머니가 운영하는 된장찌개 맛집을 추천합니다. 정성 가득한 맛을 느껴보세요.',
    image_url: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1494173853739-c21f58b16055?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&auto=format&fit=crop&q=60',
    ], // 이미지 URL들
    hits: 35,
    created_at: '2024-08-16T12:00:00Z',
    updated_at: '2024-08-16T12:00:00Z',
    comments: [
      {
        id: 1,
        author: '김철수',
        content: '정말 동의해요! 최고의 BBQ!',
        created_at: '2024-08-17T05:30:00Z', // 한국시간 2024-08-17 14:30:00
      },
      {
        id: 2,
        author: '박영희',
        content: '이곳을 꼭 가보고 싶어요!',
        created_at: '2024-08-18T00:45:00Z', // 한국시간 2024-08-18 09:45:00
      },
    ],
    commentLength: 2,
  },
  {
    id: 2,
    user_id: 102, // User 엔티티의 참조
    category: '맛집 추천',
    title: '홍대 최고의 버거집',
    description: '홍대에서 가장 맛있는 버거를 맛볼 수 있는 곳을 소개합니다. 다양한 메뉴와 푸짐한 양이 일품입니다.',
    image_url: [
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=60',
    ], // 이미지 URL들
    hits: 50,
    created_at: '2024-08-17T14:00:00Z',
    updated_at: '2024-08-17T14:00:00Z',
    comments: [
      {
        id: 1,
        author: '최민수',
        content: '정말 재미있어 보여요! 다음번에 꼭 참여할게요!',
        created_at: '2024-08-15T02:15:00Z', // 한국시간 2024-08-15 11:15:00
      },
    ],
    commentLength: 1,
  },
  {
    id: 3,
    user_id: 103, // User 엔티티의 참조
    category: '소셜 다이닝 후기',
    title: '이태원에서 꼭 가봐야 할 카페',
    description: '이태원에서 분위기 좋은 카페를 찾고 있다면 이곳을 추천합니다. 커피와 디저트가 훌륭합니다.',
    image_url: [
      'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=60',
    ], // 이미지 URL들
    hits: 45,
    created_at: '2024-08-18T16:00:00Z',
    updated_at: '2024-08-18T16:00:00Z',
    comments: [
      {
        id: 1,
        author: '이준호',
        content: '다음 여행 때 꼭 가봐야겠어요!',
        created_at: '2024-08-19T06:25:00Z', // 한국시간 2024-08-19 15:25:00
      },
      {
        id: 2,
        author: '박수진',
        content: '내 인생 최고의 초밥이었어요!',
        created_at: '2024-08-19T09:40:00Z', // 한국시간 2024-08-19 18:40:00
      },
    ],
    commentLength: 2,
  },
  {
    id: 4,
    user_id: 104, // User 엔티티의 참조
    category: '맛집 추천',
    title: '강남 최고의 스시집',
    description:
      '강남에서 신선한 스시를 맛볼 수 있는 최고의 스시집을 소개합니다. 다양한 스시 메뉴가 준비되어 있습니다.',
    image_url: [
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=60',
    ], // 이미지 URL들
    hits: 60,
    created_at: '2024-08-19T18:00:00Z',
    updated_at: '2024-08-19T18:00:00Z',
    comments: [
      {
        id: 1,
        author: '한지훈',
        content: '음식도 맛있었고, 함께한 사람들도 정말 좋았어요!',
        created_at: '2024-08-18T11:30:00Z', // 한국시간 2024-08-18 20:30:00
      },
    ],
    commentLength: 1,
  },
  {
    id: 5,
    user_id: 105, // User 엔티티의 참조
    category: '소셜다이닝 후기',
    title: '종로에서 맛보는 전통 한식',
    description: '종로에서 전통 한식을 맛볼 수 있는 곳을 소개합니다. 정갈한 한식 메뉴가 일품입니다.',
    image_url: [
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&auto=format&fit=crop&q=60',
    ], // 한식 이미지
    hits: 70,
    created_at: '2024-08-20T20:00:00Z',
    updated_at: '2024-08-20T20:00:00Z',
    comments: [
      {
        id: 1,
        author: '최수민',
        content: '종로에 갈 때마다 꼭 가는 곳이에요!',
        created_at: '2024-08-20T03:30:00Z', // 한국시간 2024-08-20 12:30:00
      },
      {
        id: 2,
        author: '김성훈',
        content: '이 한식은 정말 잊을 수 없어요!',
        created_at: '2024-08-20T05:10:00Z', // 한국시간 2024-08-20 14:10:00
      },
    ],
    commentLength: 2,
  },
];
