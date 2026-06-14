# MOARI (모아리)

## 📌 프로젝트 소개
대학교 동아리 정보를 쉽게 탐색하고 공유할 수 있는 통합 동아리 플랫폼입니다.

## 🛠️ 개발 환경
- Frontend: React, JavaScript, CSS
- Backend: Node.js, Express.js
- Database: MySQL
- Collaboration: GitHub, Figma, Notion

## 📁 프로젝트 구조
📦 MOARI
├── 📂 MOARI_FE                          # React + Vite 기반 프론트엔드
│   ├── 📂 public                        # 정적 파일
│   └── 📂 src
│       ├── 📂 api                       # 서버 API 통신
│       ├── 📂 components                # 공통 UI 컴포넌트
│       ├── 📂 data                      # 공통 데이터 및 더미 데이터
│       ├── 📂 pages                     # 페이지 컴포넌트
│       ├── 📂 router                    # 페이지 라우팅 설정
│       ├── 📂 styles                    # 전역 스타일 및 CSS
│       ├── 📄 App.jsx                   # 최상위 컴포넌트
│       └── 📄 main.jsx                  # 애플리케이션 진입점
│
└── 📂 MOARI_BE                          # Node.js + Express 기반 백엔드
    ├── 📂 controllers                   # API 요청 처리
    │   ├── authController.js            # 사용자 인증 처리
    │   ├── clubController.js            # 동아리 관련 요청 처리
    │   ├── favoriteController.js        # 찜 기능 요청 처리
    │   ├── reportController.js          # 신고 기능 요청 처리
    │   ├── reviewController.js          # 리뷰 기능 요청 처리
    │   └── userController.js            # 사용자 정보 요청 처리
    │
    ├── 📂 models                        # 데이터베이스 모델 정의
    │   ├── clubModel.js                 # 동아리 데이터 모델
    │   ├── favoriteModel.js             # 찜 데이터 모델
    │   ├── reportModel.js               # 신고 데이터 모델
    │   ├── reviewModel.js               # 리뷰 데이터 모델
    │   └── userModel.js                 # 사용자 데이터 모델
    │
    ├── 📂 routes                        # API 엔드포인트 정의
    │   ├── authRoutes.js                # 인증 API 라우팅
    │   ├── clubRoutes.js                # 동아리 API 라우팅
    │   ├── favoriteRoutes.js            # 찜 API 라우팅
    │   ├── reportRoutes.js              # 신고 API 라우팅
    │   ├── reviewRoutes.js              # 리뷰 API 라우팅
    │   ├── uploadRoutes.js              # 파일 업로드 API 라우팅
    │   └── userRoutes.js                # 사용자 API 라우팅
    │
    ├── 📂 services                      # 비즈니스 로직 처리
    │   ├── authService.js               # 인증 관련 서비스
    │   ├── clubService.js               # 동아리 서비스
    │   ├── favoriteService.js           # 찜 기능 서비스
    │   ├── mailService.js               # 이메일 발송 서비스
    │   ├── reportService.js             # 신고 기능 서비스
    │   ├── reviewService.js             # 리뷰 기능 서비스
    │   └── userService.js               # 사용자 서비스
    │
    ├── 📂 crawlers                      # 외부 데이터 크롤링
    ├── 📂 database                      # DB 연결 및 설정
    ├── 📂 middlewares                   # Express 미들웨어
    ├── 📂 uploads                       # 업로드 파일 저장
    ├── 📄 app.js                        # Express 애플리케이션 설정
    ├── 📄 server.js                     # 서버 실행 진입점
    └── 📄 package.json                  # 프로젝트 의존성 및 설정
```

## 👥 팀원
- 김민경 : 동아리 관리 (동아리 CRUD, 상세 조회, 등록/수정 페이지)
- 이정현 : 사용자 인증 및 회원 관리 (회원가입, 로그인, JWT, 학교 이메일 인증)
- 최은솔 : 동아리 탐색 및 수정 로그(검색, 필터링, 정렬)
- 권수정 : 찜 기능 및 마이페이지, 계정 관리
- 안다현 : 리뷰 및 신고, 동아리 모집 상태 관리

## 📅 개발 기간
2026.03 ~ 2026.06
