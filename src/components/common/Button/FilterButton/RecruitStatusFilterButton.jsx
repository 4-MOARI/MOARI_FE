import './FilterButton.css';

export default function RecruitStatusFilterButton({ label, isSelected, onClick }) {
  return (
    <button 
      className={`btn-filter status ${isSelected ? 'selected' : 'unselected'}`} 
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}