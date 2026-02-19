import React, { useState, useEffect } from 'react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import StatsDashboard from './components/StatsDashboard';
import './index.css';

function App() {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: 'Login page throwing 500 error',
      description: 'Whenever I try to login with my corporate email, the page just stalls and eventually shows a 500 error. I tried clearing my cache but it did not help.',
      category: 'Bug Report',
      priority: 'High',
      status: 'open',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: 2,
      title: 'How to update my billing address?',
      description: 'I recently moved and need to update my credit card billing address. I looked in the settings but could not find the option.',
      category: 'Billing',
      priority: 'Medium',
      status: 'in_progress',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: 3,
      title: 'Feature request: Dark mode',
      description: 'The interface is a bit bright for me at night. It would be great if there was a dark mode toggle.',
      category: 'General',
      priority: 'Low',
      status: 'resolved',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    }
  ]);

  const handleTicketCreated = (newTicket) => {
    const ticketWithId = {
      ...newTicket,
      id: tickets.length + 1,
    };
    setTickets(prev => [ticketWithId, ...prev]);
  };

  const handleStatusChange = (id, newStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="App">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1>Support Ticket Center</h1>
        <p style={{ color: 'var(--text-muted)' }}>Intelligent ticket management with LLM-powered classification.</p>
      </header>

      <StatsDashboard tickets={tickets} />

      <div className="dashboard-grid">
        <aside>
          <TicketForm onTicketCreated={handleTicketCreated} />
        </aside>

        <main>
          <TicketList tickets={tickets} onStatusChange={handleStatusChange} />
        </main>
      </div>
    </div>
  );
}

export default App;
