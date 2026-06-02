import { BrowserRouter, Routes, Route } from "react-router-dom";
import AccountSettingsPage from "../pages/AccountSettings/AccountSettingsPage";
import FavoritesPage from "../pages/Favorites/FavoritesPage";
import HomePage from "../pages/Home/HomePage";
import MyPage from "../pages/MyPage/MyPage";
import SearchPage from "../pages/Search/SearchPage";
import ClubDetailPage from "../pages/Club/ClubDetailPage";
import HistoryPage from '../pages/Club/History/HistoryPage';
import ClubRegisterPage from '../pages/Club/ClubRegisterPage';
import ClubUpdatePage from '../pages/Club/ClubUpdatePage';

import TestPage from '../pages/TestPage';
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import FindAccountPage from "../pages/Auth/FindAccountPage";



export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />
        <Route path="/mypage/account" element={<AccountSettingsPage />} />
        <Route path="/mypage/favorites" element={<FavoritesPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path="/clubs/:clubId/history" element={<HistoryPage />} />
        <Route path="/club/register" element={<ClubRegisterPage />} />
        <Route path="/club/update/:clubId" element={<ClubUpdatePage />} />
      </Routes>
    </BrowserRouter>
  );
}