import { useState } from 'react';

import RecruitDatePickerModal
  from './RecruitDatePickerModal';

import './RecruitStatusToggle.css';

function RecruitStatusToggle() {
  const [status, setStatus]
    = useState('마감');

  const [isOpen, setIsOpen]
    = useState(false);

  return (
    <div className="recruit-wrapper">

      <div className="recruit-toggle">

        <button
          className={
            status === '모집중'
              ? 'selected'
              : 'unselected'
          }

          onClick={() => {
            setStatus('모집중');

            setIsOpen(true);
          }}
        >
          모집중
        </button>

        <button
          className={
            status === '마감'
              ? 'selected'
              : 'unselected'
          }

          onClick={() => {
            setStatus('마감');

            setIsOpen(false);
          }}
        >
          마감
        </button>

      </div>

      {isOpen && (
        <RecruitDatePickerModal
          onClose={() =>
            setIsOpen(false)
          }

          onApply={(range) => {
            console.log(range);

            setIsOpen(false);
          }}
        />
      )}

    </div>
  );
}

export default RecruitStatusToggle;