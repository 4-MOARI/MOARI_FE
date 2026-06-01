// src/components/common/Badge/CategoryBadge/CategoryBadge.jsx
import './CategoryBadge.css';

const CategoryBadge = ({ children }) => {
  return (
    <div className="category-badge">
      {children}
    </div>
  );
};

export default CategoryBadge;