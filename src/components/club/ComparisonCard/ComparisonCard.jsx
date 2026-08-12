import React from "react";
import "./ComparisonCard.css";

import CategoryBadge from "../../common/Badge/CategoryBadge/CategoryBadge";
import RecruitStatusBadge from "../../common/Badge/RecruitStatusBadge/RecruitStatusBadge";


const ComparisonCard = ({ club, comparisonKey }) => {
  if (!club) {
    return null;
  }


  // ==================================================
  // 기본 정보
  // ==================================================

  const clubName =
    club.clubName ??
    club.name ??
    "-";

  const profileImageUrl =
    club.profileImageUrl ??
    club.profileImage ??
    "";

  const categoryName =
    club.categoryName ??
    club.category?.name ??
    club.category ??
    "기타";


  // ==================================================
  // 모집 상태
  // 상세페이지와 동일하게 날짜 기준으로 판단
  // ==================================================

  const recruitStartDate =
    club.recruitStartAt ??
    club.recruitPeriod?.start;

  const recruitEndDate =
    club.recruitEndAt ??
    club.recruitPeriod?.end;


  const getRecruitStatusByDate = (
    startDate,
    endDate
  ) => {
    if (!startDate || !endDate) {
      return "마감";
    }

    const now = new Date();

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return "마감";
    }

    end.setHours(23, 59, 59, 999);

    return now >= start && now <= end
      ? "모집중"
      : "마감";
  };


  const statusToDisplay =
    getRecruitStatusByDate(
      recruitStartDate,
      recruitEndDate
    );


  // ==================================================
  // 태그
  // ==================================================

  const tags =
    Array.isArray(club.tags)
      ? club.tags
      : Array.isArray(club.tagList)
        ? club.tagList
        : [];


  // ==================================================
  // 별점
  // ==================================================

  const rating =
    typeof club.rating === "number"
      ? club.rating
      : typeof club.averageRating === "number"
        ? club.averageRating
        : typeof club.avgRating === "number"
          ? club.avgRating
          : typeof club.reviewRating === "number"
            ? club.reviewRating
            : null;


  // ==================================================
  // 찜
  // ==================================================

  const favoriteCount =
    club.favoriteCount ??
    club.likeCount ??
    0;


  // ==================================================
  // 비교 데이터
  // ==================================================

  // 1. 활동 내용
  const activityContent =
    club.activityContent ??
    club.activity ??
    club.activityDescription ??
    club.activityType ??
    "-";


  // 2. 활동 분야 / 방식
  const activityType =
    club.activityType ??
    club.activityCategory ??
    club.activityField ??
    club.field ??
    "-";


  // 3. 활동 시간
  const activityTime =
    club.activityTime ??
    club.meetingTime ??
    club.regularActivityTime ??
    getScheduleText(club.schedules);


  // 4. 활동 기간
  const activityPeriod =
    club.activityPeriod ??
    club.activityDuration ??
    club.period ??
    club.duration ??
    "-";


  // 5. 모집 기간
  const recruitmentPeriod =
    club.recruitmentPeriod ??
    club.recruitPeriod ??
    (
      recruitStartDate ||
      recruitEndDate
        ? {
            start: recruitStartDate,
            end: recruitEndDate,
          }
        : null
    );


  const recruitmentPeriodText =
    formatRecruitmentPeriod(
      recruitmentPeriod
    );


  // 6. 모집 시기
  const recruitmentSeason =
    club.recruitmentSeason ??
    club.recruitSeason ??
    club.recruitmentSchedule ??
    getRecruitmentSeason(
      recruitStartDate,
      recruitEndDate
    );


  // 7. 회비
  const fee =
    club.fee ??
    club.clubFee ??
    club.membershipFee ??
    club.registrationFee ??
    "-";


  // 8. 면접 난이도
  const interviewDifficulty =
    club.interviewDifficulty ??
    club.interviewLevel ??
    club.interviewDifficultyLevel ??
    "-";


  // ==================================================
  // 렌더링
  // ==================================================

  return (
    <div className="comparison-card">

      <div className="comparison-card__top">

        {/* 이미지 */}
        <div className="comparison-card__image">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={`${clubName} 프로필`}
            />
          ) : (
            <span>IMG</span>
          )}
        </div>


        {/* 오른쪽 배지 */}
        <div className="comparison-card__badges">

          <CategoryBadge>
            {categoryName}
          </CategoryBadge>

          <RecruitStatusBadge
            status={statusToDisplay}
          />

        </div>


        {/* 동아리 이름 */}
        <div className="comparison-card__name">
          {clubName}
        </div>

      </div>

    </div>
  );

};


/* ==================================================
   비교 행
================================================== */

const ComparisonRow = ({
  value,
  last = false,
}) => {

  return (
    <div
      className={
        last
          ? "comparison-card__row comparison-card__row--last"
          : "comparison-card__row"
      }
    >
      <span>
        {value === null ||
        value === undefined ||
        value === ""
          ? "-"
          : value}
      </span>
    </div>
  );
};


/* ==================================================
   스케줄
================================================== */

const getScheduleText = (
  schedules
) => {

  if (
    !Array.isArray(schedules) ||
    schedules.length === 0
  ) {
    return "-";
  }


  return schedules
    .map((schedule) => {

      if (!schedule) {
        return null;
      }


      const day =
        schedule.dayOfWeek ??
        schedule.day ??
        "";


      const start =
        schedule.startTime
          ? String(
              schedule.startTime
            ).slice(0, 5)
          : "";


      const end =
        schedule.endTime
          ? String(
              schedule.endTime
            ).slice(0, 5)
          : "";


      if (
        !day &&
        !start &&
        !end
      ) {
        return null;
      }


      if (
        day &&
        start &&
        end
      ) {
        return `${day} ${start}-${end}`;
      }


      if (
        day &&
        start
      ) {
        return `${day} ${start}`;
      }


      return (
        day ||
        start ||
        end
      );
    })
    .filter(Boolean)
    .join(" / ");
};


/* ==================================================
   모집 기간
================================================== */

const formatRecruitmentPeriod = (
  period
) => {

  if (!period) {
    return "-";
  }


  if (
    typeof period === "string"
  ) {
    return period;
  }


  const start =
    period.start ??
    period.recruitStartAt;


  const end =
    period.end ??
    period.recruitEndAt;


  if (!start && !end) {
    return "-";
  }


  if (
    start &&
    end
  ) {
    return `${formatDate(start)} ~ ${formatDate(end)}`;
  }


  if (start) {
    return `${formatDate(start)} ~`;
  }


  return `~ ${formatDate(end)}`;
};


/* ==================================================
   날짜
================================================== */

const formatDate = (
  date
) => {

  if (!date) {
    return "-";
  }


  if (Array.isArray(date)) {

    const [
      year,
      month,
      day
    ] = date;


    return `${year}. ${month}. ${day}.`;
  }


  const parsedDate =
    new Date(date);


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return String(date)
      .slice(0, 10);
  }


  return parsedDate.toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
  );
};


/* ==================================================
   모집 시기
================================================== */

const getRecruitmentSeason = (
  startDate,
  endDate
) => {

  if (
    !startDate &&
    !endDate
  ) {
    return "-";
  }


  const dates =
    [
      startDate,
      endDate
    ]
      .filter(Boolean)
      .map(
        (date) =>
          new Date(date)
      )
      .filter(
        (date) =>
          !Number.isNaN(
            date.getTime()
          )
      );


  if (
    dates.length === 0
  ) {
    return "-";
  }


  const months =
    [
      ...new Set(
        dates.map(
          (date) =>
            `${date.getMonth() + 1}월`
        )
      )
    ];


  return months.join("/");
};


/* ==================================================
   회비
================================================== */

const formatFee = (
  fee
) => {

  if (
    fee === null ||
    fee === undefined ||
    fee === ""
  ) {
    return "-";
  }


  if (
    typeof fee === "number"
  ) {
    return `${fee.toLocaleString("ko-KR")}원`;
  }


  return fee;
};


/* ==================================================
   별점
================================================== */



const getStars = (
  rating
) => {

  const rounded =
    Math.max(
      0,
      Math.min(
        5,
        Math.round(
          Number(rating)
        )
      )
    );


  return (
    "★".repeat(rounded) +
    "☆".repeat(5 - rounded)
  );
};

export default ComparisonCard;