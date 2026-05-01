'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './projects.module.css';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null); // ✅ add user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch projects
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || []);
      });

    // ✅ fetch user
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setLoading(false);
      });
  }, []);
  const handleCreateProject = async () => {
    const name = prompt("Enter project name");
    if (!name) return;

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Project created!");
      setProjects(prev => [...prev, data.project]);
    } else {
      alert(data.error || "Failed to create project");
    }
  };

  if (loading) return <div className="animate-fade-in">Loading projects...</div>;

  return (

    <div className="animate-fade-in">

      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>

        {/* ✅ ADMIN BUTTON */}
        {user?.role === 'ADMIN' && (
          <button className={styles.createBtn} onClick={handleCreateProject}>
            + Create Project
          </button>
        )}
      </div>

      <div className={styles.grid}>
        {projects.map(project => (
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className={`glass-card ${styles.card}`}
          >
            <h2 className={styles.cardTitle}>{project.name}</h2>
            <p className={styles.cardDesc}>
              {project.description || 'No description'}
            </p>
          </Link>
        ))}

        {projects.length === 0 && (
          <div className={styles.empty}>No projects found.</div>
        )}
      </div>
    </div>
  );
}

