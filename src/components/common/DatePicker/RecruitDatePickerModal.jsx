import { useState } from 'react';

import { DateRange } from 'react-date-range';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import './RecruitDatePickerModal.css';

function RecruitDatePickerModal({
  onClose,
  onApply,
}) {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  return (
    <div className="datepicker-modal">
      <DateRange
        editableDateInputs={true}
        onChange={(item) =>
          setState([item.selection])
        }
        moveRangeOnFirstSelection={false}
        ranges={state}
        months={2}
        direction="horizontal"
      />

      <div className="datepicker-footer">
        <button
          className="cancel-button"
          onClick={onClose}
        >
          취소
        </button>

        <button
          className="apply-button"
          onClick={() =>
            onApply(state[0])
          }
        >
          적용
        </button>
      </div>
    </div>
  );
}

export default RecruitDatePickerModal;