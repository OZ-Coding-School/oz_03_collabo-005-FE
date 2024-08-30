import { useEffect, useRef, useState } from 'react';
import ProgressBar from '../../components/flavor/ProgressBar';
import ModalCenter from '../../components/common/ModalCenter';
import { Link } from 'react-router-dom';
import { authInstance } from '../../api/util/instance';
import Loading from '../../components/common/Loading';

interface Answer {
  id: number;
  taste_answer: string;
  taste_score: number;
  taste_question: number;
}

interface FlavorTest {
  question: {
    id: number;
    taste_question: string;
    taste_question_category: string;
    taste_question_image: string;
  };
  answers: Answer[];
}

const FlavorTest = () => {
  const resultAnswer = useRef<Record<string, number>>({});
  const [testOrder, setTestOrder] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [flavorTests, setFlavorTests] = useState<FlavorTest[]>([]);
  const [isModalCenterOpen, setIsModalCenterOpen] = useState(false);
  const openModalCenter = () => setIsModalCenterOpen(true);
  const closeModalCenter = () => setIsModalCenterOpen(false);
  const currentTest = flavorTests[testOrder];
  const widthPercentage = ((testOrder + 1) / flavorTests.length) * 100;

  useEffect(() => {
    const fetchFlavorTests = async () => {
      try {
        const response = await authInstance.get('/api/tasets/questions_list/');
        console.log(response.data);
        setFlavorTests(response.data);
      } catch (error) {
        console.error('Failed to fetch flavor tests:', error);
      }
    };
    fetchFlavorTests();
  }, []);

  const handleAnswerClick = (answer: Answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextClick = async () => {
    if (selectedAnswer) {
      const currentTest = flavorTests[testOrder];
      const category = currentTest.question.taste_question_category;
      const score = selectedAnswer.taste_score;
      resultAnswer.current[category] = score;
      if (testOrder < flavorTests.length - 1) {
        setTestOrder((prev) => prev + 1);
        setSelectedAnswer(null);
        document.getElementById('root')?.scrollTo(0, 0);
      } else {
        console.log(resultAnswer.current);
        const answer = resultAnswer.current;
        // api 주소 오타있음. 수정 요청 부탁 드렸음
        authInstance.post('/api/tasets/taste_result/', answer);
        openModalCenter();
      }
    }
  };

  if (flavorTests.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <ProgressBar widthPercentage={widthPercentage} />
      <div className="mt-10 flex flex-col items-center justify-center">
        <p className="mx-4 text-center text-[24px] font-bold xs:text-[20px]">{currentTest.question.taste_question}</p>
        <img
          src={currentTest.question.taste_question_image}
          className="h-[285px] w-[285px] xs:h-[250px] xs:w-[250px]"
          alt="Question Image"
        />
        {currentTest.answers.map((item) => (
          <button
            key={item.id}
            className={`my-2 flex h-[52px] w-[90%] transform items-center justify-center rounded-lg border font-medium text-[#333333] ${
              selectedAnswer?.id === item.id
                ? 'border-orange-500 bg-[#fcf6f4] font-semibold shadow-lg'
                : 'border-[#d7d7d7] bg-white'
            } text-[18px] transition-all duration-300 ease-in-out active:scale-95 xs:h-[42px] xs:text-[15px]`}
            onClick={() => handleAnswerClick(item)}>
            {item.taste_answer}
          </button>
        ))}
        <button
          className={`my-4 flex h-[52px] w-[90%] items-center justify-center rounded-lg bg-orange-500 text-[18px] font-bold text-white transition-transform duration-200 ease-in-out hover:bg-orange-600 ${
            !selectedAnswer ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={handleNextClick}
          disabled={!selectedAnswer}>
          다음
        </button>
      </div>
      <p className="my-10 w-full text-center text-[#999999]">{`${testOrder + 1}/${flavorTests.length}`}</p>
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
