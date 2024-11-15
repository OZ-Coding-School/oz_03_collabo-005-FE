import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface FtiResult {
  // FTI 결과 타입 정의
  // 예: id: string, result: string 등
}

const FtiShareId: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [ftiResult, setFtiResult] = useState<FtiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFtiResult = async () => {
      try {
        const response = await axios.get(`/api/ftitests/result/${uuid}`);
        setFtiResult(response.data);
      } catch (err) {
        setError('FTI 결과를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchFtiResult();
  }, [uuid]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!ftiResult) return <div>결과를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h1>FTI 결과</h1>
      {/* ftiResult를 사용하여 결과 표시 */}
      <pre>{JSON.stringify(ftiResult, null, 2)}</pre>
    </div>
  );
};

export default FtiShareId;
