//등록, 수정 페이지에 들어갈 모집중, 모집 마감 버튼(+datePicker) 필터버튼, 
// 실제 사용은  <RecruitStatusSection /> 이것만 들어가면 되고 위치 조정만 해주시면 될겁니다!

import { useState, useEffect } from 'react';

import RecruitStatusFilterButton from '../../common/Button/FilterButton/RecruitStatusFilterButton';

import RecruitDatePickerModal
  from '../../common/DatePicker/RecruitDatePickerModal';

function RecruitStatusSection({
  onChange,
  initialValue,
}) {
  const [selectedStat, setSelectedStat]
    = useState('마감');

  const [isOpen, setIsOpen]
    = useState(false);

  const [recruitRange, setRecruitRange]
    = useState(null);
  console.log('selectedStat =', selectedStat);
  useEffect(() => {
    
    if (!initialValue) return;

    if (initialValue.isRecruiting) {
        setSelectedStat('모집중');

        setRecruitRange({
            startDate: initialValue.recruitStartAt,
            endDate: initialValue.recruitEndAt,
        });
    } else {
        setSelectedStat('마감');
        setRecruitRange(null);
    }
  }, [initialValue]);

  return (
    <div
        style={{
            position: 'relative',
            display: 'inline-block',
        }}>

      <div
        style={{
          display: 'flex',
          gap: '10px',
        }}
      >

        <RecruitStatusFilterButton
          status="모집중"
          isActive={selectedStat === '모집중'}
          
          onClick={() => {
            setSelectedStat('모집중');

            setIsOpen(true);
          }}
        />

        <RecruitStatusFilterButton
          status="마감"
          isActive={selectedStat === '마감'}
          
          onClick={() => {
            setSelectedStat('마감');

            setRecruitRange(null);

            setIsOpen(false);

            onChange?.({
              isRecruiting: false,
              recruitStartAt: null,
              recruitEndAt: null,
            });
          }}
        />

      </div>

      {isOpen && (
        <RecruitDatePickerModal
          onClose={() =>
            setIsOpen(false)
          }

          onApply={(range) => {
            setRecruitRange(range);

            setIsOpen(false);

            onChange?.({
              isRecruiting: true,
              recruitStartAt: range.startDate,
              recruitEndAt: range.endDate,
            });
          }}
        />
      )}

    </div>
  );
}

export default RecruitStatusSection;

