importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase 초기화
firebase.initializeApp({
  apiKey: 'your-api-key',
  projectId: 'your-project-id',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id'
});

const messaging = firebase.messaging();

// 백그라운드 메시지 처리 최적화
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] 백그라운드 메시지 수신:', payload);

  // 알림 옵션 설정
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
    badge: '/badge.png',
    tag: 'fcm-notification', // 동일한 태그의 알림은 업데이트됨
    requireInteraction: false, // 자동으로 닫히도록 설정
    data: payload.data
  };

  // 즉시 알림 표시
  return self.registration.showNotification(
    payload.notification.title,
    notificationOptions
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 알림 클릭:', event);
  
  event.notification.close();

  // 앱으로 이동
  const urlToOpen = new URL('/', self.location.origin).href;

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    // 이미 열린 창이 있는지 확인
    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i];
      if (client.url === urlToOpen && 'focus' in client) {
        return client.focus();
      }
    }
    // 열린 창이 없으면 새창 열기
    return clients.openWindow(urlToOpen);
  });

  event.waitUntil(promiseChain);
});

// Service Worker 활성화 즉시 처리
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});