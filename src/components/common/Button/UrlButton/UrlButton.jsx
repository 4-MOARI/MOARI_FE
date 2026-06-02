import './UrlButton.css';

export default function UrlButton({ label, url, type = 'default' }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`url-button ${type}`}>
      {label}
    </a>
  );
}