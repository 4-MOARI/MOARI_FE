import Header from "../../../components/common/Header/Header";
import ClubInfoSection from './ClubInfoSection';
import ReviewSection from "../Review/ReviewSection";
import { useParams } from "react-router-dom";

export default function ClubDetailPage() {
  const {clubId} = useParams();
  console.log('clubId = ', clubId);
  return (
    <div>
      
      {/* 상단바 */}
      <Header />

      {/* 2. 본문 영역 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '40px', 
        padding: '40px 20px', 
        alignItems: 'flex-start' 
      }}>
        
        {/* 동아리 상세 정보 */}
        <div style={{ width: '760px' }}>
          <ClubInfoSection club={club}/>
        </div>

        {/* 리뷰 영역 */}
        {/*<div style={{ 
          width: '370px', 
          height: '620px', 
          border: '1px solid #E5E7EB', 
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#999',
          backgroundColor: '#FAFAFA'
        }}>*/}
        <div>
          <ReviewSection 
            clubId= {clubId}
            clubName={club?.clubName} />
        </div>
        
      </div>
      
    </div>
  );
}