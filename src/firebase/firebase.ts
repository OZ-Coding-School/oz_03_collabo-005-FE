import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Service Worker 등록 최적화
const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
      updateViaCache: 'none', // 항상 최신 버전 사용
    });
    console.log('Service Worker 등록 성공:', registration.scope);
    return registration;
  } catch (err) {
    console.error('Service Worker 등록 실패:', err);
    throw err;
  }
};

// FCM 토큰 발급 최적화
export const getFCMToken = async () => {
  try {
    // Service Worker 등록 확인
    await registerServiceWorker();

    // 알림 권한 요청
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('알림 권한이 필요합니다.');
    }

    // 토큰 발급
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });

    if (!currentToken) {
      throw new Error('토큰을 받아올 수 없습니다.');
    }

    return currentToken;
  } catch (error) {
    console.error('FCM 토큰 발급 실패:', error);
    throw error;
  }
};

// 포그라운드 메시지 처리 최적화
onMessage(messaging, (payload) => {
  console.log('[App] 포그라운드 메시지 수신:', payload);

  // 포그라운드 알림 표시
  if (Notification.permission === 'granted' && payload.notification) {
    new Notification(payload.notification.title ?? '새 알림', {
      body: payload.notification.body ?? '',
      icon: '/icon.png',
      tag: 'fcm-notification',
      requireInteraction: false,
    });
  }
});
