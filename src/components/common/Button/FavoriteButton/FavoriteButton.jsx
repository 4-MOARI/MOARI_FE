import { Heart } from 'lucide-react';

import './FavoriteButton.css';

function FavoriteButton({
  count,
  isActive = false,
  disabled = false,
  onClick,
  label = '찜',
  showCount = true,
  size = 14,
  strokeWidth = 1.8,
  className = '',
}) {
  const Component = onClick ? 'button' : 'span';
  const interactiveProps = onClick
    ? {
        type: 'button',
        disabled,
        onClick,
      }
    : {};

  return (
    <Component
      className={`favorite-button${isActive ? ' active' : ''}${className ? ` ${className}` : ''}`}
      aria-label={label}
      {...interactiveProps}
    >
      <Heart
        size={size}
        fill={isActive ? 'currentColor' : 'none'}
        strokeWidth={isActive ? 0 : strokeWidth}
      />
      {showCount && <span>({Number(count || 0)})</span>}
    </Component>
  );
}

export default FavoriteButton;
