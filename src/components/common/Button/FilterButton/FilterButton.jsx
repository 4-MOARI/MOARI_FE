// src/components/common/Button/FilterButton/FilterButton.jsx
import './FilterButton.css';

export default function FilterButton({ label, isSelected, onClick, type = 'category' }) {
  return (
    <button 
      // type 값에 따라 'category' 또는 'status' 클래스가 붙습니다.
      className={`filter-button ${isSelected ? 'selected' : 'unselected'} ${type}`} 
      onClick={onClick}
    >
      {label}
    </button>
  );
}