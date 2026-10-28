import { STATUSES } from './TaskFilters';

export default function TaskTable({ tasks, onStatusChange, savingId }) {
  if (!tasks.length) {
    return <p className="empty">No tasks match these filters. Clear a filter to see more.</p>;
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Project</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.project?.name}</td>
              <td><span className={`badge p-${t.priority}`}>{t.priority}</span></td>
              <td>
                <select
                  aria-label={`Status for ${t.title}`}
                  value={t.status}
                  disabled={savingId === t.id}
                  onChange={(e) => onStatusChange(t, e.target.value)}
                >
                  {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}