export const shareWeb = (realUrl: string) => {
  if (navigator.share) {
    navigator
      .share({
        title: 'FTI검사 너도 받아볼래?',
        text: 'FTI검사하고 음식 추천까지! 완전 럭키비키잖아~🍀',
        url: realUrl,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  } else {
    alert('Web Share API is not supported in your browser.');
  }
};

export const shareKakao = (Kakao: any, url: string, imageUrl: string) => {
  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: 'FTI검사 너도 받아볼래?',
      description: 'FTI검사하고 음식 추천까지! 완전 럭키비키잖아~🍀',
      imageUrl: `https://${imageUrl}`,
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [
      {
        title: '나도 테스트 하러가기',
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    ],
  });
};
