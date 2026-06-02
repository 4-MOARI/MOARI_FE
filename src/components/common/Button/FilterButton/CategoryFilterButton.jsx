import './FilterButton.css';

export default function CategoryFilterButton({ label, isSelected, onClick }) {
  return (
    <button 
      className={`btn-filter category ${isSelected ? 'selected' : 'unselected'}`} 
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}