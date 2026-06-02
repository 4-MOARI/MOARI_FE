import { useState } from 'react';
import './ReportModal.css';

const REPORT_OPTIONS = [
  {
    label: '허위 정보',
    code: 'FALSE_INFO',
  },
  {
    label: '부적절한 광고',
    code: 'ADVERTISEMENT',
  },
  {
    label: '차별·혐오',
    code: 'HATE_SPEECH',
  },
  {
    label: '기타',
    code: 'ETC',
  },
];

export default function ReportModal({
  onClose,
  onSubmit,
}) {
  const [selectedReason, setSelectedReason] = useState(REPORT_OPTIONS[0]);
  const [detail, setDetail] = useState('');

  const handleSubmit = () => {
    if (!selectedReason.code) {
        alert('신고 사유를 선택해주세요.');
        return;
    }

    if (
        selectedReason.code === 'ETC' &&
        !detail.trim()
    ) {
        alert('기타 사유는 상세 내용을 입력해주세요.');
        return;
    }

    onSubmit({
        reasonCode: selectedReason.code,
        customReason:
        selectedReason.code === 'ETC'
            ? detail
            : null,
        });
    };

  return (
    <div 
        className="report-modal-overlay"
        onClick={onClose}>
      <div 
        className="report-modal"
        onClick={(e) => e.stopPropagation()}>

        <h2 className="report-title">
          동아리 신고
        </h2>

        <div className="report-option-list">
          {REPORT_OPTIONS.map((option) => (
            <button
              key={option.code}
              className={`report-option-button ${
                selectedReason.code === option.code ? 'selected' : ''
              }`}
              onClick={() => setSelectedReason(option)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <textarea
          className="report-detail-input"
          placeholder="상세 내용"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />

        <button
          className="report-submit-button"
          onClick={handleSubmit}
        >
          신고 접수
        </button>

      </div>
    </div>
  );
}