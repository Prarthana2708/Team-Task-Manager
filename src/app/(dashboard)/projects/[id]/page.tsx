'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './project-detail.module.css';

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data.project);
        setLoading(false);
      });
  }, [params.id]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    
    // Optimistic update
    setProject((prev: any) => ({
      ...prev,
      tasks: prev.tasks.map((t: any) => t.id === taskId ? { ...t, status: newStatus } : t)
    }));
  };

  if (loading) return <div className="animate-fade-in">Loading project...</div>;
  if (!project) return <div className="animate-fade-in">Project not found.</div>;

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
      <div className={styles.header}>
        <h1 className={styles.title}>{project.name}</h1>
        <p className={styles.description}>{project.description}</p>
      </div>

      <h2 className={styles.sectionTitle}>Project Tasks</h2>
      <div className={styles.taskList}>
        {project.tasks.map((task: any) => (
          <div key={task.id} className={`glass-card ${styles.taskCard}`}>
            <div className={styles.taskInfo}>
              <h3 className={styles.taskTitle}>{task.title}</h3>
              <p className={styles.taskAssignee}>
                Assigned to: {task.assignee ? task.assignee.name : 'Unassigned'}
              </p>
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
        {project.tasks.length === 0 && (
          <div className={styles.empty}>No tasks in this project yet.</div>
        )}
      </div>
    </div>
  );
}
