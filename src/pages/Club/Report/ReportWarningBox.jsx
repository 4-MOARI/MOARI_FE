import './ReportWarningBox.css';

export default function ReportWarningBox({
  reportCount,
  mainReason,
}) {
  const isDangerClub = reportCount >= 5;

  return (
    <div className="report-warning-box">
      {isDangerClub ? (
        <>
          신고 {reportCount}회 누적 동아리입니다.
          {' '}
          (주요 신고 사유 : {mainReason})
        </>
      ) : (
        <>
          현재 누적 신고 내역이 없는 동아리입니다.
        </>
      )}
    </div>
  );
}