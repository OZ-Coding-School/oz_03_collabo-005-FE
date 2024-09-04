import { useEffect, useState } from 'react';
import { getFtiQuestions } from '../../api/apis/fti';
import { formatQuestion } from '../../api/services/ftiService';
import ftiAnswer from '../../data/ftiAnswer.json';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/flavor/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { sendFtiResult } from '../../api/apis/fti';

const FtiTest = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers] = useState(ftiAnswer); // setAnswers 사용되지 않으므로 제거
  const [number, setNumber] = useState<number>(0);
  const [results, setResults] = useState<string[]>([]); // 각 답변의 result를 저장할 배열
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // 제출 상태 추가
  const widthPercentage = ((number + 1) / questions.length) * 100;
  const navigate = useNavigate();

  const getQuestion = async () => {
    try {
      const data = await getFtiQuestions();
      const formattedData = formatQuestion(data);
      setQuestions(formattedData);
    } catch (error) {
      console.error('Failed to get FTI questions:', error);
      return [];
    }
  };

  useEffect(() => {
    getQuestion();
  }, []);

  const handleAnswer = (result: string) => {
    console.log('Selected result:', result); // 각 답변의 result 출력
    setResults((prevResults) => {
      const newResults = [...prevResults, result];
      if (number < questions.length - 1) {
        setNumber(number + 1);
      } else {
        calculateResult(newResults);
      }
      return newResults;
    });
  };

  const calculateResult = async (finalResults: string[]) => {
    console.log('All results:', finalResults);
    setIsSubmitting(true); // 제출 시작
    try {
      const ftiResult = await sendFtiResult(finalResults);
      console.log('Result ID:', ftiResult); // resultId.uuid로 FTI 결과 ID 출력
      console.log(ftiResult.description);
      navigate(`/fti/${ftiResult.uuid}`, { state: { ftiType: ftiResult.fti_type, uuid: ftiResult.uuid } }); // ftiType과 uuid를 state로 전달
    } catch (error) {
      console.error('Failed to send FTI result:', error);
      setIsSubmitting(true); // 제출 실패 시 다시 활성화
    }
  };
  return (
    <div className="flex flex-col items-center">
      <ProgressBar widthPercentage={widthPercentage} />

      {questions.length > 0 && <div className="mb-[12px] mt-[60px] text-[24px]">{questions[number]}</div>}

      <img src="/images/ftiStart.png" alt="" />
      <div className="mt-[36px] w-full px-[16px]">
        {answers
          .filter((answer) => answer.number === (number + 1).toString()) // number를 1부터 시작하는 문자열로 변환
          .map((answer, answerIndex) => (
            <div key={answerIndex}>
              {answer.answerA && (
                <Button
                  buttonSize="normal"
                  bgColor="black"
                  className="h-[48px]"
                  onClick={() => handleAnswer(answer.result)}
                  disabled={isSubmitting} // 제출 중일 때 버튼 비활성화
                >
                  {answer.answerA}
                </Button>
              )}
              {answer.answerB && (
                <Button
                  buttonSize="normal"
                  bgColor="black"
                  className="mt-[12px] h-[48px]"
                  onClick={() => handleAnswer(answer.result)}
                  disabled={isSubmitting} // 제출 중일 때 버튼 비활성화
                >
                  {answer.answerB}
                </Button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default FtiTest;
