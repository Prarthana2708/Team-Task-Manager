'use client';

import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-fade-in">Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <h1 className={styles.header}>Dashboard Overview</h1>
      
      <div className={styles.statsGrid}>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statTitle}>Total Tasks</div>
          <div className={styles.statValue}>{stats.total}</div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statTitle}>To Do</div>
          <div className={styles.statValue}>{stats.todo}</div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statTitle}>In Progress</div>
          <div className={`${styles.statValue} ${styles.textPrimary}`}>{stats.inProgress}</div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statTitle}>Completed</div>
          <div className={`${styles.statValue} ${styles.textAccent}`}>{stats.done}</div>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <div className={styles.statTitle}>Overdue</div>
          <div className={`${styles.statValue} ${styles.textDanger}`}>{stats.overdue}</div>
        </div>
      </div>
    </div>
  );
}
