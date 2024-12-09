const CACHE_NAME = 'babpiens-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/images/favicon.svg',
  '/images/manifest-icon-192.maskable.png',
  '/images/manifest-icon-512.maskable.png',
  'https://s3.ap-northeast-2.amazonaws.com/www.babpiens.com/Title/babpiens_title.png',
];

const HOSTNAME_WHITELIST = [
  self.location.hostname,
  'fonts.gstatic.com',
  'fonts.googleapis.com',
  'cdn.jsdelivr.net',
  's3.ap-northeast-2.amazonaws.com',
  'dapi.kakao.com',
  't1.kakaocdn.net',
  'connect.facebook.net',
  'www.googletagmanager.com',
];

// 서비스 워커 설치 시 정적 자원 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// 새로운 서비스 워커 활성화 시 이전 캐시 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  // Google Analytics 등 크로스 오리진 요청 건너뛰기
  if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) === -1) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시에 있으면 캐시된 응답 반환
      if (response) {
        return response;
      }

      // 캐시에 없으면 네트워크 요청
      return fetch(event.request)
        .then((response) => {
          // 유효한 응답이 아니면 그대로 반환
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 응답을 캐시에 저장하고 반환
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // 오프라인 및 이미지 요청인 경우 기본 이미지 제공
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
            return caches.match('/images/manifest-icon-192.maskable.png');
          }
        });
    }),
  );
});

// 푸시 알림 처리
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/images/manifest-icon-192.maskable.png',
      badge: '/images/manifest-icon-192.maskable.png',
    };

    event.waitUntil(self.registration.showNotification('밥피엔스', options));
  }
});

// 푸시 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('https://www.babpiens.com'));
});
