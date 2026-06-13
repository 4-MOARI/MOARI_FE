import './HeaderSwitch.css';

function HeaderSwitch({ selected, onChange }) {
  return (
    <div className="header-switch">
      <button
        className={`switch-button ${
          selected === 'internal' ? 'active' : ''
        }`}
        onClick={() => onChange('internal')}
      >
        교내
      </button>

      <button
        className={`switch-button ${
          selected === 'external' ? 'active' : ''
        }`}
        onClick={() => onChange('external')}
      >
        외부
      </button>
    </div>
  );
}

export default HeaderSwitch;