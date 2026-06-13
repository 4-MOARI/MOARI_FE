import { useEffect, useState } from 'react';

import './ReportSection.css';

import ReportButton from './ReportButton';
import ReportModal from './ReportModal';
import ReportWarningBox from './ReportWarningBox';

import {
  createReport,
  getReportSummary,
} from '../../../api/reportApi';

export default function ReportSection({
  clubId,
}) {
  // 모달 열림 여부
  const [isReportModalOpen, setIsReportModalOpen]
    = useState(false);

  // 신고 summary 상태
  const [reportSummary, setReportSummary]
    = useState(null);

  // 신고 summary 조회
  const fetchReportSummary = async () => {
    try {
      const data =
        await getReportSummary(clubId);

        console.log('reportSummary API 응답 = ', data);

      setReportSummary(data);

    } catch (error) {
      console.error(error);
    }
  };

  // 상세페이지 들어오면 summary 조회
  useEffect(() => {
  if (clubId) {
    fetchReportSummary();
    }
  }, [clubId]);

  // 신고 제출
  const handleReportSubmit = async (
    reportData
  ) => {
    try {

      // 신고 API 호출
      await createReport(
        clubId,
        reportData
      );

      // 신고 상태 다시 조회
      await fetchReportSummary();

      // 모달 닫기
      setIsReportModalOpen(false);

      alert('신고가 접수되었습니다.');

    } catch (error) {

      const errorCode =
        error.response?.data?.error?.code;

      if (errorCode === 'REPORT_409') {
        alert(
          '이미 신고한 동아리입니다.'
        );
        return;
      }

      if (errorCode === 'CLUB_404') {
        alert(
          '존재하지 않는 동아리입니다.'
        );
        return;
      }

      alert(
        '신고 처리 중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <>
      <div className="report-section">

        {/* 신고 상태칸 */}
        
        <ReportWarningBox
            isWarningTarget={
                reportSummary?.isWarningTarget
            }
            totalReportCount={
                reportSummary?.totalReportCount ?? 0
            }
            mostFrequentReason={
                reportSummary?.mostFrequentReason
            }
        />

        {/* 신고 버튼 */}
        <ReportButton
          onClick={() =>
            setIsReportModalOpen(true)
          }
        />

      </div>

      {/* 신고 모달 */}
      {isReportModalOpen && (
        <ReportModal
          onClose={() =>
            setIsReportModalOpen(false)
          }

          onSubmit={handleReportSubmit}
        />
      )}
    </>
  );
}