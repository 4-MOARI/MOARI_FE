import './Header.css';
import HeaderSwitch from './HeaderSwitch';
import { UserRound } from 'lucide-react';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          모아리
        </div>

        <HeaderSwitch />
      </div>

      <nav className="header-nav">
        <button className="nav-button">
          동아리 탐색
        </button>

        <button className="nav-button">
          동아리 등록
        </button>

        <button className="nav-button">
          마이페이지
        </button>

        <button className="profile-button">
          <UserRound size={18} strokeWidth={2} />
        </button>
      </nav>
    </header>
  );
}

export default Header;