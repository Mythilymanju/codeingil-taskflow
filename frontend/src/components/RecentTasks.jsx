const LABELS = { todo: 'To do', in_progress: 'In progress', done: 'Done' };

export default function RecentTasks({ tasks }) {
  return (
    <section className="card">
      <h2>Recent tasks</h2>
      {!tasks.length ? (
        <p className="empty">No tasks yet. Add a task to a project and it shows up here.</p>
      ) : (
        <ul className="recent">
          {tasks.map((t) => (
            <li key={t.id}>
              <div>
                <strong>{t.title}</strong>
                <small>{t.project?.name}</small>
              </div>
              <span className={`badge s-${t.status}`}>{LABELS[t.status] ?? t.status}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}