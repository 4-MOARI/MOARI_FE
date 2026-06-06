import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import Pagination from '../../../components/common/Pagination/Pagination';
import './HistoryPage.css';
import { useEffect } from 'react';
import { getClubHistory } from '../../../api/clubApi';

const formatDate = (dateStr) => {
  if (!dateStr || dateStr === '-') return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${MM}.${dd}  ${HH}:${mm}`;
};

const isDateField = (field) => {
  return field.includes('At') || field.includes('Date');
};

const fieldNameMap = {
  'description': '동아리 소개',
  'activity': '활동 내용',
  'recruitPeriod': '모집 기간',
  'recruitStartAt': '모집 시작일',
  'recruitEndAt': '모집 종료일',
  'category': '카테고리',
  'links': '외부 링크',
  'coverImage': '커버 이미지',
  'profileImageUrl': '프로필 이미지',
  'coverImageUrl': '커버 이미지',
  'clubName': '동아리명',
};

const linkTypeMap = {
  'Web': '웹',
  'web': '웹',
  'Instagram': '인스타그램',
  'instagram': '인스타그램',
  'Notion': '노션',
  'notion': '노션',
  'Discord': '디스코드',
  'discord': '디스코드',
  'Etc': '기타',
  'etc': '기타',
};

const getFieldName = (field) => fieldNameMap[field] || field;
const isImageField = (field) => {
  return field.includes('Image') || field.includes('image') || field.includes('Url') || field.includes('url');
};
const formatHistoryValue = (field, value) => {
  if (field !== 'links') return value || '-';

  try {
    const links = JSON.parse(value || '[]');

    if (!Array.isArray(links) || links.length === 0) {
      return '없음';
    }

    return links
      .map((link) => `${link.type}: ${link.url}`)
      .join('\n');
  } catch (error) {
    return value || '-';
  }
};

const parseLinks = (value) => {
  if (!value || value === '-' || value === '[]') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const renderLinks = (value) => {
  const linkList = parseLinks(value);

  if (linkList.length === 0) return <span>-</span>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {linkList.map((link, index) => {
        // 사전에 정의된 값이면 한국어로 바꾸고, 없으면 입력값 그대로 활용
        const displayType = linkTypeMap[link.type] || link.type || '기타';

        return (
          <div 
            key={index} 
            className="history-change-text" 
            style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}
          >
            {/* 플랫폼 이름과 URL을 한 줄로 연결 */}
            {displayType}: {link.url}
          </div>
        );
      })}
    </div>
  );
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
                          <span className="history-field-value">{getFieldName(item.modifiedField)}</span>
                        </div>
                      </div>
                      <div className="history-card-body">
                        <div className="history-change-section">
                          <span className="history-change-label">변경 내용</span>
                          <div className="history-change-content">
                            <div className="history-change-box">
                              <p className="history-change-title">수정 전</p>
                              <div className="history-change-text">
                                {isImageField(item.modifiedField) && item.oldValue && item.oldValue !== '-' ? (
                                  <img src={item.oldValue} alt="수정 전" style={{width: '100%', borderRadius: '8px'}} />
                                ) : isDateField(item.modifiedField) ? (
                                  formatDate(item.oldValue)
                                ) : item.modifiedField === 'links' ? (
                                  renderLinks(item.oldValue)
                                ) : (
                                  item.oldValue || '-'
                                )}
                              </div>
                            </div>
                            <span className="history-arrow">→</span>
                            <div className="history-change-box">
                              <p className="history-change-title">수정 후</p>
                              <div className="history-change-text">
                                {isImageField(item.modifiedField) && item.newValue && item.newValue !== '-' ? (
                                  <img src={item.newValue} alt="수정 후" style={{ width: '100%', borderRadius: '8px' }} />
                                  ) : isDateField(item.modifiedField) ? (
                                    formatDate(item.newValue)
                                  ) : item.modifiedField === 'links' ? (
                                    renderLinks(item.newValue)
                                  ) : (
                                    item.newValue || '-'
                                  )}
                              </div>
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
