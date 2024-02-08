import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home"
import LoginForm from "@/pages/auth/LoginForm"
import RegisterForm from "@/pages/auth/RegisterForm"
import ResetPasswordForm from "@/pages/auth/ResetPasswordForm"
import Profile from "@/pages/profile"
import Discover from "@/pages/profile/Discover";
import ProfileDetail from "./pages/profile/ProfileDetail";
import Playlists from "./pages/profile/Playlists";

const App = () => (
  <div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<LoginForm/>} />
      <Route path="register" element={<RegisterForm/>} />
      <Route path="reset-password" element={<ResetPasswordForm/>} />
      <Route path="profile" element={<Profile />}>
        <Route index element={<Discover/>} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="detail/:musicId" element={<ProfileDetail />} />
      </Route>
    </Routes>
  </div>
);

export default App