// src/components/common/Button/FilterButton/RecruitStatusFilterButton.jsx
import React from 'react';

const RecruitStatusFilterButton = ({ status, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '44px',           
        height: '25px',         
        borderRadius: '17px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0',            // 내부 패딩 대신 중앙 정렬 사용
        fontWeight: '700',
        fontSize: '12px',        
        fontFamily: 'Inter',
        // transition을 세분화하여 transform 애니메이션이 부드럽게 적용되도록 수정
        transition: 'background 0.2s ease, color 0.2s ease, transform 0.1s ease',
        
        // 활성화 시 #1F116D, 비활성화 시 #EDECFF
        background: isActive ? '#1F116D' : '#EDECFF',
        color: isActive ? 'white' : '#A19DD5', // 비활성화 시 글자색은 연보라
      }}
      // 클릭 시 눌리는 효과
      onMouseDown={(e) => (e.target.style.transform = 'scale(0.7)')}
      onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
    >
      {status}
    </button>
  );
};

export default RecruitStatusFilterButton;
