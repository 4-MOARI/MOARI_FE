import { useNavigate } from 'react-router-dom';
import './Header.css';
import HeaderSwitch from './HeaderSwitch';
import { UserRound } from 'lucide-react';

function Header({
    showSwitch,
    clubType,
    setClubType,
}) {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-left">
        <div 
            className="header-logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer'}}
        >
          모아리
        </div>

        { showSwitch && (
            <HeaderSwitch 
                selected={clubType}
                onChange={setClubType}
            />
        )}
      </div>

      <nav className="header-nav">
        <button 
            className="nav-button"
            onClick={() => navigate('/search')}>
          동아리 탐색
        </button>

        <button 
            className="nav-button"
            onClick={() => navigate('/club/register')}>
          동아리 등록
        </button>

        <button 
            className="nav-button"
            onClick={() => navigate('/mypage')}>
          마이페이지
        </button>

        <button 
            className="profile-button"
            onClick={() => navigate('/mypage/account')}>
          <UserRound size={18} strokeWidth={2} />
        </button>
      </nav>
    </header>
  );
}

export default Header;
