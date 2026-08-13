import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from '../../components/common/Header/Header';
import ComparisonCard from "../../components/club/ComparisonCard/ComparisonCard";

import { getClubDetail } from "../../api/clubApi";
import { getClubReviews } from "../../api/reviewApi";
import { getComparisonData } from "../../api/comparisonApi";

import "./ComparisonPage.css";
import StarRating from "../../components/common/StarRating/StarRating";

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

/**
 * 상세 API 응답을 비교 카드에서 사용할 형태로 통일합니다.
 *
 * 실제 API에 없는 값은 임의로 만들지 않고 null로 둡니다.
 */
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
      ? schedules
          .map((schedule) => {
            const day = schedule.dayOfWeek ?? "";
            const start = schedule.startTime
              ? String(schedule.startTime).slice(0, 5)
              : "";
            const end = schedule.endTime
              ? String(schedule.endTime).slice(0, 5)
              : "";

            if (!day && !start && !end) {
              return null;
            }

            if (start && end) {
              return `${day} ${start}-${end}`;
            }

            return `${day} ${start || end}`.trim();
          })
          .filter(Boolean)
          .join(" / ")
      : data.activityTime ??
        data.meetingTime ??
        data.activity ??
        null;

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
      data.activityPeriod ??
      data.activityDuration ??
      data.period ??
      null,

    activityTime,

    fee:
      data.fee ??
      data.clubFee ??
      data.membershipFee ??
      null,

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

    activityPurpose:
      data.activityPurpose ??
      data.purpose ??
      null,

    activityIntensity:
      data.activityIntensity ??
      data.intensity ??
      null,

    networkingRatio:
      data.networkingRatio ??
      data.socialRatio ??
      data.friendshipRatio ??
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

              console.log(
                "최종 averageRating =",
                averageRating
              );

              console.log(
                `동아리 ${clubId} 최종 비교용 별점 =`,
                averageRating
              );

              const activityIntensity =
                reviewData?.activityIntensity ??
                reviewData?.data?.activityIntensity ??
                null;

              const friendshipRatio =
                reviewData?.friendshipRatio ??
                reviewData?.data?.friendshipRatio ??
                null;

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
                friendshipRatio: friendshipRatio,

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

      <main className="comparison-page">
        <div className="comparison-page__top">
          <button
            type="button"
            className="comparison-page__back"
            onClick={handleBack}
            aria-label="뒤로가기"
          >
            ←
          </button>

          <div className="comparison-page__tab">
            맞춤 동아리
          </div>
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
                    item.key
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

function getComparisonValue(club, key) {
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
      return Array.isArray(club.tags)
        ? club.tags
            .map((tag) =>
              typeof tag === "string"
                ? tag
                : tag?.keywordName ??
                  tag?.name ??
                  tag?.tagName ??
                  tag?.label
            )
            .filter(Boolean)
            .join(", ")
        : "-";

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
      return (
        <div className="comparison-page__favorite">
          <svg
            width="24"
            height="21"
            viewBox="0 0 24 21"
            fill="#D4537E"
            stroke="#D4537E"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 19.5L10.55 18.18C5.4 13.56 2 10.5 2 6.75C2 3.72 4.42 1.5 7.5 1.5C9.24 1.5 10.91 2.33 12 3.65C13.09 2.33 14.76 1.5 16.5 1.5C19.58 1.5 22 3.72 22 6.75C22 10.5 18.6 13.56 13.45 18.19L12 19.5Z" />
          </svg>

          <span>{club.favoriteCount ?? 0}</span>
        </div>
      );

    case "activityPurpose":
      return club.activityPurpose ?? "-";

    case "mainActivity":
      return (
        club.activityContent ??
        club.activity ??
        club.activityDescription ??
        "-"
      );

    case "activityIntensity":
      return club.activityIntensity ?? "-";

    case "networkingRatio":
      return club.networkingRatio ?? "-";

    case "schedules":
      return Array.isArray(club.schedules)
        ? club.schedules
            .map((schedule) => {
              const day =
                schedule.dayOfWeek ??
                schedule.day ??
                "";

              const start = schedule.startTime
                ? String(schedule.startTime).slice(0, 5)
                : "";

              const end = schedule.endTime
                ? String(schedule.endTime).slice(0, 5)
                : "";

              if (day && start && end) {
                return `${day} ${start}-${end}`;
              }

              return `${day} ${start || end}`.trim();
            })
            .filter(Boolean)
            .join(" / ")
        : "-";

    case "activityTime":
      return club.activityTime ?? "-";

    case "activityPeriod":
      return club.activityPeriod ?? "-";

    case "fee":
      return club.fee != null
        ? typeof club.fee === "number"
          ? `${club.fee.toLocaleString("ko-KR")}원`
          : club.fee
        : "-";

    case "recruitmentPeriod":
      if (!club.recruitmentPeriod) {
        return "-";
      }

      if (typeof club.recruitmentPeriod === "string") {
        return club.recruitmentPeriod;
      }

      const start =
        club.recruitmentPeriod.start ??
        club.recruitmentPeriod.recruitStartAt;

      const end =
        club.recruitmentPeriod.end ??
        club.recruitmentPeriod.recruitEndAt;

      if (start && end) {
        return `${formatComparisonDate(start)} ~ ${formatComparisonDate(end)}`;
      }

      if (start) {
        return `${formatComparisonDate(start)} ~`;
      }

      if (end) {
        return `~ ${formatComparisonDate(end)}`;
      }

      return "-";

    case "interviewDifficulty":
      return club.interviewDifficulty ?? "-";

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
