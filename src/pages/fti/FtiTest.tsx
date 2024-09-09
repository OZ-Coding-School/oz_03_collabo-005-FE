import { useEffect, useState } from 'react';
import { getFtiQuestions } from '../../api/apis/fti';
import { formatQuestion, formatQuestionImage } from '../../api/services/ftiService';
import ftiAnswer from '../../data/ftiAnswer.json';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/flavor/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { sendFtiResult } from '../../api/apis/fti';
import { localsetItem } from '../../utils/storage';

const FtiTest = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [answers] = useState(ftiAnswer);
  const [number, setNumber] = useState<number>(0);
  const [results, setResults] = useState<string[]>([]); // 각 답변의 result를 저장할 배열
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // 제출 상태 추가
  const widthPercentage = ((number + 1) / questions.length) * 100;
  const navigate = useNavigate();

  const getQuestion = async () => {
    try {
      const data = await getFtiQuestions();
      const formattedData = formatQuestion(data);
      const formattedImages = formatQuestionImage(data);
      setQuestions(formattedData);
      setImages(formattedImages);
    } catch (error) {
      console.error('Failed to get FTI questions:', error);
      return [];
    }
  };

  useEffect(() => {
    console.log(results);
    getQuestion();
  }, []);

  const handleAnswer = (result: string) => {
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

  const parseDescription = (desc: string) => {
    const sections = desc.split(/\n\n/);
    const result: { [key: string]: string }[] = [];

    sections.forEach((section) => {
      const match = section.match(/^\(([^)]+)\)\n([\s\S]*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        result.push({ [key]: value });
      }
    });

    return result;
  };

  const calculateResult = async (finalResults: string[]) => {
    setIsSubmitting(true);
    try {
      const ftiResult = await sendFtiResult(finalResults);
      localsetItem('FtiResults', JSON.stringify(finalResults));
      const description = parseDescription(ftiResult.description);
      navigate(`/fti/${ftiResult.uuid}`, {
        state: {
          ftiType: ftiResult.fti_type,
          uuid: ftiResult.uuid,
          ftiImage: ftiResult.fti_image,
          description: description,
        },
      }); // ftiType과 uuid를 state로 전달
    } catch (error) {
      console.error('Failed to send FTI result:', error);
      setIsSubmitting(true); // 제출 실패 시 다시 활성화
    }
  };
  return (
    <div className="flex flex-col items-center">
      <ProgressBar widthPercentage={widthPercentage} />

      {questions.length > 0 && (
        <div className="mb-[12px] mt-[60px] text-[24px] xs:text-[20px]">{questions[number]}</div>
      )}
      {images.length > 0 && (
        <img className="mb-[12px] w-[320px] xs:w-[240px]" src={`/${images[number]}`} alt="FTI Image" />
      )}

      <div className="mt-[36px] w-full px-[16px]">
        {answers
          .filter((answer) => answer.number === (number + 1).toString()) // number를 1부터 시작하는 문자열로 변환
          .map((answer, answerIndex) => (
            <div key={answerIndex}>
              {answer.answerA && (
                <Button
                  buttonSize="normal"
                  bgColor="black"
                  className="h-[48px] xs:text-[14px]"
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
                  className="mt-[12px] h-[48px] xs:text-[14px]"
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
