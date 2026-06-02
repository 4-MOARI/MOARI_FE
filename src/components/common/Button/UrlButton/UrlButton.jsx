import './UrlButton.css';

export default function UrlButton({ type = 'default', url, label }) {
  const labels = {
    web: 'Web',
    instagram: 'Instagram',
    discord: 'Discord',
    notion: 'Notion',
    default: 'Link'
  };

  // 1. label을 직접 입력했으면 그걸 우선 사용
  // 2. 입력 안 했으면 type에 맞는 라벨 사용
  // 3. 둘 다 없으면 'Link' 사용
  const displayLabel = label || labels[type] || labels.default;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`url-button ${type}`}
    >
      {displayLabel}
    </a>
  );
}