import { useState } from 'react';
import {
  Bookmark, Send, MessageSquare, Award, XCircle, Plus,
  MoreHorizontal, Calendar, Building2, GripVertical, X, Trash2,
} from 'lucide-react';
import { domainColors } from '../data/mockData';
import { useTracker } from '../hooks/useTracker';

const COLUMNS = [
  { id: 'saved', label: 'Saved', icon: Bookmark, color: '#74b9ff' },
  { id: 'applied', label: 'Applied', icon: Send, color: '#6c5ce7' },
  { id: 'interview', label: 'Interview', icon: MessageSquare, color: '#fdcb6e' },
  { id: 'offer', label: 'Offer', icon: Award, color: '#00b894' },
  { id: 'rejected', label: 'Rejected', icon: XCircle, color: '#e17055' },
];

export default function Tracker() {
  const { data: kanban, loading, addApplication, moveApplication, deleteApplication } = useTracker();
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({ title: '', company: '', domain: 'Full Stack', note: '' });
  const [kanbanLocal, setKanbanLocal] = useState(kanban);

  // Keep local state in sync with hook data
  useState(() => { setKanbanLocal(kanban); }, [kanban]);

  const handleDragStart = (card, fromColumn) => {
    setDraggedCard({ card, fromColumn });
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = (e, toColumn) => {
    e.preventDefault();
    if (!draggedCard) return;

    const { card, fromColumn } = draggedCard;
    if (fromColumn === toColumn) { setDraggedCard(null); setDragOverColumn(null); return; }

    moveApplication(card.id, fromColumn, toColumn);
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const addCard = () => {
    if (!newCard.title.trim()) return;
    addApplication({
      title: newCard.title,
      company: newCard.company,
      domain: newCard.domain,
      matchScore: Math.floor(Math.random() * 40 + 50),
      note: newCard.note,
    });
    setNewCard({ title: '', company: '', domain: 'Full Stack', note: '' });
    setShowAddModal(false);
  };

  const handleDeleteCard = (columnId, cardId) => {
    deleteApplication(cardId, columnId);
  };

  const totalApps = Object.values(kanban).flat().length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1>Application Tracker</h1>
            <p>Drag & drop to track your internship applications · {totalApps} applications total</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Application
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          const cards = kanban[col.id] || [];
          return (
            <div
              key={col.id}
              className="kanban-column"
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              style={{
                borderColor: dragOverColumn === col.id ? col.color : undefined,
                background: dragOverColumn === col.id ? `${col.color}08` : undefined,
              }}
            >
              <div className="kanban-column-header">
                <div className="kanban-column-title">
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: col.color, display: 'inline-block',
                  }} />
                  {col.label}
                  <span className="kanban-count">{cards.length}</span>
                </div>
              </div>

              <div style={{ minHeight: '100px' }}>
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="kanban-card"
                    draggable
                    onDragStart={() => handleDragStart(card, col.id)}
                    onDragEnd={handleDragEnd}
                    style={{ animation: 'fadeIn 0.3s ease' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div className="kanban-card-title">{card.title}</div>
                      <button
                        onClick={() => handleDeleteCard(col.id, card.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="kanban-card-company">
                      <Building2 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                      {card.company}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span className="badge" style={{
                        background: `${domainColors[card.domain] || '#6c5ce7'}20`,
                        color: domainColors[card.domain] || '#6c5ce7',
                      }}>{card.domain}</span>
                      <span className="badge" style={{
                        background: card.matchScore >= 75 ? 'rgba(0,184,148,0.15)' : 'rgba(253,203,110,0.15)',
                        color: card.matchScore >= 75 ? '#00b894' : '#fdcb6e',
                      }}>{card.matchScore}% match</span>
                    </div>

                    {card.note && (
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        padding: '8px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        marginBottom: '6px',
                        lineHeight: 1.5,
                      }}>
                        📝 {card.note}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <Calendar size={11} />
                      {card.date}
                    </div>
                  </div>
                ))}

                {cards.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '30px 10px',
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                    border: '2px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    Drop cards here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(8px)',
        }} onClick={() => setShowAddModal(false)}>
          <div className="glass-card" style={{
            padding: '28px',
            width: '100%',
            maxWidth: '480px',
            animation: 'scaleIn 0.2s ease',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Add Application</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block', color: 'var(--text-secondary)' }}>Job Title *</label>
                <input className="input" placeholder="e.g., AI/ML Intern" value={newCard.title} onChange={e => setNewCard(p => ({ ...p, title: e.target.value }))} style={{ paddingLeft: '14px' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block', color: 'var(--text-secondary)' }}>Company</label>
                <input className="input" placeholder="e.g., Google" value={newCard.company} onChange={e => setNewCard(p => ({ ...p, company: e.target.value }))} style={{ paddingLeft: '14px' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block', color: 'var(--text-secondary)' }}>Domain</label>
                <select className="input" value={newCard.domain} onChange={e => setNewCard(p => ({ ...p, domain: e.target.value }))} style={{ paddingLeft: '14px' }}>
                  {['AI/ML', 'Full Stack', 'Data Science', 'LLM/GenAI', 'Cybersecurity', 'Cloud/DevOps'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block', color: 'var(--text-secondary)' }}>Notes</label>
                <textarea className="input" placeholder="Interview date, contact info, etc." value={newCard.note} onChange={e => setNewCard(p => ({ ...p, note: e.target.value }))} rows={3} style={{ paddingLeft: '14px', resize: 'vertical' }} />
              </div>
              <button className="btn btn-primary" onClick={addCard} style={{ marginTop: '4px' }}>
                <Plus size={16} /> Add to Saved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
