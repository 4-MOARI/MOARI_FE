import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from '../../components/common/Header/Header';
import ComparisonCard from "../../components/club/ComparisonCard/ComparisonCard";

import { getClubDetail } from "../../api/clubApi";
import { getClubReviews } from "../../api/reviewApi";
import { getComparisonData } from "../../api/comparisonApi";

import "./ComparisonPage.css";
import StarRating from "../../components/common/StarRating/StarRating";
import DiscreteSlider from "../Club/Review/DiscreteSlider";

import CompatibilitySection from '../../components/club/compatibility/CompatibilitySection'; 

const MAX_COMPARE_COUNT = 4;

// [추가] 파일 상단 MAX_COMPARE_COUNT 바로 아래에 넣기
const COMPARISON_ITEMS = [
  { key: "tags", label: "대표키워드", active: true },
  { key: "rating", label: "평균 별점", active: false },
  { key: "favoriteCount", label: "인기(찜 수)", active: true },
  { key: "activityPurpose", label: "활동 목적", active: false },
  { key: "mainActivity", label: "대표 활동", active: true },
  { key: "activityIntensity", label: "활동 강도", active: false },
  { key: "networkingRatio", label: "친목 비중", active: true },
  { key: "schedules", label: "정기 모임", active: false },
  { key: "activityTime", label: "활동 시간 (주)", active: true },
  { key: "activityPeriod", label: "활동 기간", active: false },
  { key: "fee", label: "회비", active: true },
  { key: "recruitmentPeriod", label: "모집 시기", active: false },
  { key: "interviewDifficulty", label: "면접 난이도", active: true },
];

const getClubId = (club) => {
  if (!club) return null;

  return (
    club.clubId ??
    club.id ??
    club.club?.clubId ??
    club.club?.id ??
    null
  );
};

const getActivityPurpose = (data) => {
  if (!data) return "";

  const field =
    data.field ??
    data.categoryName ??
    data.category?.name ??
    data.activityField ??
    "";

  const fieldText =
    typeof field === "string"
      ? field.trim()
      : "";

  const mainActivity = extractMajorActivity(data);

  const purpose =
    data.activityPurpose ??
    data.purpose ??
    "";

  // API에 명확한 활동 목적이 이미 존재하면 그대로 사용
  if (
    typeof purpose === "string" &&
    purpose.trim()
  ) {
    return purpose.trim();
  }

  const activityText =
    typeof mainActivity === "string"
      ? mainActivity.trim()
      : "";

  if (!activityText && !fieldText) {
    return "";
  }

  const text =
    `${fieldText} ${activityText}`.toLowerCase();

  // 금융
  if (
    text.includes("금융") ||
    text.includes("재무") ||
    text.includes("투자")
  ) {
    return "금융 분야의 지식과 역량을 쌓기 위한 모임";
  }

  // 농구
  if (text.includes("농구")) {
    if (
      text.includes("대회") ||
      text.includes("경기") ||
      text.includes("리그") ||
      text.includes("출전")
    ) {
      return "농구 경기와 대회 참여를 위한 모임";
    }

    return "농구를 함께 즐기고 실력을 향상하기 위한 모임";
  }

  // 축구 / 풋살
  if (
    text.includes("축구") ||
    text.includes("풋살")
  ) {
    if (
      text.includes("대회") ||
      text.includes("경기") ||
      text.includes("리그") ||
      text.includes("출전")
    ) {
      return "축구·풋살 경기와 대회 참여를 위한 모임";
    }

    return "축구·풋살을 함께 즐기고 실력을 향상하기 위한 모임";
  }

  // 음악 / 밴드
  if (
    text.includes("밴드") ||
    text.includes("음악") ||
    text.includes("연주")
  ) {
    return `${fieldText || "음악"} 활동과 공연을 위한 모임`;
  }

  // 풍물 / 국악 / 전통문화
  if (
    text.includes("풍물") ||
    text.includes("국악") ||
    text.includes("전통") ||
    text.includes("무형문화재") ||
    text.includes("탈춤") ||
    text.includes("농악")
  ) {
    if (text.includes("고성오광대")) {
      return "풍물패 활동과 고성오광대 전수 및 공연을 위한 모임";
    }

    if (
      text.includes("전수") ||
      text.includes("공연")
    ) {
      return `${fieldText || "전통문화"}를 배우고 공연하기 위한 모임`;
    }

    return `${fieldText || "전통문화"}를 배우고 함께 활동하기 위한 모임`;
  }

  // 봉사
  if (
    text.includes("봉사") ||
    text.includes("사회공헌") ||
    text.includes("기부")
  ) {
    return "봉사와 사회공헌 활동을 위한 모임";
  }

  // 학술 / 연구
  if (
    text.includes("학술") ||
    text.includes("스터디") ||
    text.includes("연구") ||
    text.includes("전공")
  ) {
    return `${fieldText || "학술"} 분야의 지식과 역량을 쌓기 위한 모임`;
  }

  // 독서 / 독서토론
  if (
    text.includes("독서") ||
    text.includes("독서토론") ||
    text.includes("독서 모임")
  ) {
    return "독서토론을 위한 모임";
  }

  // 일반적인 경우
  if (activityText) {
    return `${activityText}을 위한 모임`;
  }

  if (fieldText) {
    return `${fieldText} 분야의 활동을 위한 모임`;
  }

  return "";
};

const extractField = (data) => {
  if (!data) return null;

  const text =
    data.field ??
    data.categoryName ??
    data.category?.name ??
    data.activityField ??
    "";

  if (typeof text !== "string") {
    return null;
  }

  const match = text.match(/분야\s*:\s*([^]+?)(?=\s*(?:동아리실|동아리\s*지위|주요\s*활동)\s*:|$)/);

  return match?.[1]?.trim() || text.trim() || null;
};

const extractMajorActivity = (data) => {
  if (!data) return null;

  // 가장 우선: 상세페이지의 "동아리 소개"
  // 예: "매주 독서토론"
  const briefDescription =
    data.briefDescription ??
    data.introduction ??
    data.intro ??
    "";

  if (
    typeof briefDescription === "string" &&
    briefDescription.trim()
  ) {
    return briefDescription.trim();
  }

  const candidates = [
    data.mainActivity,
    data.majorActivity,
    data.mainActivities,
    data.activityContent,
    data.activityDescription,
    data.activity,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string" || !candidate.trim()) {
      continue;
    }

    let text = candidate.trim();

    // "활동기간", "회비"가 시작되는 지점부터 제거
    text = text
      .replace(
        /\s*(?:활동기간|활동\s*기간)\s*:?.*$/s,
        ""
      )
      .replace(
        /\s*(?:회비|가입비|등록비)\s*:?.*$/s,
        ""
      )
      .trim();

    if (text) {
      return text;
    }
  }

  return null;
};
const extractActivityPeriod = (data) => {
  if (!data) return null;

  // 이미 별도 필드가 있다면 최우선 사용
  const directValue =
    data.activityPeriod ??
    data.activityDuration ??
    data.duration ??
    data.period ??
    null;

  if (
    directValue !== null &&
    directValue !== undefined &&
    String(directValue).trim()
  ) {
    return String(directValue).trim();
  }

  const activity =
    typeof data.activity === "string"
      ? data.activity
      : "";

  if (!activity) {
    return null;
  }

  // 예:
  // 활동기간 1년
  // 활동 기간: 1년
  const match = activity.match(
    /(?:활동기간|활동\s*기간)\s*:?\s*([^\n,]+?)(?=\s*(?:회비|가입비|등록비)\s*:?\s*|$)/i
  );

  return match?.[1]?.trim() || null;
};


const extractFee = (data) => {
  if (!data) return null;

  // 이미 별도 필드가 있다면 최우선 사용
  const directValue =
    data.fee ??
    data.clubFee ??
    data.membershipFee ??
    data.registrationFee ??
    null;

  if (
    directValue !== null &&
    directValue !== undefined &&
    String(directValue).trim()
  ) {
    return directValue;
  }

  const activity =
    typeof data.activity === "string"
      ? data.activity
      : "";

  if (!activity) {
    return null;
  }

  // 예:
  // 회비 연 2만원
  // 회비: 연 2만원
  const match = activity.match(
    /(?:회비|가입비|등록비)\s*:?\s*([^\n,]+)/i
  );

  return match?.[1]?.trim() || null;
};

const getTimeInMinutes = (time) => {
  if (!time) return null;

  const [hour, minute] = String(time)
    .slice(0, 5)
    .split(":")
    .map(Number);

  if (
    !Number.isFinite(hour) ||
    !Number.isFinite(minute)
  ) {
    return null;
  }

  return hour * 60 + minute;
};

const isActivityTimeAvailable = (clubSchedule, availableTimes) => {
  if (!clubSchedule || !Array.isArray(availableTimes)) {
    return false;
  }

  const clubDay =
    clubSchedule.dayOfWeek ??
    clubSchedule.day ??
    "";

  const clubStart = getTimeInMinutes(
    clubSchedule.startTime
  );

  const clubEnd = getTimeInMinutes(
    clubSchedule.endTime
  );

  if (
    !clubDay ||
    clubStart === null ||
    clubEnd === null
  ) {
    return false;
  }

  return availableTimes.some((available) => {
    const availableDay =
      available.dayOfWeek ??
      available.day ??
      "";

    if (availableDay !== clubDay) {
      return false;
    }

    const availableStart = getTimeInMinutes(
      available.startTime
    );

    const availableEnd = getTimeInMinutes(
      available.endTime
    );

    if (
      availableStart === null ||
      availableEnd === null
    ) {
      return false;
    }

    // 시간대가 조금이라도 겹치면 활동 가능
    return (
      clubStart < availableEnd &&
      clubEnd > availableStart
    );
  });
};

const normalizeClub = (data) => {
  if (!data) return null;

  const clubId = getClubId(data);

  const recruitPeriod =
    data.recruitPeriod ??
    data.recruitmentPeriod ??
    null;

  const schedules = Array.isArray(data.schedules)
    ? data.schedules
    : [];

  const activityTime =
    schedules.length > 0
      ? (() => {
          const totalMinutes = schedules.reduce(
            (total, schedule) => {
              if (!schedule.startTime || !schedule.endTime) {
                return total;
              }

              const [startHour, startMinute] = String(
                schedule.startTime
              )
                .split(":")
                .map(Number);

              const [endHour, endMinute] = String(
                schedule.endTime
              )
                .split(":")
                .map(Number);

              if (
                !Number.isFinite(startHour) ||
                !Number.isFinite(startMinute) ||
                !Number.isFinite(endHour) ||
                !Number.isFinite(endMinute)
              ) {
                return total;
              }

              const startTotal =
                startHour * 60 + startMinute;

              const endTotal =
                endHour * 60 + endMinute;

              let duration = endTotal - startTotal;

              if (duration < 0) {
                duration += 24 * 60;
              }

              return total + duration;
            },
            0
          );

          if (totalMinutes === 0) {
            return null;
          }

          const hours = totalMinutes / 60;

          return Number.isInteger(hours)
            ? `${hours}시간`
            : `${hours.toFixed(1)}시간`;
        })()
      : null;

  return {
    ...data,

    id: clubId,
    clubId,

    name:
      data.clubName ??
      data.name ??
      "-",

    clubName:
      data.clubName ??
      data.name ??
      "-",

    profileImageUrl:
      data.profileImageUrl ??
      data.profileImage ??
      null,

    categoryName:
      data.categoryName ??
      data.category?.name ??
      (typeof data.category === "string"
        ? data.category
        : null),

    category:
      data.category ??
      data.categoryName ??
      null,

    isRecruiting:
      data.isRecruiting ??
      data.status ??
      false,

    status:
      data.isRecruiting ??
      data.status ??
      false,

    recruitmentStatus:
      data.recruitmentStatus ??
      null,

    tags:
      Array.isArray(data.topKeywords)
        ? data.topKeywords
        : Array.isArray(data.tags)
          ? data.tags
          : [],
    avgRating:
      data.avgRating ??
      data.averageRating ??
      data.rating ??
      data.reviewRating ??
      0,

    averageRating:
      data.averageRating ??
      data.avgRating ??
      data.rating ??
      data.reviewRating ??
      0,

    rating:
      data.rating ??
      data.averageRating ??
      data.avgRating ??
      data.reviewRating ??
      0,

    favoriteCount:
      data.favoriteCount ??
      data.likeCount ??
      data.favoritesCount ??
      data.favoriteCnt ??
      data.likeCnt ??
      data.favorites ??
      data.likes ??
      0,

  activityPeriod:
    extractActivityPeriod(data),

  activityTime,

  fee:
    extractFee(data),

    recruitmentPeriod:
      recruitPeriod,

    recruitPeriod,

    recruitStartAt:
      data.recruitStartAt ??
      recruitPeriod?.start ??
      recruitPeriod?.recruitStartAt ??
      null,

    recruitEndAt:
      data.recruitEndAt ??
      recruitPeriod?.end ??
      recruitPeriod?.recruitEndAt ??
      null,

    interviewDifficulty:
      data.interviewDifficulty ??
      data.interviewLevel ??
      null,

    schedules,

    field:
      extractField(data),

    activityPurpose:
      getActivityPurpose(data),

    mainActivity:
      extractMajorActivity(data),

    activityIntensity:
      data.activityIntensity ??
      data.intensity ??
      null,

    networkingRatio:
      data.networkingRatio ??
      data.friendshipRatio ??
      data.socialRatio ??
      null,
      };
};

/**
 * 앞 페이지에서 전달된 선택 동아리 데이터를 가져옵니다.
 *
 * 지원 형태:
 * 1. navigate("/recommendations/comparison", {
 *      state: { selectedClubs: [...] }
 *    })
 *
 * 2. state: { clubs: [...] }
 *
 * 3. state: { selectedClubIds: [1, 2, 3, 4] }
 */
const getInitialSelectedClubs = (locationState) => {
  if (!locationState) {
    return [];
  }

  if (Array.isArray(locationState.selectedClubs)) {
    return locationState.selectedClubs.slice(0, MAX_COMPARE_COUNT);
  }

  if (Array.isArray(locationState.clubs)) {
    return locationState.clubs.slice(0, MAX_COMPARE_COUNT);
  }

  return [];
};

const getInitialClubIds = (locationState) => {
  if (!locationState) {
    return [];
  }

  if (Array.isArray(locationState.selectedClubIds)) {
    return locationState.selectedClubIds;
  }

  if (Array.isArray(locationState.clubIds)) {
    return locationState.clubIds;
  }

  return [];
};


export default function ComparisonPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 내가 선택한 활동 가능 시간
  const [selectedTimes] = useState(() => {
    // 비교 페이지로 직접 전달된 값이 있으면 우선 사용
    if (Array.isArray(location.state?.selectedTimes)) {
      return location.state.selectedTimes;
    }

    // 없으면 저장된 시간 사용
    try {
      const savedTimes = localStorage.getItem(
        'matchingSelectedTimes'
      );

      return savedTimes
        ? JSON.parse(savedTimes)
        : [];
    } catch (error) {
      console.error(
        '활동 가능 시간 불러오기 실패:',
        error
      );

      return [];
    }
  });

  const [clubs, setClubs] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadSelectedClubs = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const locationState = location.state;

      const initialClubs =
        getInitialSelectedClubs(locationState);

      const initialClubIds =
        getInitialClubIds(locationState);

      try {
        /*
         * 앞 페이지에서 실제 club 객체가 넘어온 경우
         * 우선 그 데이터를 사용합니다.
         */
        let selectedClubs = initialClubs
          .map(normalizeClub)
          .filter(Boolean);

        /*
         * clubId만 넘어온 경우에는 상세 API를 호출합니다.
         */
        if (
          selectedClubs.length === 0 &&
          initialClubIds.length > 0
        ) {

          const detailResults = await Promise.all(
            initialClubIds
              .slice(0, MAX_COMPARE_COUNT)
              .map(async (clubId) => {
                try {
                  const detail =
                    await getClubDetail(clubId);

                  return normalizeClub({
                    ...detail,
                    clubId,
                    id: clubId,
                  });
                } catch (error) {
                  console.error(
                    `동아리 ${clubId} 상세 조회 실패:`,
                    error
                  );

                  return null;
                }
              })
          );
          selectedClubs = detailResults.filter(Boolean);
        }

        const selectedClubIds = selectedClubs
          .map(getClubId)
          .filter(Boolean);

        let comparisonData = [];

        if (selectedClubIds.length >= 2) {
          try {
            const comparisonResponse =
              await getComparisonData(selectedClubIds);

            console.log("비교 API 원본 응답 =", comparisonResponse);

            comparisonData =
              comparisonResponse?.data?.clubs ??
              [];

            console.log("비교 API 원본 응답 =", comparisonResponse);
            console.log("비교 API 최종 데이터 =", comparisonData);
            console.log(
              "비교 API 각 동아리 키워드 =",
              comparisonData.map((item) => ({
                clubId: item.clubId,
                topKeywords: item.topKeywords,
                
                all: item,
              }))
            );

            // 배열이 아니면 빈 배열 처리
            if (!Array.isArray(comparisonData)) {
              comparisonData = [];
            }

            console.log("비교 API 최종 데이터 =", comparisonData);
          } catch (comparisonError) {
            console.error(
              "비교 데이터 조회 실패:",
              comparisonError
            );
          }
        }
        
        const detailedClubs = await Promise.all(
          selectedClubs.map(async (club) => {
            const clubId = getClubId(club);

            if (!clubId) {
              return club;
            }

            try {
              // 동아리 상세 정보와 리뷰 정보를 각각 조회
              const detail = await getClubDetail(clubId);

              let reviewData = null;

              try {
                reviewData = await getClubReviews(clubId);

                console.log("=================================");
                console.log("비교 페이지 리뷰 API 전체 응답");
                console.log("clubId =", clubId);
                console.log("reviewData =", reviewData);
                console.log("reviewData.averageRating =", reviewData?.averageRating);
                console.log("reviewData.data =", reviewData?.data);
                console.log(
                  "reviewData.activityIntensity =",
                  reviewData?.activityIntensity
                );

                console.log(
                  "reviewData.friendshipRatio =",
                  reviewData?.friendshipRatio
                );
                console.log(
                  "reviewData.data?.averageRating =",
                  reviewData?.data?.averageRating
                );
                console.log("=================================");
              } catch (reviewError) {
                console.error(
                  `동아리 ${clubId} 리뷰 조회 실패:`,
                  reviewError
                );
              }

              // 리뷰 API에서 가져온 평균 별점을 최우선으로 사용
              const averageRating =
                reviewData?.averageRating ??
                reviewData?.data?.averageRating ??
                null;

              const activityIntensity =
                reviewData?.activityIntensity ??
                reviewData?.data?.activityIntensity ??
                null;

              const friendshipRatio =
                reviewData?.friendshipRatio ??
                reviewData?.data?.friendshipRatio ??
                null;

              console.log("=================================");
              console.log(`동아리 ${clubId} 리뷰 데이터 최종 확인`);
              console.log("평균 별점 =", averageRating);
              console.log("활동 강도 =", activityIntensity);
              console.log("친목 비중 =", friendshipRatio);
              console.log("=================================");

              const comparisonClub =
                comparisonData.find(
                  (item) => Number(item.clubId) === Number(clubId)
                );

              return normalizeClub({
                ...club,
                ...detail,

                topKeywords:
                  comparisonClub?.topKeywords ?? [],

                avgRating: averageRating,
                averageRating: averageRating,
                rating: averageRating,

                activityIntensity: activityIntensity,
                networkingRatio: friendshipRatio,

                clubId,
                id: clubId,
              });
            } catch (error) {
              console.warn(
                `동아리 ${clubId} 상세/리뷰 조회 실패. 전달받은 데이터를 사용합니다.`,
                error
              );

              return normalizeClub(club);
            }
          })
        );

        if (cancelled) {
          return;
        }

        const uniqueClubs = [];
        const seenIds = new Set();

        detailedClubs.forEach((club) => {
          const clubId = getClubId(club);

          if (
            clubId != null &&
            !seenIds.has(String(clubId))
          ) {
            seenIds.add(String(clubId));
            uniqueClubs.push(club);
          }
        });

        setClubs(
          uniqueClubs.slice(0, MAX_COMPARE_COUNT)
        );
      } catch (error) {
        console.error(
          "비교할 동아리 조회 실패:",
          error
        );

        if (!cancelled) {
          setErrorMessage(
            "선택한 동아리 정보를 불러오지 못했습니다."
          );
          setClubs([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadSelectedClubs();

    return () => {
      cancelled = true;
    };
  }, [location.state]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <>
        <Header />

        <main className="comparison-page">
          <div className="comparison-page__loading">
            동아리 정보를 불러오는 중입니다...
          </div>
        </main>
      </>
    );
  }

  if (errorMessage) {
    return (
      <>
        <Header />

        <main className="comparison-page">
          <div className="comparison-page__message">
            <p>{errorMessage}</p>

            <button
              type="button"
              onClick={handleBack}
            >
              뒤로가기
            </button>
          </div>
        </main>
      </>
    );
  }

  if (clubs.length === 0) {
    return (
      <>
        <Header />

        <main className="comparison-page">
          <div className="comparison-page__message">
            <p>비교할 동아리가 선택되지 않았습니다.</p>

            <button
              type="button"
              onClick={handleBack}
            >
              동아리 선택으로 돌아가기
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="matching-page comparison-page">

        {/* 뒤로가기 */}
        <button
          type="button"
          className="matching-back-button"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          ←
        </button>

        {/* 상단 탭 */}
        <div className="matching-title-tab">
          맞춤 동아리
        </div>


      <section className="comparison-page__content">
        <div
          className="comparison-page__comparison"
          style={{
            "--club-count": clubs.length,
          }}
        >

          <div className="comparison-page__club-header">

            {/* 왼쪽 비교 항목 라벨 공간 */}
            <div className="comparison-page__empty-label" />

            {/* 동아리 카드 */}
            {clubs.map((club) => (
              <ComparisonCard
                key={club.clubId ?? club.id}
                club={club}
              />
            ))}

          </div>


          {/* ==============================
              비교 항목
          ============================== */}

          {COMPARISON_ITEMS.map((item) => (
            <div
              key={item.key}
              className="comparison-page__row"
            >

              <ComparisonLabel
                text={item.label}
                active={item.active}
              />

              {clubs.map((club) => (
                <div
                  key={`${item.key}-${club.clubId ?? club.id}`}
                  className="comparison-page__value"
                >
                  {getComparisonValue(
                    club,
                    item.key,
                    selectedTimes
                  )}
                </div>
              ))}

            </div>
          ))}

        </div>
      </section>


        <section className="comparison-page__compatibility">
          {/* 궁합 부분 들어갈 자리 */}
          <CompatibilitySection clubs={clubs}/>
        </section>
      </main>
    </>
  );
}


function ComparisonLabel({
  text,
  active = false,
}) {
  return (
    <div
      className={
        active
          ? "comparison-page__label comparison-page__label--active"
          : "comparison-page__label"
      }
    >
      {text}
    </div>
  );
}

const DAY_TO_INDEX = {
  월요일: 0,
  화요일: 1,
  수요일: 2,
  목요일: 3,
  금요일: 4,
  토요일: 5,
  일요일: 6,
};

const getActivityAvailability = (
  schedules,
  selectedTimes
) => {
  if (
    !Array.isArray(schedules) ||
    schedules.length === 0 ||
    !Array.isArray(selectedTimes) ||
    selectedTimes.length === 0
  ) {
    return {
      status: 'unavailable',
      text: '활동 불가능',
    };
  }

  let hasAnyOverlap = false;

  /*
   * 동아리 일정 하나하나를 확인
   *
   * 하나라도 내가 선택한 시간 안에
   * 완전히 들어오면 활동 가능
   */
  for (const schedule of schedules) {
    const dayIndex =
      DAY_TO_INDEX[
        schedule.dayOfWeek ?? schedule.day
      ];

    if (
      dayIndex === undefined ||
      !schedule.startTime ||
      !schedule.endTime
    ) {
      continue;
    }

    const [
      startHour,
      startMinute,
    ] = String(schedule.startTime)
      .slice(0, 5)
      .split(':')
      .map(Number);

    const [
      endHour,
      endMinute,
    ] = String(schedule.endTime)
      .slice(0, 5)
      .split(':')
      .map(Number);

    const scheduleStart =
      startHour * 60 + startMinute;

    const scheduleEnd =
      endHour * 60 + endMinute;

    /*
     * 해당 요일에 내가 선택한 시간만 추출
     */
    const selectedDaySlots = selectedTimes
      .filter((key) =>
        key.startsWith(`${dayIndex}-`)
      )
      .map((key) => {
        const [, hour, minute] =
          key.split('-');

        const start =
          Number(hour) * 60 +
          Number(minute);

        return {
          start,
          end: start + 30,
        };
      });

    if (selectedDaySlots.length === 0) {
      continue;
    }

    /*
     * --------------------------------
     * 1. 조금이라도 겹치는지 확인
     * --------------------------------
     */
    const scheduleHasOverlap =
      selectedDaySlots.some(
        (slot) =>
          slot.start < scheduleEnd &&
          slot.end > scheduleStart
      );

    if (scheduleHasOverlap) {
      hasAnyOverlap = true;
    }

    /*
     * --------------------------------
     * 2. 동아리 활동시간 전체가
     *    내가 선택한 시간 안에 있는지 확인
     * --------------------------------
     *
     * 예:
     * 동아리 18:00~20:00
     *
     * 내가
     * 18:00~18:30
     * 18:30~19:00
     * 19:00~19:30
     * 19:30~20:00
     *
     * 선택했다면 → 완전 포함 → 활동 가능
     */
    let fullyCovered = true;

    for (
      let currentTime = scheduleStart;
      currentTime < scheduleEnd;
      currentTime += 30
    ) {
      const slotEnd = Math.min(
        currentTime + 30,
        scheduleEnd
      );

      const isCovered =
        selectedDaySlots.some(
          (slot) =>
            slot.start <= currentTime &&
            slot.end >= slotEnd
        );

      if (!isCovered) {
        fullyCovered = false;
        break;
      }
    }

    /*
     * 하나의 동아리 활동시간이라도
     * 내가 전부 커버하면 활동 가능
     */
    if (fullyCovered) {
      return {
        status: 'available',
        text: '활동 가능!',
      };
    }
  }

  /*
   * 완전히 포함되지는 않았지만
   * 조금이라도 겹쳤다면
   */
  if (hasAnyOverlap) {
    return {
      status: 'adjust',
      text: '시간 조정 필요',
    };
  }

  /*
   * 아예 겹치지 않음
   */
  return {
    status: 'unavailable',
    text: '활동 불가능',
  };
};


function getComparisonValue(
  club,
  key,
  selectedTimes
) {
  switch (key) {
    case "tags":
      return Array.isArray(club.tags) && club.tags.length > 0 ? (
        <div className="comparison-page__tags">
          {club.tags.map((tag, index) => {
            const tagName =
              typeof tag === "string"
                ? tag
                : tag?.name ??
                  tag?.tagName ??
                  tag?.label ??
                  tag?.keywordName ??
                  "";

            if (!tagName) return null;

            return (
              <span
                key={`${tagName}-${index}`}
                className="comparison-page__tag-chip"
              >
                {tagName}
              </span>
            );
          })}
        </div>
      ) : (
        "-"
      );

    case "rating": {
      const rating = Number(
        club.averageRating ??
        club.avgRating ??
        club.rating ??
        0
      );

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: "6px",
          }}
        >
          <StarRating
            value={rating}
            showScore={false}
            size={20}
          />

          <span
            style={{
              fontSize: "19px",
              fontWeight: 700,
              color: "var(--color-star)",
              whiteSpace: "nowrap",
              transform: "translateY(2.5px)",
            }}
          >
            {rating.toFixed(1)}
          </span>
        </div>
      );
    }

    case "favoriteCount":
      return (
        <div className="comparison-page__favorite">
          <svg
            width="22"
            height="21"
            viewBox="0 0 24 21"
            fill="#D4537E"
            stroke="#D4537E"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 19.5L10.55 18.18C5.4 13.56 2 10.5 2 6.75C2 3.72 4.42 1.5 7.5 1.5C9.24 1.5 10.91 2.33 12 3.65C13.09 2.33 14.76 1.5 16.5 1.5C19.58 1.5 22 3.72 22 6.75C22 10.5 18.6 13.56 13.45 18.19L12 19.5Z" />
          </svg>

          <span
            style={{
              fontSize: "19px",
              fontWeight: 700,
              color: "#D4537E",
              whiteSpace: "nowrap",
              transform: "translateY(1px)",
            }}
          >
            {club.favoriteCount ?? 0}
          </span>
        </div>
      );

    case "activityPurpose":
      return (
        <span className="comparison-page__info-text">
          {club.activityPurpose ?? "-"}
        </span>
      );

    case "mainActivity": {
      const mainActivity =
        club.mainActivity ??
        club.activityContent ??
        club.activity ??
        club.activityDescription ??
        "";

      return (
        <span className="comparison-page__info-text">
          {mainActivity}
        </span>
      );
    }

    case "activityIntensity": {
      const value = Number(club.activityIntensity);

      if (!Number.isFinite(value) || value <= 0) {
        return "-";
      }

      return (
        <div className="comparison-page__slider-value">
          <DiscreteSlider
            value={Math.max(1, Math.min(5, value))}
            min={1}
            max={5}
            onChange={() => {}}
          />

          <span className="comparison-page__slider-score">
            {value.toFixed(1)}
          </span>
        </div>
      );
    }

    case "networkingRatio": {
      const value = Number(club.networkingRatio);

      if (!Number.isFinite(value) || value <= 0) {
        return "-";
      }

      return (
        <div className="comparison-page__slider-value">
          <DiscreteSlider
            value={Math.max(1, Math.min(5, value))}
            min={1}
            max={5}
            onChange={() => {}}
          />

          <span className="comparison-page__slider-score">
            {value.toFixed(1)}
          </span>
        </div>
      );
    }

    case "schedules": {
      const schedules = Array.isArray(club.schedules)
        ? club.schedules
        : [];

      const availability = getActivityAvailability(
        schedules,
        selectedTimes
      );

      return (
        <div className="comparison-page__schedule-wrapper">

          {/* 정기 모임 시간 */}
          <span className="comparison-page__info-text comparison-page__schedule-text">
            {schedules.length > 0
              ? schedules
                  .map((schedule) => {
                    const day =
                      schedule.dayOfWeek ??
                      schedule.day ??
                      "";

                    const startTime = schedule.startTime
                      ? String(schedule.startTime).slice(0, 5)
                      : "";

                    const endTime = schedule.endTime
                      ? String(schedule.endTime).slice(0, 5)
                      : "";

                    if (day && startTime && endTime) {
                      return `${day} ${startTime}-${endTime}`;
                    }

                    return `${day} ${
                      startTime || endTime
                    }`.trim();
                  })
                  .filter(Boolean)
                  .map((text, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <br />}
                      {text}
                    </React.Fragment>
                  ))
              : "-"}
          </span>

          {/* 활동 가능 여부 */}
          {schedules.length > 0 && (
            <span
              className={`comparison-page__availability comparison-page__availability--${availability.status}`}
            >
              {availability.text}
            </span>
          )}

        </div>
      );
    }

    case "activityTime":
  return (
    <span className="comparison-page__info-text">
      {club.activityTime ?? "-"}
    </span>
  );

    case "activityPeriod":
      return (
        <span className="comparison-page__info-text">
          {club.activityPeriod ?? "-"}
        </span>
      );

    case "fee":
      return (
        <span className="comparison-page__info-text">
          {club.fee != null
            ? typeof club.fee === "number"
              ? `${club.fee.toLocaleString("ko-KR")}원`
              : club.fee
            : "-"}
        </span>
      );

    case "recruitmentPeriod": {
      const recruitmentPeriod = club.recruitmentPeriod;

      if (!recruitmentPeriod) {
        return (
          <span className="comparison-page__info-text">
            -
          </span>
        );
      }

      if (typeof recruitmentPeriod === "string") {
        return (
          <span className="comparison-page__info-text">
            {recruitmentPeriod}
          </span>
        );
      }

      const recruitStart =
        recruitmentPeriod.start ??
        recruitmentPeriod.recruitStartAt;

      const recruitEnd =
        recruitmentPeriod.end ??
        recruitmentPeriod.recruitEndAt;

      if (recruitStart && recruitEnd) {
        return (
          <span className="comparison-page__info-text">
            {formatComparisonDate(recruitStart)} ~{" "}
            {formatComparisonDate(recruitEnd)}
          </span>
        );
      }

      if (recruitStart) {
        return (
          <span className="comparison-page__info-text">
            {formatComparisonDate(recruitStart)} ~
          </span>
        );
      }

      if (recruitEnd) {
        return (
          <span className="comparison-page__info-text">
            ~ {formatComparisonDate(recruitEnd)}
          </span>
        );
      }

      return (
        <span className="comparison-page__info-text">
          -
        </span>
      );
    }

    case "interviewDifficulty":
      return (
        <span className="comparison-page__info-text">
          {club.interviewDifficulty ?? "-"}
        </span>
      );

    default:
      return "-";
  }
}


function formatComparisonDate(date) {
  if (!date) {
    return "-";
  }

  if (Array.isArray(date)) {
    const [year, month, day] = date;
    return `${year}. ${month}. ${day}.`;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date).slice(0, 10);
  }

  return parsedDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}
