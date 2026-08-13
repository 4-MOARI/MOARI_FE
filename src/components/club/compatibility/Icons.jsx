// 디자인 명세에 등장하는 아이콘들을 재사용 가능한 컴포넌트로 분리했습니다.
// size, color 를 props로 받아서 여러 곳(리뷰 모달, 궁합 섹션)에서 공유해서 씁니다.

// 전구 아이콘 - "AI 추천" 문구 앞, 추천이유/종합 코멘트 앞에 쓰임
export function LightbulbIcon({ size = 16, color = '#EDB43A' }) {
  const height = Math.round(size * 1.375 * 10) / 10; // 원본 16:22 비율 유지

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 16 22"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 1C4.13 1 1 4.13 1 8C1 10.38 2.19 12.47 4 13.74V16.5C4 17.05 4.45 17.5 5 17.5H11C11.55 17.5 12 17.05 12 16.5V13.74C13.81 12.47 15 10.38 15 8C15 4.13 11.87 1 8 1Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 20.5H10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 17.5H10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 체크 아이콘 - AI 추천 조합 카드 제목 앞
export function CheckIcon({ size = 24, color = '#534AB7' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 13L9 17L19 7"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 돋보기 아이콘 - "내가 직접 고르는 맞춤 궁합" 제목 앞
export function SearchIcon({ size = 19, color = '#0F172A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 19 19" fill="none" aria-hidden="true">
      <path
        d="M7.5 14C11.0899 14 14 11.0899 14 7.5C14 3.91015 11.0899 1 7.5 1C3.91015 1 1 3.91015 1 7.5C1 11.0899 3.91015 14 7.5 14Z"
        stroke={color}
        strokeWidth="2"
      />
      <path d="M12.5 12.5L17.5 17.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}