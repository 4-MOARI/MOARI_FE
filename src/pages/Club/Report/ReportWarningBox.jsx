import './ReportWarningBox.css';

export default function ReportWarningBox({
  totalReportCount,
  mostFrequentReason,
}) {
  const reasonMap = {
    FALSE_INFO: '허위 정보',
    ADVERTISEMENT: '광고/홍보',
    HATE_SPEECH: '혐오·비방 표현',
    ETC: '기타',
    
  };
  const isDangerClub = totalReportCount >= 5;

  return (
    <div className="report-warning-box">
      {isDangerClub ? (
        <>
          신고 {totalReportCount}회 누적 동아리입니다.
          {' '}
          (주요 신고 사유 : {reasonMap[mostFrequentReason] || mostFrequentReason })
        </>
      ) : (
        <>
          현재 누적 신고 내역이 없는 동아리입니다.
        </>
      )}
    </div>
  );
}