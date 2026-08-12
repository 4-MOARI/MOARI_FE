import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/common/Header/Header';

import Pagination from '../../components/common/Pagination/Pagination';
import MatchingClubCard from '../../components/club/ClubCard/MatchingClubCard';
import { getMyFavoriteClubs } from '../../api/userApi';
import { getClubDetail } from '../../api/clubApi';

import TimeTable from '../../components/common/TimeTable/TimeTable';

import '../MyPage/MyPage.css';
import './RecommendationsPage.css';

const LIMIT = 6;

const CLUB_COLORS = [
  '#F3B5B5', // 빨강
  '#F6C99A', // 주황
  '#F5E6A8', // 노랑
  '#B8DDB8', // 초록
  '#AFCBE8', // 파랑
];

function RecommendationsPage() {
  const navigate = useNavigate();

  // 실제 찜한 동아리 목록
  const [clubs, setClubs] = useState([]);

  // 동아리 선택 상태
  const [selectedClubs, setSelectedClubs] = useState([]);

  // 타임테이블에서 사용자가 선택한 시간
  // 이전에 저장한 값이 있으면 불러오고, 없으면 빈 배열
  const [selectedTimes, setSelectedTimes] = useState(() => {
    try {
        const savedTimes = localStorage.getItem(
        'matchingSelectedTimes'
        );

        return savedTimes
        ? JSON.parse(savedTimes)
        : [];
    } catch (error) {
        console.error(
        '저장된 활동 가능 시간 불러오기 실패:',
        error
        );

        return [];
    }
    });

  // 페이지
  const [page, setPage] = useState(1);

  // 선택한 동아리 상세정보
  const [selectedClubDetails, setSelectedClubDetails] = useState([]);

  // 페이지네이션 정보
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
  });

  // 로딩 / 에러
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // 동아리별 색상
  const [clubColors, setClubColors] = useState({});

  /*
   * 찜한 동아리 목록 조회
   */
  useEffect(() => {
    const fetchFavoriteClubs = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await getMyFavoriteClubs({
          page,
          pageSize: LIMIT,
        });

        console.log(
          '찜한 동아리 실제 데이터:',
          response
        );

        const data = response?.data ?? response;

        const clubList =
          data?.clubs ??
          data?.favorites ??
          data?.items ??
          [];

        setClubs(clubList);

        const totalCount =
          data?.totalCount ??
          clubList.length ??
          0;

        setPagination({
          totalCount,
          totalPages:
            data?.totalPages ??
            Math.max(
              1,
              Math.ceil(totalCount / LIMIT)
            ),
        });
      } catch (error) {
        console.error(
          '찜한 동아리 목록 조회 실패:',
          error
        );

        setClubs([]);

        setPagination({
          totalCount: 0,
          totalPages: 1,
        });

        setErrorMessage(
          '찜한 동아리 목록을 불러오지 못했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteClubs();
  }, [page]);

  /*
   * 선택된 동아리의 색상 유지
   */
    useEffect(() => {
        const nextColors = {};

        selectedClubs.forEach((clubId, index) => {
            nextColors[clubId] = CLUB_COLORS[index];
        });

        setClubColors(nextColors);
    }, [selectedClubs]);

  /*
   * 동아리 선택 / 해제
   * 최대 4개
   */
  const toggleClub = (clubId) => {
    setSelectedClubs((prev) => {
      // 이미 선택된 동아리 → 선택 해제
      if (prev.includes(clubId)) {
        return prev.filter(
          (id) => id !== clubId
        );
      }

      // 최대 4개
      if (prev.length >= 4) {
        return prev;
      }

      return [...prev, clubId];
    });
  };

  /*
   * 선택한 동아리 상세정보 조회
   */
  useEffect(() => {
    const fetchSelectedClubDetails = async () => {
      if (selectedClubs.length === 0) {
        setSelectedClubDetails([]);
        return;
      }

      try {
        const details = await Promise.all(
          selectedClubs.map((clubId) =>
            getClubDetail(clubId)
          )
        );

        setSelectedClubDetails(details);

        console.log(
          '선택한 동아리 상세정보:',
          details
        );
      } catch (error) {
        console.error(
          '선택한 동아리 상세정보 조회 실패:',
          error
        );

        setSelectedClubDetails([]);
      }
    };

    fetchSelectedClubDetails();
  }, [selectedClubs]);

  /*
   * 활동 가능 시간 저장
   */
    const handleSaveTime = () => {
    localStorage.setItem(
        'matchingSelectedTimes',
        JSON.stringify(selectedTimes)
    );

    alert('활동 가능한 시간이 저장되었습니다.');
    };

  /*
   * 비교 / 궁합 분석
   */
    const handleAnalyze = () => {
    if (selectedClubs.length < 2) {
        alert('동아리를 2개 이상 선택해주세요.');
        return;
    }

    navigate('/recommendations/compare', {
        state: {
        selectedClubs: selectedClubDetails,
        selectedTimes,
        },
    });
    };


  /*
   * 선택된 동아리 ID로
   * 선택된 동아리 상세정보를 찾습니다.
   *
   * 현재 페이지의 clubs가 아니라
   * selectedClubDetails를 기준으로 찾기 때문에
   * 페이지를 넘겨도 선택한 동아리 표시가 유지됩니다.
   */
  const getSelectedClubById = (clubId) => {
    return selectedClubDetails.find(
      (club) =>
        (club.clubId ?? club.id) === clubId
    );
  };

  return (
    <>
      <Header />
      <main className="matching-page">

        {/* 뒤로가기 */}
        <button
          type="button"
          className="matching-back-button"
          onClick={() => navigate('/mypage')}
          aria-label="뒤로가기"
        >
          ←
        </button>

        {/* 상단 탭 */}
        <div className="matching-title-tab">
          맞춤 동아리
        </div>

        <section className="matching-layout">

          {/* =========================
              왼쪽 : 활동 가능 시간
          ========================= */}
          <section className="matching-time-section">

            <div className="matching-panel matching-time-panel">

              <div className="matching-section-title-row">

                <div>
                  <h1>
                    활동 가능한 시간 선택
                  </h1>

                  <p className="matching-time-description">
                    동아리 활동이 가능한 시간을
                    선택해주세요.
                  </p>
                </div>

                <button
                  type="button"
                  className="matching-save-button"
                  onClick={handleSaveTime}
                >
                  저장
                </button>

              </div>

              <TimeTable
                selectedTimes={selectedTimes}
                setSelectedTimes={setSelectedTimes}
                selectedClubDetails={
                  selectedClubDetails
                }
                clubColorMap={clubColors}
              />

              {/* =========================
                  타임테이블 아래
                  선택한 동아리 4칸
              ========================= */}
              <div className="matching-selected-clubs">
                {[0, 1, 2, 3].map((index) => {
                    const clubId = selectedClubs[index];

                    const selectedClub =
                        clubId !== undefined
                            ? getSelectedClubById(clubId)
                            : null;

                    // 빈 슬롯
                    if (!selectedClub) {
                    return (
                        <div
                        key={`empty-${index}`}
                        className="matching-selected-club-empty"
                        />
                    );
                    }

                    const selectedClubId =
                    selectedClub.clubId ?? selectedClub.id;

                    const color = clubColors[selectedClubId];

                    const imageUrl =
                    selectedClub.profileImageUrl ||
                    selectedClub.coverImageUrl ||
                    null;

                    return (
                    <div
                        key={`selected-${selectedClubId}`}
                        className="matching-selected-club"
                        style={{
                        backgroundColor: color,
                        }}
                        title={selectedClub.clubName}
                    >
                        {/* 동아리 이미지 */}
                        <div className="matching-selected-club-image-wrap">
                        {imageUrl ? (
                            <img
                            src={imageUrl}
                            alt={selectedClub.clubName}
                            className="matching-selected-club-image"
                            />
                        ) : (
                            <div className="matching-selected-club-no-image">
                            IMG
                            </div>
                        )}
                        </div>

                        {/* 동아리명 */}
                        <div className="matching-selected-club-name">
                        {selectedClub.clubName}
                        </div>
                    </div>
                    );
                })}
              </div>

            </div>

          </section>

          {/* =========================
              오른쪽 : 찜한 동아리
          ========================= */}
          <section className="matching-club-section">

            <div className="matching-panel matching-club-panel">

              <div className="matching-club-header">

                <div>
                  <h1>
                    찜한 동아리 목록
                  </h1>

                  <p className="matching-time-description">
                    비교·궁합 분석 할 동아리를
                    2-4개 선택하여주세요.
                  </p>
                </div>

                <button
                  type="button"
                  className="matching-analyze-button"
                  onClick={handleAnalyze}
                >
                  비교 · 궁합 분석하기
                </button>

              </div>

              {/* 로딩 */}
              {isLoading && (
                <div className="mypage-state">
                  불러오는 중입니다.
                </div>
              )}

              {/* 에러 */}
              {!isLoading &&
                errorMessage && (
                  <div className="mypage-state error">
                    {errorMessage}
                  </div>
                )}

              {/* 찜한 동아리 없음 */}
              {!isLoading &&
                !errorMessage &&
                clubs.length === 0 && (
                  <div className="mypage-state">
                    찜한 동아리가 없습니다.
                  </div>
                )}

              {/* 실제 찜한 동아리 */}
              {!isLoading &&
                !errorMessage &&
                clubs.length > 0 && (
                  <div className="matching-club-grid">

                    {clubs.map((club) => {
                      const clubId =
                        club.clubId ??
                        club.id;

                      return (
                        <MatchingClubCard
                          key={clubId}
                          club={club}
                          selected={selectedClubs.includes(
                            clubId
                          )}
                          selectedColor={
                            clubColors[clubId]
                          }
                          onToggle={toggleClub}
                        />
                      );
                    })}

                  </div>
                )}

              <div className="matching-guide">
                찜한 동아리 중 2-4개를 선택해
                AI 비교·궁합 분석을 받아보세요.
              </div>

              <Pagination
                currentPage={page}
                totalPages={
                  pagination.totalPages
                }
                onPageChange={setPage}
              />

            </div>

          </section>

        </section>

      </main>
    </>
  );
}

export default RecommendationsPage;