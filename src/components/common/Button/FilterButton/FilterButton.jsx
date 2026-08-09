// src/components/common/Button/FilterButton/FilterButton.jsx
import './FilterButton.css';

export default function FilterButton({ label, isSelected, onClick, type = 'category' }) {
  return (
    <button 
      className={`filter-button ${isSelected ? 'selected' : 'unselected'} ${type}`} 
      onClick={onClick}
    >
      {label}
    </button>
  );
}