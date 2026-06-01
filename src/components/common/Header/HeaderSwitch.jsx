import './HeaderSwitch.css';

function HeaderSwitch() {
  return (
    <div className="header-switch">
      <button className="switch-button active">
        교내
      </button>

      <button className="switch-button">
        외부
      </button>
    </div>
  );
}

export default HeaderSwitch;
