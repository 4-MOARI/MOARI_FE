import React, { useState } from 'react';

const StyledButton = ({ onClick, children, type = "button", variant = "primary" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const primaryStyle = {
    background: isHovered ? '#6A62C7' : '#534AB7',
    color: 'white',
    border: 'none',
  };

  const secondaryStyle = {
    background: isHovered ? '#E5E7EB' : '#F3F4F6',
    color: '#374151',
    border: '1px solid #D1D5DB',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100px',
        height: '46px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '700',
        transition: 'all 0.3s ease',
        boxShadow: isHovered ? '0px 4px 12px rgba(83, 74, 183, 0.4)' : 'none',
        ...(variant === 'primary' ? primaryStyle : secondaryStyle)
      }}
    >
      {children}
    </button>
  );
};

export default StyledButton;