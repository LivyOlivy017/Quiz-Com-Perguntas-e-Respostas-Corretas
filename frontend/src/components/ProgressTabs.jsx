export default function ProgressTabs({ total, atual }) {
  return (
    <div className="progress-tabs" role="progressbar" aria-valuenow={atual + 1} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`progress-tab ${i < atual ? 'preenchida' : ''} ${i === atual ? 'atual' : ''}`}
        />
      ))}
      <span className="progress-label">{atual + 1} / {total}</span>
    </div>
  );
}
