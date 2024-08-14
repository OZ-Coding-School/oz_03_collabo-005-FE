const MyProfileBoard = () => {
  // 유저 확인해서 로그인 안되어있으면 redirect 아래는 토큰을 확인해야 하는 경우
  //  useEffect(() => {
  //    const token = localStorage.getItem('token');
  //    if (!token) {
  //      navigate('/login');
  //    } else {
  //      axios
  //        .get('/api/validateToken', { headers: { Authorization: `Bearer ${token}` } })
  //        .then((response) => {
  //          if (!response.data.valid) {
  //            navigate('/login');
  //          }
  //        })
  //        .catch((error) => {
  //          console.error('Token validation failed', error);
  //          navigate('/login');
  //        });
  //    }
  //  }, [navigate]);
  return <div>MyProfileBoard</div>;
};

export default MyProfileBoard;
