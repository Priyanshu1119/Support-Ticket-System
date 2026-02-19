import React, { useState } from 'react';

const TicketList = ({ tickets, onStatusChange }) => {
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState(() => {
        return new URLSearchParams(window.location.search).get('search') || '';
    });

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        const url = new URL(window.location);
        if (val) {
            url.searchParams.set('search', val);
        } else {
            url.searchParams.delete('search');
        }
        window.history.pushState({}, '', url);
    };

    const filteredTickets = tickets
        .filter(t => {
            const matchCategory = filterCategory === 'All' || t.category === filterCategory;
            const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
            const matchStatus = filterStatus === 'All' || t.status === filterStatus;
            const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchCategory && matchPriority && matchStatus && matchSearch;
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const getPriorityClass = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'badge-priority-high';
            case 'medium': return 'badge-priority-medium';
            case 'low': return 'badge-priority-low';
            default: return '';
        }
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'open': return 'badge-status-open';
            case 'in_progress': return 'badge-status-in_progress';
            case 'resolved': return 'badge-status-resolved';
            default: return '';
        }
    };

    const handleStatusRotate = (ticket) => {
        const statuses = ['open', 'in_progress', 'resolved'];
        const currentIndex = statuses.indexOf(ticket.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        onStatusChange(ticket.id, nextStatus);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    className="input"
                    placeholder="Search tickets..."
                    style={{ flex: 2, minWidth: '200px' }}
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
                <select className="select" style={{ flex: 1 }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="All">All Categories</option>
                    <option value="Technical">Technical</option>
                    <option value="Billing">Billing</option>
                    <option value="General">General</option>
                    <option value="Bug Report">Bug Report</option>
                </select>
                <select className="select" style={{ flex: 1 }} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <select className="select" style={{ flex: 1 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredTickets.map(ticket => (
                    <div key={ticket.id} className="card ticket-item" style={{ transition: 'transform 0.2s ease', cursor: 'pointer' }} onClick={() => handleStatusRotate(ticket)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h4 style={{ color: 'var(--text-main)' }}>{ticket.title}</h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span className={`badge ${getPriorityClass(ticket.priority)}`}>{ticket.priority}</span>
                                <span className={`badge ${getStatusClass(ticket.status)}`}>{ticket.status.replace('_', ' ')}</span>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            {ticket.description.length > 150 ? ticket.description.substring(0, 150) + '...' : ticket.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>Category: <strong>{ticket.category}</strong></span>
                            <span>{new Date(ticket.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
                {filteredTickets.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No tickets found match your filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketList;
