import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MOCK_CLUBS } from "../../../data/clubs"; //더미데이터
import Header from "../../../components/common/Header/Header";
import ClubInfoSection from './ClubInfoSection';
import ReviewSection from "../Review/ReviewSection";
import axios from 'axios'; // 1. axios 추가 (서버 통신용)

export default function ClubDetailPage() {
  const { clubId } = useParams();
  console.log('clubId=' , clubId);
  console.log("clubId type=", typeof clubId);
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const location = useLocation();

  useEffect(() => {
  // ★ 1순위: 수정프리뷰에서 바로 넘어온 데이터
  if (location.state) {
    setClub(location.state);
    return;
  }

  // ★ 2순위: localStorage에 저장된 수정 데이터
  const savedClub = localStorage.getItem(`club-${clubId}`);

  if (savedClub) {
    setClub(JSON.parse(savedClub));
    return;
  }

  // ★ 3순위: 기존 더미데이터
  const foundClub = MOCK_CLUBS.find(c => String(c.id) === String(clubId));
  setClub(foundClub || null);
}, [clubId, location.state]);

  /* api시
    const fetchClub = async () => {
      try {
        // 서버의 엔드포인트 주소는 백엔드 팀과 확인하신 주소로 바꾸세요!
        const response = await axios.get(`http://localhost:8080/api/clubs/${clubId}`);
        setClub(response.data); 
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };
    fetchClub();
  }, [clubId]);

  */

  if (!club) return <div>데이터를 불러오는 중입니다...</div>;

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '40px 20px' }}>
        <div style={{ width: '760px' }}>
          <ClubInfoSection club={club}/>
        </div>
        <div>
          <ReviewSection clubId={clubId} clubName={club?.name} />
        </div>
      </div>
    </div>
  );
}