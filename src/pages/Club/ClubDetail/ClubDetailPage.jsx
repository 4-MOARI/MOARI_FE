import Header from "../../../components/common/Header/Header";
import ClubInfoSection from './ClubInfoSection';

export default function ClubDetailPage() {
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
          <ClubInfoSection />
        </div>

        {/* 리뷰 영역 */}
        <div style={{ 
          width: '370px', 
          height: '620px', 
          border: '1px solid #E5E7EB', 
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#999',
          backgroundColor: '#FAFAFA'
        }}>
          리뷰 섹션 (작업 대기중)
        </div>
      </div>
      
    </div>
  );
}