import { BrowserRouter, Routes, Route } from "react-router-dom";
import AccountSettingsPage from "../pages/AccountSettings/AccountSettingsPage";
import FavoritesPage from "../pages/Favorites/FavoritesPage";
import HomePage from "../pages/Home/HomePage";
import MyPage from "../pages/MyPage/MyPage";
import MyReviewsPage from "../pages/MyReviews/MyReviewsPage";
import SearchPage from "../pages/Search/SearchPage";
import HistoryPage from '../pages/Club/History/HistoryPage';
import ClubDetailPage from "../pages/Club/ClubDetail/ClubDetailPage";
import ClubRegisterPage from '../pages/Club/ClubManage/ClubRegisterPage';
import ClubUpdatePage from '../pages/Club/ClubManage/ClubUpdatePage';
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
        <Route path="/mypage/reviews" element={<MyReviewsPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* 동아리 관련 경로들 */}
        <Route path="/clubs/:clubId/history" element={<HistoryPage />} />
        <Route path="/club/:clubId" element={<ClubDetailPage />} />
        <Route path="/club/register" element={<ClubRegisterPage />} />
        <Route path="/club/update/:clubId" element={<ClubUpdatePage />} />
      </Routes>
    </BrowserRouter>
  );
}