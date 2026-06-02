import { useState } from 'react';
import Header from '../../../components/common/Header/Header';
import Pagination from '../../../components/common/Pagination/Pagination';
import './HistoryPage.css';

// 더미 데이터
const dummyClub = {
  clubId: 1,
  clubName: '알고리즘 연구회',
  coverImageUrl: null,
};

const dummyHistory = [
  {
    historyId: 1,
    modifier: '홍길동',
    modifiedField: '동아리 소개',
    oldValue: '코딩테스트 준비하는 학술 동아리입니다.',
    newValue: '코딩테스트 준비부터 실전 문제풀이까지 함께 공부하는 학술 동아리입니다.',
    createdAt: '2026.05.20 14:30',
  },
  {
    historyId: 2,
    modifier: '홍길동',
    modifiedField: '모집 상태',
    oldValue: '코딩테스트 준비부터 실전 문제풀이까지 같이 공부하는 학술 동아리입니다.코딩테스트 준비부터 실전 문제풀이까지 같이 공부하는 학술 동아리입니다.코딩테스트 준비부터 실전 문제풀이까지 같이 공부하는 학술 동아리입니다.',
    newValue: '코딩테스트 준비부터 실전 문제풀이까지 함께 공부하는 학술 동아리입니다.',
    createdAt: '2026.05.20 14:30',
  },
  {
    historyId: 3,
    modifier: '홍길동',
    modifiedField: '동아리 소개',
    oldValue: '코딩테스트 준비부터 실전 문제풀이까지 같이 공부하는 학술 동아리입니다.',
    newValue: '코딩테스트 준비부터 실전 문제풀이까지 함께 공부하는 학술 동아리입니다.',
    createdAt: '2026.05.20 14:30',
  },
];

export default function HistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <>
      <Header />
      <main className="history-page">

        {/* 왼쪽 메인 영역 */}
        <div className="history-main">
          <button className="back-button">{'< 동아리 상세로 돌아가기'}</button>

          <h1 className="history-title">수정 로그</h1>
          <p className="history-subtitle">"{dummyClub.clubName}" 동아리의 수정 내역을 확인할 수 있습니다.</p>

          <hr className="history-divider" />

          {/* 수정 로그 목록 */}
          <div className="history-list">
            {dummyHistory.map((history) => (
              <div key={history.historyId} className="history-card">
                <div className="history-card-header">
                    <div className="history-modifier-info">
                    <span className="history-modifier">{history.modifier}</span>
                    <span className="history-date">{history.createdAt}</span>
                    </div>
                    <div className="history-field-info">
                    <span className="history-field-label">수정 항목</span>
                    <span className="history-field-value">{history.modifiedField}</span>
                    </div>
                </div>

                <div className="history-card-body">
                    <div className="history-change-section">
                        <span className="history-change-label">변경 내용</span>
                        <div className="history-change-content">
                            <div className="history-change-box">
                                <p className="history-change-title">수정 전</p>
                                <p className="history-change-text">{history.oldValue}</p>
                            </div>
                            <span className="history-arrow">→</span>
                            <div className="history-change-box">
                                <p className="history-change-title">수정 후</p>
                                <p className="history-change-text">{history.newValue}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ))}
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
            {dummyClub.coverImageUrl ? (
              <img src={dummyClub.coverImageUrl} alt={dummyClub.clubName} />
            ) : (
              <div className="sidebar-image-placeholder">IMAGE</div>
            )}
          </div>
          <h3 className="sidebar-club-name">{dummyClub.clubName}</h3>
          <button className="sidebar-detail-btn">동아리 상세 보기 &gt;</button>
          <p className="sidebar-notice">
            ⓘ 수정 로그는 최근 1년간의 내역만 확인할 수 있습니다.
          </p>
        </aside>

      </main>
    </>
  );
}