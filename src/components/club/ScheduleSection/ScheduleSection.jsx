import React from 'react';

const DAYS = [
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
  '일요일',
];

const TIMES = [];

for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIMES.push(
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
    );
  }
}

const ScheduleSection = ({ schedules, setSchedules }) => {
  const handleChange = (index, field, value) => {
    const next = [...schedules];
    next[index][field] = value;
    setSchedules(next);
  };

  const handleAdd = () => {
    setSchedules([
      ...schedules,
      {
        dayOfWeek: '',
        startTime: '',
        endTime: '',
      },
    ]);
  };

  const handleRemove = (index) => {
    if (schedules.length === 1) {
      setSchedules([
        {
          dayOfWeek: '',
          startTime: '',
          endTime: '',
        },
      ]);
      return;
    }

    setSchedules(schedules.filter((_, i) => i !== index));
  };

  return (
    <div style={{ marginTop: '32px' }}>
      <div
        style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '16px',
        }}
      >
        정기 활동 시간
      </div>

      {schedules.map((schedule, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <select
            value={schedule.dayOfWeek}
            onChange={(e) =>
              handleChange(index, 'dayOfWeek', e.target.value)
            }
            style={{
              width: '140px',
              height: '44px',
              borderRadius: '10px',
              border: '1px solid #D1D5DB',
              padding: '0 12px',
            }}
          >
            <option value="">요일</option>

            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <select
            value={schedule.startTime}
            onChange={(e) =>
              handleChange(index, 'startTime', e.target.value)
            }
            style={{
              width: '150px',
              height: '44px',
              borderRadius: '10px',
              border: '1px solid #D1D5DB',
              padding: '0 12px',
            }}
          >
            <option value="">시작 시간</option>
            {TIMES.map((time) => (
              <option key={time} value={time}>
                {time.slice(0, 5)}
              </option>
            ))}
          </select>

          <span>~</span>

          <select
            value={schedule.endTime}
            onChange={(e) =>
              handleChange(index, 'endTime', e.target.value)
            }
            style={{
              width: '150px',
              height: '44px',
              borderRadius: '10px',
              border: '1px solid #D1D5DB',
              padding: '0 12px',
            }}
          >
            <option value="">종료시간</option>

            {TIMES.filter(
              (time) =>
                !schedule.startTime || time > schedule.startTime
            ).map((time) => (
              <option key={time} value={time}>
                {time.slice(0, 5)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => handleRemove(index)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              border: '1px solid #D1D5DB',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            −
          </button>

          {index === schedules.length - 1 && (
            <button
              type="button"
              onClick={handleAdd}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                background: '#534AB7',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScheduleSection;