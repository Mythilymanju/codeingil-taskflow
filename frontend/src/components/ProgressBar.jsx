export default function ProgressBar({ percent, done, total }) {
  return (
    <section className="progress-wrap" aria-label="Completion progress">
      <div className="progress-head">
        <span>{done} of {total} tasks done</span>
        <strong>{percent}%</strong>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}