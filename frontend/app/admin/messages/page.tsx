"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/contacts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/contacts/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchContacts();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const openMessage = (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.status === 'unread') {
      updateStatus(contact._id, 'read');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      unread: { bg: "#fee2e2", color: "#c53030", label: "Non lu" },
      read: { bg: "#e0f2fe", color: "#0369a1", label: "Lu" },
      replied: { bg: "#dcfce7", color: "#16a34a", label: "Répondu" }
    };
    const s = styles[status] || styles.unread;
    return (
      <span className="badge" style={{ backgroundColor: s.bg, color: s.color }}>
        {s.label}
      </span>
    );
  };

  const getSubjectLabel = (subject: string) => {
    const labels: Record<string, string> = {
      info: "Information produit",
      order: "Suivi de commande",
      return: "Retour / Échange",
      warranty: "Garantie",
      other: "Autre"
    };
    return labels[subject] || subject;
  };

  const filteredContacts = filterStatus 
    ? contacts.filter(c => c.status === filterStatus)
    : contacts;

  const stats = {
    total: contacts.length,
    unread: contacts.filter(c => c.status === 'unread').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length
  };

  if (loading) {
    return (
      <div className="container-scroller">
        <Navbar />
        <div className="container-fluid page-body-wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <div className="spinner-border text-primary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">Messages de contact</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Messages</li>
                </ol>
              </nav>
            </div>

            {/* Stats */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body py-3">
                    <p className="text-muted mb-1 small">Total</p>
                    <h3 className="mb-0" style={{ color: "#1a365d" }}>{stats.total}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body py-3">
                    <p className="text-muted mb-1 small">Non lus</p>
                    <h3 className="mb-0 text-danger">{stats.unread}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body py-3">
                    <p className="text-muted mb-1 small">Lus</p>
                    <h3 className="mb-0 text-info">{stats.read}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body py-3">
                    <p className="text-muted mb-1 small">Répondus</p>
                    <h3 className="mb-0 text-success">{stats.replied}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="card-title mb-0">Liste des messages</h4>
                      <div className="d-flex gap-2">
                        {[
                          { value: "", label: "Tous" },
                          { value: "unread", label: "Non lus" },
                          { value: "read", label: "Lus" },
                          { value: "replied", label: "Répondus" }
                        ].map(f => (
                          <button
                            key={f.value}
                            className={`btn btn-sm ${filterStatus === f.value ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilterStatus(f.value)}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredContacts.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Expéditeur</th>
                              <th>Sujet</th>
                              <th>Message</th>
                              <th>Date</th>
                              <th>Statut</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredContacts.map(contact => (
                              <tr 
                                key={contact._id} 
                                style={{ 
                                  cursor: "pointer",
                                  backgroundColor: contact.status === 'unread' ? '#fff5f5' : 'transparent',
                                  fontWeight: contact.status === 'unread' ? '600' : 'normal'
                                }}
                                onClick={() => openMessage(contact)}
                              >
                                <td>
                                  <div>{contact.name}</div>
                                  <small className="text-muted">{contact.email}</small>
                                </td>
                                <td>{getSubjectLabel(contact.subject)}</td>
                                <td>{contact.message.substring(0, 40)}...</td>
                                <td>
                                  {new Date(contact.createdAt).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                                <td>{getStatusBadge(contact.status)}</td>
                                <td onClick={e => e.stopPropagation()}>
                                  <button
                                    className="btn btn-sm btn-info me-1"
                                    onClick={() => openMessage(contact)}
                                  >
                                    <i className="mdi mdi-eye"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => deleteContact(contact._id)}
                                  >
                                    <i className="mdi mdi-delete"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <i className="mdi mdi-email-outline" style={{ fontSize: "64px", color: "#ccc" }}></i>
                        <p className="text-muted mt-3">Aucun message</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Amélioré */}
      {selectedContact && (
        <div 
          className="modal fade show" 
          style={{ 
            display: 'block', 
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)'
          }} 
          onClick={() => setSelectedContact(null)}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content" style={{ 
              borderRadius: '16px', 
              border: 'none',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}>
              {/* Header avec gradient */}
              <div style={{ 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                padding: '1.5rem',
                color: 'white'
              }}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        <i className="mdi mdi-email-open-outline"></i>
                      </div>
                      <div>
                        <h5 className="mb-0" style={{ fontWeight: '600' }}>{selectedContact.name}</h5>
                        <small style={{ opacity: 0.9 }}>{selectedContact.email}</small>
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setSelectedContact(null)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '36px',
                      height: '36px',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s'
                    }}
                  >
                    <i className="mdi mdi-close" style={{ fontSize: '1.25rem' }}></i>
                  </button>
                </div>
                
                {/* Info badges */}
                <div className="d-flex gap-3 mt-3">
                  <div style={{
                    background: 'rgba(255,255,255,0.15)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}>
                    <i className="mdi mdi-calendar-outline me-1"></i>
                    {new Date(selectedContact.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.15)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}>
                    <i className="mdi mdi-tag-outline me-1"></i>
                    {getSubjectLabel(selectedContact.subject)}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                {/* Message */}
                <div className="mb-4">
                  <label style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.75rem',
                    display: 'block'
                  }}>
                    <i className="mdi mdi-message-text-outline me-1"></i>
                    Message
                  </label>
                  <div style={{ 
                    padding: '1.25rem',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.7',
                    color: '#334155',
                    fontSize: '0.95rem'
                  }}>
                    {selectedContact.message}
                  </div>
                </div>

                {/* Statut */}
                <div>
                  <label style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.75rem',
                    display: 'block'
                  }}>
                    <i className="mdi mdi-flag-outline me-1"></i>
                    Statut du message
                  </label>
                  <div className="d-flex gap-2">
                    {[
                      { value: 'unread', label: 'Non lu', icon: 'mdi-email-outline', color: '#ef4444' },
                      { value: 'read', label: 'Lu', icon: 'mdi-email-open-outline', color: '#3b82f6' },
                      { value: 'replied', label: 'Répondu', icon: 'mdi-reply', color: '#10b981' }
                    ].map(status => (
                      <button
                        key={status.value}
                        onClick={() => {
                          updateStatus(selectedContact._id, status.value);
                          setSelectedContact({ ...selectedContact, status: status.value as any });
                        }}
                        style={{
                          padding: '0.625rem 1rem',
                          borderRadius: '10px',
                          border: selectedContact.status === status.value 
                            ? `2px solid ${status.color}` 
                            : '2px solid #e2e8f0',
                          background: selectedContact.status === status.value 
                            ? `${status.color}15` 
                            : 'white',
                          color: selectedContact.status === status.value 
                            ? status.color 
                            : '#64748b',
                          fontWeight: '500',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <i className={`mdi ${status.icon}`}></i>
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ 
                padding: '1rem 1.5rem',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem'
              }}>
                <button 
                  className="btn"
                  onClick={() => setSelectedContact(null)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    background: 'white',
                    color: '#64748b',
                    fontWeight: '500'
                  }}
                >
                  Fermer
                </button>
                <button 
                  className="btn"
                  onClick={() => deleteContact(selectedContact._id)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <i className="mdi mdi-delete-outline"></i>
                  Supprimer
                </button>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${getSubjectLabel(selectedContact.subject)}`}
                  onClick={() => updateStatus(selectedContact._id, 'replied')}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none'
                  }}
                >
                  <i className="mdi mdi-send"></i>
                  Répondre par email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
