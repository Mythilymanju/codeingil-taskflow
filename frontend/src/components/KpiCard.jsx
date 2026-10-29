export default function KpiCard({ label, value, tone = '' }) {
  return (
    <div className={`kpi ${tone}`}>
      <span className="kpi-value">{value}</span>
      <span className="kpi-label">{label}</span>
    </div>
  );
}