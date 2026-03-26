import { useState } from 'react';
import { useTracker } from '../hooks/useTracker';
import { ChevronDown, Plus, GripVertical, Trash2, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const COLUMNS = [
  { id: 'saved', label: 'Saved', color: 'var(--accent)' },
  { id: 'applied', label: 'Applied', color: 'var(--blue)' },
  { id: 'interview', label: 'Interview', color: 'var(--amber)' },
  { id: 'offer', label: 'Offer', color: 'var(--green)' },
  { id: 'rejected', label: 'Rejected', color: 'var(--red)' },
];

export default function Tracker() {
  const { data, loading, addApplication, moveApplication, deleteApplication } = useTracker();
  const [showAdd, setShowAdd] = useState(false);
  const [newApp, setNewApp] = useState({ title: '', company: '', domain: '' });
  const [expandedCols, setExpandedCols] = useState(
    Object.fromEntries(COLUMNS.map(c => [c.id, true]))
  );

  const toggleCol = (id) => setExpandedCols(prev => ({ ...prev, [id]: !prev[id] }));

  const getColApps = (colId) => data[colId] || [];

  const totalApps = COLUMNS.reduce((sum, c) => sum + (data[c.id]?.length || 0), 0);

  const handleAdd = () => {
    if (newApp.title && newApp.company) {
      addApplication({ title: newApp.title, company: newApp.company, domain: newApp.domain });
      setNewApp({ title: '', company: '', domain: '' });
      setShowAdd(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, source, destination } = result;
    if (source.droppableId === destination.droppableId) return;
    moveApplication(draggableId, source.droppableId, destination.droppableId);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Application Tracker</h1>
          <p>{totalApps} application{totalApps !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600 }}>Add Application</h3>
              <button className="btn btn-icon" onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input" style={{ paddingLeft: 16 }} placeholder="Job Title" value={newApp.title} onChange={e => setNewApp(p => ({ ...p, title: e.target.value }))} />
              <input className="input" style={{ paddingLeft: 16 }} placeholder="Company" value={newApp.company} onChange={e => setNewApp(p => ({ ...p, company: e.target.value }))} />
              <input className="input" style={{ paddingLeft: 16 }} placeholder="Domain (optional)" value={newApp.domain} onChange={e => setNewApp(p => ({ ...p, domain: e.target.value }))} />
              <button className="btn btn-primary btn-block" onClick={handleAdd} style={{ marginTop: 8 }}>Add Application</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-board">
            {COLUMNS.map(col => {
              const colApps = getColApps(col.id);
              const isOpen = expandedCols[col.id];
              return (
                <div key={col.id} className="kanban-column">
                  <div className="kanban-column-header" onClick={() => toggleCol(col.id)}>
                    <div className="kanban-column-title">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, display: 'inline-block' }} />
                      {col.label}
                      <span className="kanban-count">{colApps.length}</span>
                    </div>
                    <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }} />
                  </div>

                  {isOpen && (
                    <Droppable droppableId={col.id}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 40 }}>
                          {colApps.map((app, i) => (
                            <Draggable key={app.id} draggableId={String(app.id)} index={i}>
                              {(prov) => (
                                <div ref={prov.innerRef} {...prov.draggableProps} className="kanban-card">
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flex: 1 }}>
                                      <span {...prov.dragHandleProps} style={{ color: 'var(--text-muted)', marginTop: 2 }}><GripVertical size={14} /></span>
                                      <div>
                                        <div className="kanban-card-title">{app.title}</div>
                                        <div className="kanban-card-company">{app.company}</div>
                                        {app.note && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{app.note}</div>}
                                      </div>
                                    </div>
                                    <button className="btn btn-icon btn-ghost" onClick={() => deleteApplication(app.id, col.id)} style={{ minHeight: 32, minWidth: 32, padding: 4 }}>
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
