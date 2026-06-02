import './UrlButton.css'; // CSS 파일 연결 확인!

export default function UrlButton({ type = 'default', url, label }) {
  const labels = {
    web: 'Web',
    instagram: 'Instagram',
    discord: 'Discord',
    notion: 'Notion',
  };

  // label이 있으면 쓰고, 없으면 type에 맞는 이름을 씁니다.
  const displayLabel = label || labels[type] || 'Link';

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      // class 이름은 항상 'url-button'이고, type은 추가 클래스로 들어갑니다.
      className={`url-button ${type}`}
    >
      {displayLabel}
    </a>
  );
}