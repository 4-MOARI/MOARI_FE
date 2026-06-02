import './ReportButton.css';

export default function ReportButton({ onClick }) {
  return (
    <button
      className="report-button"
      onClick={onClick}
    >
      신고
    </button>
  );
}