// src/components/common/Button/FilterButton/CategoryFilterButton.jsx
import React from 'react';

const CategoryFilterButton = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 10px',
        borderRadius: '17px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '14px',
        fontFamily: 'Inter',
       
        transition: 'background 0.2s ease, color 0.2s ease, transform 0.1s ease',
        background: isActive ? '#534AB7' : '#EEEDFE',
        color: isActive ? 'white' : '#534AB7',
      }}
      // 클릭 시 눌리는 효과
      onMouseDown={(e) => (e.target.style.transform = 'scale(0.7)')}
      // 마우스를 뗄 때 원래 크기로
      onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
      // 마우스가 버튼 밖으로 나가버려도 원래 크기로 복구
      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
    >
      {label}
    </button>
  );
};

export default CategoryFilterButton;