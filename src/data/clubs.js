export const MOCK_CLUBS = [
  // 1. 학술
  { id: "1", name: "학술 연구회", oneLineIntro: "깊이 있는 학문 탐구", description: "학술 연구와 토론을 즐기는 동아리입니다.", activityContent: "정기 세미나, 논문 리뷰", category: "학술", status: "모집중", affiliation: "성신여자대학교", links: { instagram: "#", discord: "", notion: "#" } },
  { id: "2", name: "철학 산책", oneLineIntro: "고전으로 보는 세상", description: "고전 철학을 함께 공부합니다.", activityContent: "독서 토론", category: "학술", status: "마감", affiliation: "성신여자대학교", links: { instagram: "#", discord: "", notion: "" } },
  { id: "3", name: "역사 탐방대", oneLineIntro: "역사 속으로 떠나는 여행", description: "한국사 및 세계사를 공부합니다.", activityContent: "답사, 발표회", category: "학술", status: "모집중", affiliation: "외부", links: { instagram: "#", discord: "", notion: "" } },
  { id: "4", name: "언어학 연구소", oneLineIntro: "언어의 구조를 파헤치다", description: "다양한 언어 구조를 연구합니다.", activityContent: "논문 분석", category: "학술", status: "마감", affiliation: "외부", links: { instagram: "#", discord: "", notion: "" } },
  
  // 2. 체육
  { id: "5", name: "스포츠 매니아", oneLineIntro: "함께 땀 흘리는 즐거움", description: "다양한 스포츠 활동을 함께합니다.", activityContent: "정기 운동", category: "체육", status: "모집중", affiliation: "성신여자대학교", links: { instagram: "#", discord: "", notion: "" } },
  { id: "6", name: "런닝 크루", oneLineIntro: "함께 달리는 성신인", description: "캠퍼스를 달리는 모임입니다.", activityContent: "정기 러닝", category: "체육", status: "마감", affiliation: "성신여자대학교", links: { instagram: "#", discord: "", notion: "" } },
  { id: "7", name: "테니스 파티", oneLineIntro: "코트 위의 주인공", description: "초보자부터 숙련자까지 즐기는 모임.", activityContent: "레슨", category: "체육", status: "모집중", affiliation: "외부", links: { instagram: "#", discord: "", notion: "" } },
  { id: "8", name: "요가 클럽", oneLineIntro: "몸과 마음의 평온", description: "요가와 명상을 합니다.", activityContent: "정기 수련", category: "체육", status: "마감", affiliation: "외부", links: { instagram: "#", discord: "", notion: "" } },

  // 3. 공연·예술
  { id: "9", name: "공연 예술단", oneLineIntro: "무대 위에서 빛나는 순간", description: "예술을 사랑하는 모임.", activityContent: "연습", category: "공연·예술", status: "모집중", affiliation: "성신여자대학교", links: { instagram: "#", discord: "", notion: "" } },
  { id: "10", name: "밴드 합주부", oneLineIntro: "음악으로 소통하는 곳", description: "악기 연주와 합주.", activityContent: "공연 준비", category: "공연·예술", status: "마감", affiliation: "성신여자대학교", links: { instagram: "#", discord: "", notion: "" } },
  { id: "11", name: "캔버스 위로", oneLineIntro: "그림으로 표현하는 우리", description: "다양한 화법을 배웁니다.", activityContent: "스케치", category: "공연·예술", status: "모집중", affiliation: "외부", links: { instagram: "#", discord: "", notion: "" } },
  { id: "12", name: "사진 공작소", oneLineIntro: "빛을 담는 기록가", description: "사진 촬영과 보정.", activityContent: "출사", category: "공연·예술", status: "마감", affiliation: "외부", links: { instagram: "#", discord: "", notion: "" } },

  // 4. 봉사
  { id: "13", name: "나눔 봉사단", oneLineIntro: "따뜻한 세상을 만들어요", description: "지역 사회 봉사.", activityContent: "환경 정화", category: "봉사", status: "모집중", affiliation: "성신여자대학교", links: { instagram: "", discord: "", notion: "#" } },
  { id: "14", name: "희망 도우미", oneLineIntro: "함께 나누는 기쁨", description: "노인 복지 봉사.", activityContent: "배식 봉사", category: "봉사", status: "마감", affiliation: "성신여자대학교", links: { instagram: "", discord: "", notion: "#" } },
  { id: "15", name: "꿈꾸는 도우미", oneLineIntro: "아이들의 꿈을 응원합니다", description: "교육 멘토링.", activityContent: "학습 지도", category: "봉사", status: "모집중", affiliation: "외부", links: { instagram: "", discord: "", notion: "#" } },
  { id: "16", name: "사랑의 집", oneLineIntro: "가치 있는 나눔 실천", description: "집짓기 봉사.", activityContent: "현장 봉사", category: "봉사", status: "마감", affiliation: "외부", links: { instagram: "", discord: "", notion: "#" } },

  // 5. 취미·친목
  { id: "17", name: "취미 공유회", oneLineIntro: "일상 속의 소소한 즐거움", description: "서로의 취미 공유.", activityContent: "전시회 관람", category: "취미·친목", status: "모집중", affiliation: "성신여자대학교", links: { instagram: "#", discord: "#", notion: "" } },
  { id: "18", name: "카페 탐방", oneLineIntro: "커피와 함께하는 대화", description: "카페 투어 모임.", activityContent: "카페 방문", category: "취미·친목", status: "마감", affiliation: "성신여자대학교", links: { instagram: "#", discord: "", notion: "" } },
  { id: "19", name: "보드게임 아지트", oneLineIntro: "전략과 재미의 세계", description: "전략 게임 모임.", activityContent: "대회", category: "취미·친목", status: "모집중", affiliation: "외부", links: { instagram: "#", discord: "", notion: "" } },
  { id: "20", name: "독서 모임", oneLineIntro: "책을 사랑하는 사람들", description: "소설 독서 모임.", activityContent: "토론", category: "취미·친목", status: "마감", affiliation: "외부", links: { instagram: "#", discord: "", notion: "" } },

  // 6. 창업·취업
  { id: "21", name: "커리어 빌더", oneLineIntro: "함께 성장하는 미래", description: "취업 준비 모임.", activityContent: "스터디", category: "창업·취업", status: "모집중", affiliation: "성신여자대학교", links: { instagram: "", discord: "", notion: "#" } },
  { id: "22", name: "면접 대비반", oneLineIntro: "자신감 있는 면접", description: "면접 실전 연습.", activityContent: "모의 면접", category: "창업·취업", status: "마감", affiliation: "성신여자대학교", links: { instagram: "", discord: "", notion: "#" } },
  { id: "23", name: "스타트업 연구소", oneLineIntro: "아이디어를 현실로", description: "창업 아이템 기획.", activityContent: "멘토링", category: "창업·취업", status: "모집중", affiliation: "외부", links: { instagram: "", discord: "", notion: "#" } },
  { id: "24", name: "투자 스터디", oneLineIntro: "경제 지식 탐구", description: "재테크와 투자 공부.", activityContent: "분석", category: "창업·취업", status: "마감", affiliation: "외부", links: { instagram: "", discord: "", notion: "#" } },

  // 7. 어학
  { id: "25", name: "글로벌 톡톡", oneLineIntro: "언어의 장벽을 넘어서", description: "다양한 언어 대화.", activityContent: "프리토킹", category: "어학", status: "모집중", affiliation: "성신여자대학교", links: { instagram: "#", discord: "#", notion: "" } },
  { id: "26", name: "토익 정복기", oneLineIntro: "고득점 목표 달성", description: "토익 스터디.", activityContent: "모의고사", category: "어학", status: "마감", affiliation: "성신여자대학교", links: { instagram: "#", discord: "", notion: "" } },
  { id: "27", name: "영미권 탐구", oneLineIntro: "문화와 언어를 동시에", description: "영화로 배우는 영어.", activityContent: "쉐도잉", category: "어학", status: "모집중", affiliation: "외부", links: { instagram: "#", discord: "", notion: "" } },
  { id: "28", name: "중국어 초보", oneLineIntro: "기초부터 차근차근", description: "중국어 입문.", activityContent: "회화 연습", category: "어학", status: "마감", affiliation: "외부", links: { instagram: "#", discord: "", notion: "" } },

  // 8. 기타
  { id: "29", name: "무엇이든 해보자", oneLineIntro: "우리의 모든 가능성", description: "자유 프로젝트.", activityContent: "자유 활동", category: "기타", status: "모집중", affiliation: "성신여자대학교", links: { instagram: "", discord: "", notion: "" } },
  { id: "30", name: "제로 웨이스트", oneLineIntro: "친환경 라이프 실천", description: "환경 캠페인.", activityContent: "캠페인", category: "기타", status: "마감", affiliation: "성신여자대학교", links: { instagram: "", discord: "", notion: "" } },
  { id: "31", name: "미래 지향", oneLineIntro: "더 나은 내일을 위해", description: "미래 연구.", activityContent: "세미나", category: "기타", status: "모집중", affiliation: "외부", links: { instagram: "", discord: "", notion: "" } },
  { id: "32", name: "요리조리", oneLineIntro: "함께 만드는 행복", description: "요리 동아리.", activityContent: "정기 요리", category: "기타", status: "마감", affiliation: "외부", links: { instagram: "", discord: "", notion: "" } }
];