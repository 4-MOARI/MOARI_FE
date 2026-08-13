import './DiscreteSlider.css';

// 활동 강도 / 친목 비중 슬라이더.
// - 값은 항상 1~5 정수만 가질 수 있습니다.
// - 드래그하면서 부드럽게 움직이는 게 아니라, 클릭한 단계로 "뚝뚝" 바로 이동합니다.
//   (CSS transition을 주지 않아서 위치가 애니메이션 없이 즉시 바뀝니다.)
export default function DiscreteSlider({ value, onChange, min = 1, max = 5 }) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="discrete-slider">
      <div className="discrete-slider__track">
        <div className="discrete-slider__fill" style={{ width: `${percent}%` }} />
        <div className="discrete-slider__thumb" style={{ left: `${percent}%` }} />
      </div>

      {/* 트랙 위에 눈에 보이지 않는 클릭 영역 5칸을 겹쳐서, 클릭한 칸의 값으로 즉시 스냅됩니다. */}
      <div className="discrete-slider__steps">
        {steps.map((step) => (
          <button
            key={step}
            type="button"
            aria-label={`${step}단계`}
            aria-pressed={value === step}
            className="discrete-slider__step"
            onClick={() => onChange(step)}
          />
        ))}
      </div>
    </div>
  );
}
