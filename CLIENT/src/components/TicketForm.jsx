import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Technical', 'Billing', 'General', 'Bug Report'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const TicketForm = ({ onTicketCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced LLM Classification (MOCK)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (description.length > 10 && !category && !priority) {
        classifyDescription(description);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [description]);

  const classifyDescription = async (desc) => {
    setIsClassifying(true);
    // Simulate LLM API call
    try {
      // In a real app, this would be: 
      // const res = await fetch('/api/tickets/classify/', { method: 'POST', body: JSON.stringify({ description: desc }) });
      // const data = await res.json();
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock suggestion logic
      const suggestedCategory = desc.toLowerCase().includes('money') || desc.toLowerCase().includes('payment') ? 'Billing' : 
                               desc.toLowerCase().includes('break') || desc.toLowerCase().includes('error') ? 'Bug Report' : 'Technical';
      const suggestedPriority = desc.length > 100 || desc.toLowerCase().includes('urgent') ? 'High' : 'Medium';

      setCategory(suggestedCategory);
      setPriority(suggestedPriority);
    } catch (error) {
      console.error('Classification failed', error);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !priority) return;

    setIsSubmitting(true);
    try {
      const ticketData = {
        title,
        description,
        category,
        priority,
        status: 'open',
        timestamp: new Date().toISOString(),
      };

      // Mock submit POST request
      // const res = await fetch('/api/tickets/', { method: 'POST', body: JSON.stringify(ticketData) });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onTicketCreated(ticketData);
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('');
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem' }}>Submit New Ticket</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            className="input" 
            placeholder="What's the issue?" 
            maxLength={200}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            className="textarea" 
            rows="5" 
            placeholder="Tell us more about the problem..."
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {isClassifying && (
          <div style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="loading-spinner-small"></div>
            AI is classifying your ticket...
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Category</label>
            <select 
              className="select" 
              required 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Priority</label>
            <select 
              className="select" 
              required 
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="" disabled>Select priority</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting || isClassifying}>
          {isSubmitting ? 'Submitting...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
