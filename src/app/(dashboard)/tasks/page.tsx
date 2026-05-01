'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './tasks.module.css';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data.tasks || []);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  if (loading) return <div className="animate-fade-in">Loading tasks...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'var(--text-muted)';
      case 'IN_PROGRESS': return 'var(--primary)';
      case 'REVIEW': return 'var(--secondary)';
      case 'DONE': return 'var(--accent)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className={styles.title}>My Tasks</h1>

      <div className={styles.taskList}>
        {tasks.map(task => (
          <div key={task.id} className={`glass-card ${styles.taskCard}`}>
            <div className={styles.taskInfo}>
              <h3 className={styles.taskTitle}>{task.title}</h3>
              <p className={styles.taskProject}>
                Project: <Link href={`/projects/${task.project.id}`} className={styles.projectLink}>{task.project.name}</Link>
              </p>
              {task.dueDate && (
                <p className={styles.taskDue}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              )}
            </div>
            <div className={styles.taskActions}>
              <select 
                value={task.status} 
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className={`input-field ${styles.statusSelect}`}
                style={{ color: getStatusColor(task.status), borderColor: getStatusColor(task.status) }}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className={styles.empty}>You have no assigned tasks.</div>
        )}
      </div>
    </div>
  );
}
