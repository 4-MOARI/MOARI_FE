import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestPage from "../pages/TestPage"; // 테스트용
import AccountSettingsPage from "../pages/AccountSettings/AccountSettingsPage";
import FavoritesPage from "../pages/Favorites/FavoritesPage";
import HomePage from "../pages/Home/HomePage";
import MyPage from "../pages/MyPage/MyPage";
import SearchPage from "../pages/Search/SearchPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mypage/account" element={<AccountSettingsPage />} />
        <Route path="/mypage/favorites" element={<FavoritesPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/test" element={<TestPage />} /> //테스트용
      </Routes>
    </BrowserRouter>
  );
}
