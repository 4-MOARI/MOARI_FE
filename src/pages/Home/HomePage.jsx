import Header from '../../components/common/Header/Header';

// 테스트
// src/pages/Home/HomePage.jsx

// 1. 경로를 정확하게 확인 (상대 경로)
import CategoryBadge from "../../components/common/Badge/CategoryBadge/CategoryBadge";
import RecruitStatusBadge from "../../components/common/Badge/RecruitStatusBadge/RecruitStatusBadge";

const HomePage = () => {
  return (
    <div>
      {/* 2. 호출 확인 */}
      <h1>테스트 페이지</h1>
      <CategoryBadge>학술</CategoryBadge>
      <RecruitStatusBadge isRecruiting={true} />
    </div>
  );
};

export default HomePage;