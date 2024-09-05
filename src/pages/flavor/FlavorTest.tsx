import { useEffect, useRef, useState } from 'react';
import ProgressBar from '../../components/flavor/ProgressBar';
import ModalCenter from '../../components/common/ModalCenter';
import { Link, useNavigate } from 'react-router-dom';
import { authInstance } from '../../api/util/instance';
import Loading from '../../components/common/Loading';
import { getCookie } from '../../utils/cookie';

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
  const navigate = useNavigate();

  useEffect(() => {
    if (!getCookie('refresh')) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const fetchFlavorTests = async () => {
      try {
        const response = await authInstance.get('/api/tastes/questions_list/');
        setFlavorTests(response.data);
      } catch (error) {
        console.error('Failed to fetch flavor tests:', error);
      }
    };
    fetchFlavorTests();
  }, []);

  const handleAnswerClick = (answer: Answer) => {
    setSelectedAnswer(answer);
    handleNextClick(answer);
  };

  const handleNextClick = async (answer: Answer) => {
    if (selectedAnswer || answer) {
      const currentTest = flavorTests[testOrder];
      const category = currentTest.question.taste_question_category;
      const score = (selectedAnswer || answer).taste_score;
      resultAnswer.current[category] = score;
      if (testOrder < flavorTests.length - 1) {
        setTestOrder((prev) => prev + 1);
        setSelectedAnswer(null);
        document.getElementById('root')?.scrollTo(0, 0);
      } else {
        const finalAnswer = resultAnswer.current;
        authInstance.post('/api/tastes/taste_result/', finalAnswer);
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
      <div className="mt-5 flex flex-col items-center justify-center">
        <p className="mx-4 text-center text-[24px] font-bold xs:text-[18px]">{currentTest.question.taste_question}</p>
        <img
          src={`/${currentTest.question.taste_question_image}`}
          className="my-10 h-[285px] w-[285px] xs:my-5 xs:h-[200px] xs:w-[200px]"
          alt="Question Image"
        />
        {currentTest.answers.map((item) => (
          <button
            key={item.id}
            className={`my-[6px] flex h-[52px] w-[90%] transform items-center justify-center rounded-lg border text-[18px] font-medium text-[#333333] duration-300 ease-in-out active:scale-95 xs:h-[40px] xs:text-[14px]`}
            onClick={() => handleAnswerClick(item)}>
            {item.taste_answer}
          </button>
        ))}
      </div>
      <ModalCenter
        isOpen={isModalCenterOpen}
        onClose={closeModalCenter}
        title1="미각 DNA 검사가"
        title2="완료되었습니다">
        <div className="mt-8">
          <Link to="/" className="w-full">
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
