import { useRef, useState } from 'react';
// import axios from 'axios';
import { flavorTest } from '../../data/flavorTest';
import ProgressBar from '../../components/flavor/ProgressBar';
import ModalCenter from '../../components/common/ModalCenter';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../store/store';

interface Answer {
  answer: string;
  score: number;
}

interface FlavorTest {
  question: string;
  category: string;
  answers: Answer[];
}

const FlavorTest = () => {
  const resultAnswer = useRef<{ category: string; score: number }[]>([]);
  const [testOrder, setTestOrder] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const curruntTest: FlavorTest = flavorTest[testOrder];
  const widthPercentage = ((testOrder + 1) / flavorTest.length) * 100;

  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);
  const openModalCenter = () => setIsModalCenterOpen(true);
  const closeModalCenter = () => setIsModalCenterOpen(false);

  const { setUser } = useUserStore();

  const handleAnswerClick = (answer: Answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextClick = async () => {
    if (selectedAnswer) {
      resultAnswer.current.push({ category: curruntTest.category, score: selectedAnswer.score });
      if (testOrder < flavorTest.length - 1) {
        setTestOrder((prev) => prev + 1);
        setSelectedAnswer(null);
        document.getElementById('root')?.scrollTo(0, 0);
      } else {
        // // 마지막 질문에 도달했을 때 서버에 데이터 전송 + 헤더에 토큰
        // try {
        //   const response = await axios.post('/api/submit-flavor-test', resultAnswer.current, {
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   });
        //   if (response.status === 200) {
        //     // 서버 응답이 성공적일 때 모달 오픈
        //     openModalCenter();
        //   } else {
        //     console.error('서버 오류:', response.statusText);
        //   }
        // } catch (error) {
        //   console.error('네트워크 오류:', error);
        // }
        console.log(resultAnswer.current);
        openModalCenter();
        // 화면 잘 바뀌는지 테스트
        setUser({
          id: 1,
          profileImageUrl:
            'https://plus.unsplash.com/premium_photo-1664203067979-47448934fd97?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHx8fDA%3D',
          nickname: '족발러버',
          introduce: '족발러버입니다. 잘 부탁드려요~!',
          ftiType: '고독한 미식가(AIN)',
          spicy_preference: 1,
        });
      }
    }
  };

  return (
    <>
      <ProgressBar widthPercentage={widthPercentage} />
      <div className="mt-10 flex flex-col items-center justify-center">
        <p className="mx-4 text-center text-[24px] font-bold xs:text-[20px]">{curruntTest.question}</p>
        <img src="/images/openMouseEgg.svg" className="h-[285px] w-[285px] xs:h-[250px] xs:w-[250px]" alt="Egg Image" />
        {curruntTest.answers.map((item) => {
          return (
            <button
              key={item.score}
              className={`my-2 flex h-[52px] w-[90%] transform items-center justify-center rounded-lg border font-medium text-[#333333] ${
                selectedAnswer?.score === item.score
                  ? 'border-orange-500 bg-[#fcf6f4] font-semibold shadow-lg'
                  : 'border-[#d7d7d7] bg-white'
              } text-[18px] transition-all duration-300 ease-in-out active:scale-95 xs:h-[42px] xs:text-[15px]`}
              onClick={() => handleAnswerClick(item)}>
              {item.answer}
            </button>
          );
        })}
        <button
          className={`my-4 flex h-[52px] w-[90%] items-center justify-center rounded-lg bg-orange-500 text-[18px] font-bold text-white transition-transform duration-200 ease-in-out hover:bg-orange-600 ${
            !selectedAnswer ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={handleNextClick}
          disabled={!selectedAnswer}>
          다음
        </button>
      </div>
      <p className="my-10 w-full text-center text-[#999999]">{`${testOrder + 1}/${flavorTest.length}`}</p>
      <ModalCenter
        isOpen={isModalCenterOpen}
        onClose={closeModalCenter}
        title1="미각 DNA 검사가"
        title2="완료되었습니다">
        <div className="mt-8 flex w-full space-x-4">
          <Link to="/" className="flex-1">
            <button className="w-full rounded-xl bg-orange-500 px-2 py-3 font-semibold text-white transition-colors duration-200 ease-in-out hover:bg-orange-600">
              홈에서 음식 추천받기
            </button>
          </Link>
        </div>
      </ModalCenter>
    </>
  );
};

export default FlavorTest;
