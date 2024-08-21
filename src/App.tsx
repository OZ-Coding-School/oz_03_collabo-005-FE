import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.tsx';
import { Signin, Signup, ResetPassword } from './pages/auth';
import { Board, BoardId, BoardPost, BoardCommentEdit } from './pages/board';
import { Flavor, FlavorTest } from './pages/flavor';
import { Foods, FoodsId, FoodsMap } from './pages/foods';
import { Fti, FtiResultId, FtiTest } from './pages/fti';
import { MyProfile, MyProfileBoard, MyProfileEdit, MyProfileThunder } from './pages/myprofile';
import { Thunder, ThunderChat, ThunderId, ThunderPost } from './pages/thunder';
import Home from './pages/Home/Home.tsx';
import Landing from './pages/Home/Landing.tsx';
import ProfileId from './pages/profile/ProfileId.tsx';
import Terms from './pages/terms/Terms.tsx';
import ImageOverview from './pages/Image/ImageOverview.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route index element={<Landing />} />
        <Route path="signup" element={<Signup />} />

        <Route path="signin">
          <Route index element={<Signin />} />
          <Route path="resetpassword" element={<ResetPassword />} />
        </Route>

        <Route path="board">
          <Route index element={<Board />} />
          <Route path=":boardId" element={<BoardId />} />
          <Route path="boardpost" element={<BoardPost />} />
          <Route path="boardcommentedit" element={<BoardCommentEdit />} />
        </Route>

        <Route path="flavor">
          <Route index element={<Flavor />} />
          <Route path="test" element={<FlavorTest />} />
        </Route>

        <Route path="foods">
          <Route index element={<Foods />} />
          <Route path=":foodsId" element={<FoodsId />} />
          <Route path="map" element={<FoodsMap />} />
        </Route>

        <Route path="FTI">
          <Route index element={<Fti />} />
          <Route path="test" element={<FtiTest />} />
          <Route path=":resultId" element={<FtiResultId />} />
        </Route>

        <Route path="myprofile">
          <Route index element={<MyProfile />} />
          <Route path="myprofileboard" element={<MyProfileBoard />} />
          <Route path="myprofileedit" element={<MyProfileEdit />} />
          <Route path="myprofilethunder" element={<MyProfileThunder />} />
        </Route>

        <Route path="thunder">
          <Route index element={<Thunder />} />
          <Route path="thunderchat" element={<ThunderChat />} />
          <Route path=":thunderId" element={<ThunderId />} />
          <Route path="thunderpost" element={<ThunderPost />} />
        </Route>

        <Route path="terms" element={<Terms />} />

        <Route path="profile/:Id" element={<ProfileId />} />

        <Route path="image" element={<ImageOverview />} />
      </Route>
    </Routes>
  );
}

export default App;
