import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import Pagination from '../../../components/common/Pagination/Pagination';
import './HistoryPage.css';
import { useEffect } from 'react';
import { getClubHistory } from '../../../api/clubApi';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${MM}.${dd}  ${HH}:${mm}`;
};

const fieldNameMap = {
  description: '동아리 소개',
  briefDescription: '한줄 소개',
  clubName: '동아리 이름',
  recruitPeriod: '모집 기간',
  coverImage: '커버 이미지',
  profileImage: '프로필 이미지',
  activity: '활동 내용',
  categoryId: '카테고리',
};

export default function HistoryPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [history, setHistory] = useState([]);
  const [club, setClub] = useState({ clubName: '', profileImageUrl: null });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [failedImageUrl, setFailedImageUrl] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
        const result = await getClubHistory(clubId, {
        page: currentPage,
        pageSize: 10
        });
        if (result.success) {
        setHistory(result.data.history);
        setTotalPages(result.data.totalPages);
        setClub({
          clubName: result.data.clubName || '',
          profileImageUrl: result.data.profileImageUrl || null
        });
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clubId, currentPage]);

  return (
    <>
      <Header />
      <main className="history-page">

        {/* 왼쪽 메인 영역 */}
        <div className="history-main">
          <button className="back-button" onClick={() => navigate(`/club/${clubId}`)}>
            {'< 동아리 상세로 돌아가기'}
          </button>

          <h1 className="history-title">수정 로그</h1>
          <p className="history-subtitle">"{club.clubName}" 동아리의 수정 내역을 확인할 수 있습니다.</p>

          <hr className="history-divider" />

          {/* 수정 로그 목록 */}
          <div className="history-list">
            {loading ? (
                <p>로딩 중...</p>
            ) : history.length === 0 ? (
                <p>수정 내역이 없습니다.</p>
            ) : (
                history.map((item) => (
                    <div key={item.historyId} className="history-card">
                      <div className="history-card-header">
                        <div className="history-modifier-info">
                          <span className="history-modifier">{item.modifier}</span>
                          <span className="history-date">{formatDate(item.createdAt)}</span>
                        </div>
                        <div className="history-field-info">
                          <span className="history-field-label">수정 항목</span>
                          <span className="history-field-value">{fieldNameMap[item.modifiedField] || item.modifiedField}</span>
                        </div>
                      </div>
                      <div className="history-card-body">
                        <div className="history-change-section">
                          <span className="history-change-label">변경 내용</span>
                          <div className="history-change-content">
                            <div className="history-change-box">
                              <p className="history-change-title">수정 전</p>
                              <p className="history-change-text">{item.oldValue}</p>
                            </div>
                            <span className="history-arrow">→</span>
                            <div className="history-change-box">
                              <p className="history-change-title">수정 후</p>
                              <p className="history-change-text">{item.newValue}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                ))
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* 오른쪽 사이드바 */}
        <aside className="history-sidebar">
          <div className="sidebar-image">
            {club.profileImageUrl && failedImageUrl !== club.profileImageUrl ? (
              <img
                src={club.profileImageUrl}
                alt={club.clubName}
                onError={() => setFailedImageUrl(club.profileImageUrl)}
              />
            ) : (
              <div className="sidebar-image-placeholder">IMAGE</div>
            )}
          </div>
          <h3 className="sidebar-club-name">{club.clubName}</h3>
          <button className="sidebar-detail-btn" onClick={() => navigate(`/club/${clubId}`)}>
            동아리 상세 보기 &gt;
          </button>
          <p className="sidebar-notice">
            ⓘ 수정 로그는 최근 1년간의 내역만 확인할 수 있습니다.
          </p>
        </aside>

      </main>
    </>
  );
}
