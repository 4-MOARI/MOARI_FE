import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AccountSettingsPage from "../pages/AccountSettings/AccountSettingsPage";
import FavoritesPage from "../pages/Favorites/FavoritesPage";
import HomePage from "../pages/Home/HomePage";
import MyPage from "../pages/MyPage/MyPage";
import MyReviewsPage from "../pages/MyReviews/MyReviewsPage";
import SearchPage from "../pages/Search/SearchPage";
import HistoryPage from '../pages/Club/History/HistoryPage';
import ClubDetailPage from "../pages/Club/ClubDetail/ClubDetailPage";
import ClubRegisterPage from '../pages/Club/ClubManage/ClubRegisterPage';
import ClubRegisterPreviewPage from '../pages/Club/ClubManage/ClubRegisterPreviewPage';
import ClubUpdatePage from '../pages/Club/ClubManage/ClubUpdatePage';
import ClubUpdatePreviewPage from '../pages/Club/ClubManage/ClubUpdatePreviewPage.jsx';
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import FindAccountPage from "../pages/Auth/FindAccountPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />
        <Route path="/mypage/account" element={<ProtectedRoute> <AccountSettingsPage /> </ProtectedRoute>} />
        <Route path="/mypage/favorites" element={<ProtectedRoute> <FavoritesPage /> </ProtectedRoute>} />
        <Route path="/mypage/reviews" element={<ProtectedRoute> <MyReviewsPage /> </ProtectedRoute>} />
        <Route path="/mypage" element={<ProtectedRoute> <MyPage /> </ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute> <SearchPage /> </ProtectedRoute>} />

        {/* 동아리 관련 경로들 */}
        <Route path="/clubs/:clubId/history" element={<ProtectedRoute> <HistoryPage /> </ProtectedRoute>} />
        <Route path="/club/:clubId" element={<ProtectedRoute> <ClubDetailPage /> </ProtectedRoute>} />
        
        {/* 등록 관련 경로 */}
        <Route path="/club/register" element={<ProtectedRoute> <ClubRegisterPage /> </ProtectedRoute>} />
        <Route path="/club/register/preview" element={<ProtectedRoute> <ClubRegisterPreviewPage /> </ProtectedRoute>} />
        
        {/* 수정 관련 경로 */}
        <Route path="/club/update/:clubId" element={<ProtectedRoute> <ClubUpdatePage /> </ProtectedRoute>} />
        <Route path="/club/update/:clubId/preview" element={<ProtectedRoute> <ClubUpdatePreviewPage /> </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}