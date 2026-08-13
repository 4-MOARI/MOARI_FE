import './ProgressSteps.css';

export default function ProgressSteps({ total, current }) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="progress-steps">
      {steps.map((step, idx) => (
        <div key={step} className="progress-steps__item">
          <div
            className={
              step <= current
                ? 'progress-steps__dot progress-steps__dot--active'
                : 'progress-steps__dot'
            }
          >
            {step}
          </div>
          {idx < steps.length - 1 && (
            <div
              className={
                step < current
                  ? 'progress-steps__line progress-steps__line--active'
                  : 'progress-steps__line'
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}