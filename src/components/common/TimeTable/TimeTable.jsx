import { useState } from 'react';

import './TimeTable.css';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

const START_HOUR = 9;
const END_HOUR = 22;

const HOUR_HEIGHT = 39;
const HALF_HOUR_HEIGHT = HOUR_HEIGHT / 2;

function TimeTable({
  selectedTimes,
  setSelectedTimes,
  selectedClubDetails,
  clubColorMap = {},
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null);

  const makeTimeKey = (dayIndex, hour, minute) => {
    return `${dayIndex}-${hour}-${minute}`;
  };

  const changeTimeCell = (
    dayIndex,
    hour,
    minute,
    mode
  ) => {
    const key = makeTimeKey(
      dayIndex,
      hour,
      minute
    );

    setSelectedTimes((prev) => {
      if (mode === 'select') {
        if (prev.includes(key)) {
          return prev;
        }

        return [...prev, key];
      }

      if (mode === 'unselect') {
        return prev.filter(
          (item) => item !== key
        );
      }

      return prev.includes(key)
        ? prev.filter(
            (item) => item !== key
          )
        : [...prev, key];
    });
  };

  const handleMouseDown = (
    dayIndex,
    hour,
    minute
  ) => {
    const key = makeTimeKey(
      dayIndex,
      hour,
      minute
    );

    const alreadySelected =
      selectedTimes.includes(key);

    setIsDragging(true);

    setDragMode(
      alreadySelected
        ? 'unselect'
        : 'select'
    );

    changeTimeCell(
      dayIndex,
      hour,
      minute,
      alreadySelected
        ? 'unselect'
        : 'select'
    );
  };

  const handleMouseEnter = (
    dayIndex,
    hour,
    minute
  ) => {
    if (!isDragging) {
      return;
    }

    changeTimeCell(
      dayIndex,
      hour,
      minute,
      dragMode
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  /*
   * 시간 표시
   * 09:00 ~ 22:00
   */
  const hours = Array.from(
    {
      length:
        END_HOUR -
        START_HOUR +
        1,
    },
    (_, index) =>
      START_HOUR + index
  );

  /*
   * 30분 단위 시간 슬롯
   */
  const timeSlots = Array.from(
    {
      length:
        (END_HOUR -
          START_HOUR) *
        2,
    },
    (_, index) => {
      const totalMinutes =
        START_HOUR * 60 +
        index * 30;

      return {
        hour: Math.floor(
          totalMinutes / 60
        ),
        minute:
          totalMinutes % 60,
      };
    }
  );

  const dayToIndex = {
    월요일: 0,
    화요일: 1,
    수요일: 2,
    목요일: 3,
    금요일: 4,
    토요일: 5,
    일요일: 6,
  };

  /*
   * 선택한 동아리의 활동시간
   *
   * 색상은 RecommendationsPage에서
   * 동아리 카드에 지정한 색상을 그대로 사용
   */
  const clubSchedules =
    selectedClubDetails.flatMap(
      (club) => {
        const color =
          clubColorMap[club.clubId] ||
          '#D9D9D9';

        return (
          club.schedules || []
        ).map((schedule) => ({
          ...schedule,
          clubId: club.clubId,
          clubName: club.clubName,
          color,
        }));
      }
    );

  /*
   * 활동시간을 분 단위로 변환
   */
  const getScheduleMinutes = (
    schedule
  ) => {
    const [
      startHour,
      startMinute,
    ] =
      schedule.startTime
        .split(':')
        .map(Number);

    const [
      endHour,
      endMinute,
    ] =
      schedule.endTime
        .split(':')
        .map(Number);

    return {
      start:
        startHour * 60 +
        startMinute,
      end:
        endHour * 60 +
        endMinute,
    };
  };

  /*
   * 내가 선택한 시간의 점선 네모
   *
   * 연속된 30분 슬롯은 하나의 네모
   *
   * 예:
   * 18:00~19:00
   * 19:30~22:00
   *
   * → 점선 네모 2개
   */
  const selectedRanges =
    DAYS.flatMap(
      (_, dayIndex) => {
        const daySlots =
          timeSlots
            .filter(
              ({
                hour,
                minute,
              }) =>
                selectedTimes.includes(
                  makeTimeKey(
                    dayIndex,
                    hour,
                    minute
                  )
                )
            )
            .sort(
              (a, b) =>
                a.hour * 60 +
                a.minute -
                (b.hour * 60 +
                  b.minute)
            );

        if (
          daySlots.length === 0
        ) {
          return [];
        }

        const ranges = [];

        let rangeStart =
          daySlots[0];

        let previousSlot =
          daySlots[0];

        for (
          let i = 1;
          i < daySlots.length;
          i += 1
        ) {
          const currentSlot =
            daySlots[i];

          const previousMinutes =
            previousSlot.hour *
              60 +
            previousSlot.minute;

          const currentMinutes =
            currentSlot.hour *
              60 +
            currentSlot.minute;

          const isContinuous =
            currentMinutes ===
            previousMinutes + 30;

          if (!isContinuous) {
            ranges.push({
              dayIndex,
              startHour:
                rangeStart.hour,
              startMinute:
                rangeStart.minute,
              endHour:
                previousSlot.hour,
              endMinute:
                previousSlot.minute +
                30,
            });

            rangeStart =
              currentSlot;
          }

          previousSlot =
            currentSlot;
        }

        ranges.push({
          dayIndex,
          startHour:
            rangeStart.hour,
          startMinute:
            rangeStart.minute,
          endHour:
            previousSlot.hour,
          endMinute:
            previousSlot.minute +
            30,
        });

        return ranges;
      }
    );

  /*
   * 동아리끼리 활동시간이 겹치는
   * 30분 슬롯 계산
   */
  const overlappingSlots =
    timeSlots.flatMap(
      ({
        hour,
        minute,
      }) => {
        return DAYS.map(
          (_, dayIndex) => {
            const slotStart =
              hour * 60 +
              minute;

            const slotEnd =
              slotStart + 30;

            const schedules =
              clubSchedules.filter(
                (schedule) => {
                  if (
                    dayToIndex[
                      schedule.dayOfWeek
                    ] !==
                    dayIndex
                  ) {
                    return false;
                  }

                  const {
                    start,
                    end,
                  } =
                    getScheduleMinutes(
                      schedule
                    );

                  return (
                    slotStart <
                      end &&
                    slotEnd >
                      start
                  );
                }
              );

            if (
              schedules.length < 2
            ) {
              return null;
            }

            return {
              key: `overlap-${dayIndex}-${hour}-${minute}`,
              dayIndex,
              hour,
              minute,
            };
          }
        );
      }
    ).filter(Boolean);

  const columnWidth =
    358 / 7;

  return (
    <div
      className="time-table"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 요일 헤더 */}
      <div className="time-table-header">
        <div className="time-table-corner" />

        {DAYS.map(
          (day, index) => (
            <div
              key={day}
              className={`time-table-day day-${index}`}
            >
              {day}
            </div>
          )
        )}
      </div>

      {/* 시간 + 시간표 */}
      <div className="time-table-body">

        {/* 시간 */}
        <div className="time-table-labels">
          {hours.map(
            (hour) => (
              <div
                key={hour}
                className="time-table-label"
                style={{
                  height:
                    HOUR_HEIGHT,
                }}
              >
                {String(
                  hour
                ).padStart(2, '0')}
                :00
              </div>
            )
          )}
        </div>

        {/* 시간표 그리드 */}
        <div className="time-table-grid">

          {/* 30분 선택 칸 */}
          {timeSlots.map(
            ({
              hour,
              minute,
            }) =>
              DAYS.map(
                (_, dayIndex) => {
                  const key =
                    makeTimeKey(
                      dayIndex,
                      hour,
                      minute
                    );

                  const isMySelectedTime =
                    selectedTimes.includes(
                      key
                    );

                  return (
                    <div
                      key={key}
                      className={`time-table-cell${
                        isMySelectedTime
                          ? ' my-selected'
                          : ''
                      }`}
                      style={{
                        height:
                          HALF_HOUR_HEIGHT,
                      }}
                      onMouseDown={(
                        event
                      ) => {
                        event.preventDefault();

                        handleMouseDown(
                          dayIndex,
                          hour,
                          minute
                        );
                      }}
                      onMouseEnter={() =>
                        handleMouseEnter(
                          dayIndex,
                          hour,
                          minute
                        )
                      }
                    />
                  );
                }
              )
          )}

          {/* 내가 선택한 시간 점선 네모 */}
          {selectedRanges.map(
            (
              range,
              index
            ) => {
              const startMinutes =
                (range.startHour -
                  START_HOUR) *
                  60 +
                range.startMinute;

              const endMinutes =
                (range.endHour -
                  START_HOUR) *
                  60 +
                range.endMinute;

              const top =
                (startMinutes /
                  60) *
                HOUR_HEIGHT;

              const height =
                ((endMinutes -
                  startMinutes) /
                  60) *
                HOUR_HEIGHT;

              return (
                <div
                  key={`selected-range-${range.dayIndex}-${range.startHour}-${range.startMinute}-${index}`}
                  className="time-table-selected-range"
                  style={{
                    left: `${
                      range.dayIndex *
                      columnWidth
                    }px`,
                    top: `${top}px`,
                    width: `${columnWidth}px`,
                    height: `${height}px`,
                  }}
                />
              );
            }
          )}

          {/* 동아리 활동시간 */}
          {clubSchedules.map(
            (schedule) => {
              const dayIndex =
                dayToIndex[
                  schedule.dayOfWeek
                ];

              if (
                dayIndex ===
                undefined
              ) {
                return null;
              }

              const {
                start:
                  scheduleStart,
                end:
                  scheduleEnd,
              } =
                getScheduleMinutes(
                  schedule
                );

              const scheduleSlots =
                timeSlots.filter(
                  ({
                    hour,
                    minute,
                  }) => {
                    const slotStart =
                      hour * 60 +
                      minute;

                    const slotEnd =
                      slotStart + 30;

                    return (
                      slotStart <
                        scheduleEnd &&
                      slotEnd >
                        scheduleStart
                    );
                  }
                );

              return scheduleSlots.map(
                ({
                  hour,
                  minute,
                }) => {
                  const slotStart =
                    hour * 60 +
                    minute;

                  const slotEnd =
                    slotStart + 30;

                  /*
                   * 내가 선택한 시간과
                   * 현재 동아리 시간이 겹치는지
                   */
                  const isSelected =
                    selectedTimes.includes(
                      makeTimeKey(
                        dayIndex,
                        hour,
                        minute
                      )
                    );

                  /*
                   * 다른 동아리와
                   * 현재 30분 구간이 겹치는지
                   */
                  const isOverlappingClub =
                    clubSchedules.some(
                      (
                        otherSchedule
                      ) => {
                        if (
                          otherSchedule ===
                          schedule
                        ) {
                          return false;
                        }

                        if (
                          otherSchedule.dayOfWeek !==
                          schedule.dayOfWeek
                        ) {
                          return false;
                        }

                        const {
                          start,
                          end,
                        } =
                          getScheduleMinutes(
                            otherSchedule
                          );

                        return (
                          slotStart <
                            end &&
                          slotEnd >
                            start
                        );
                      }
                    );

                  const top =
                    ((slotStart -
                      START_HOUR *
                        60) /
                      60) *
                    HOUR_HEIGHT;

                  return (
                    <div
                      key={`${schedule.clubId}-${schedule.scheduleId}-${hour}-${minute}`}
                      className={`time-table-club-schedule${
                        isOverlappingClub
                          ? ' time-table-club-schedule--overlap'
                          : ''
                      }`}
                      style={{
                        left: `${
                          dayIndex *
                          columnWidth
                        }px`,
                        top: `${top}px`,
                        width: `${columnWidth}px`,
                        height: `${HALF_HOUR_HEIGHT}px`,

                        /*
                         * 동아리 고유 색상
                         */
                        backgroundColor:
                          schedule.color,

                        /*
                         * 내 선택시간과 겹침
                         * → 진하게
                         *
                         * 내 선택시간과 안 겹침
                         * → 연하게
                         */
                        opacity:
                          isSelected
                            ? 0.9
                            : 0.3,
                      }}
                      title={
                        schedule.clubName
                      }
                    />
                  );
                }
              );
            }
          )}

          {/* 동아리 활동시간끼리 겹치는 부분 */}
          {overlappingSlots.map(
            (slot) => {
              const top =
                (((slot.hour -
                  START_HOUR) *
                  60 +
                  slot.minute) /
                  60) *
                HOUR_HEIGHT;

              return (
                <div
                  key={slot.key}
                  className="time-table-overlap"
                  style={{
                    left: `${
                      slot.dayIndex *
                      columnWidth
                    }px`,
                    top: `${top}px`,
                    width: `${columnWidth}px`,
                    height: `${HALF_HOUR_HEIGHT}px`,
                  }}
                />
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

export default TimeTable;