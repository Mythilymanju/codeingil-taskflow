export const STATUSES = [
  ['todo', 'To do'],
  ['in_progress', 'In progress'],
  ['done', 'Done'],
];

export const PRIORITIES = [
  ['low', 'Low'],
  ['medium', 'Medium'],
  ['high', 'High'],
];

export default function TaskFilters({ filters, projects, onChange, onClear }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const active = Object.values(filters).some((v) => v !== '');

  return (
    <div className="filters">
      <label>
        <span>Project</span>
        <select value={filters.project_id} onChange={set('project_id')}>
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Status</span>
        <select value={filters.status} onChange={set('status')}>
          <option value="">All statuses</option>
          {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>

      <label>
        <span>Priority</span>
        <select value={filters.priority} onChange={set('priority')}>
          <option value="">All priorities</option>
          {PRIORITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>

      <button type="button" className="ghost" onClick={onClear} disabled={!active}>
        Clear filters
      </button>
    </div>
  );
}