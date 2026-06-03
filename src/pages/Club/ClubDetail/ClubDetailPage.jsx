import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MOCK_CLUBS } from "../../../data/clubs"; //더미데이터
import Header from "../../../components/common/Header/Header";
import ClubInfoSection from './ClubInfoSection';
import ReviewSection from "../Review/ReviewSection";
import axios from 'axios'; // 1. axios 추가 (서버 통신용)

export default function ClubDetailPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);

  useEffect(() => {
    // 2. 서버에서 실제 데이터를 가져오는 함수
    const foundClub = MOCK_CLUBS.find(c => c.id === clubId);
    setClub(foundClub || null);
  }, [clubId]);

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