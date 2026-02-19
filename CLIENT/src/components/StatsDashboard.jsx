import React, { useMemo } from 'react';

const StatsDashboard = ({ tickets }) => {
    const stats = useMemo(() => {
        const total = tickets.length;
        const open = tickets.filter(t => t.status === 'open').length;

        // Avg per day (mock calculation based on current tickets timestamps)
        const dates = tickets.map(t => new Date(t.timestamp).toDateString());
        const uniqueDates = [...new Set(dates)].length || 1;
        const avgPerDay = (total / uniqueDates).toFixed(1);

        const priorityBreakdown = tickets.reduce((acc, t) => {
            acc[t.priority] = (acc[t.priority] || 0) + 1;
            return acc;
        }, {});

        const categoryBreakdown = tickets.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {});

        return { total, open, avgPerDay, priorityBreakdown, categoryBreakdown };
    }, [tickets]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Tickets</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.total}</div>
            </div>
            <div className="card stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Open Tickets</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.open}</div>
            </div>
            <div className="card stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Avg Per Day</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.avgPerDay}</div>
            </div>
            <div className="card stat-card">
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Priority Breakdown</div>
                <div style={{ fontSize: '0.75rem' }}>
                    {Object.entries(stats.priorityBreakdown).map(([p, count]) => (
                        <div key={p} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span>{p}</span>
                            <strong>{count}</strong>
                        </div>
                    ))}
                </div>
            </div>
            <div className="card stat-card">
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Category Breakdown</div>
                <div style={{ fontSize: '0.75rem' }}>
                    {Object.entries(stats.categoryBreakdown).map(([c, count]) => (
                        <div key={c} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span>{c}</span>
                            <strong>{count}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
