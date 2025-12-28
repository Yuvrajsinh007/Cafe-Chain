import React, { useState, useEffect } from 'react';
import { getContactSubmissions, deleteContactSubmission, deleteAllContactSubmissions } from '../api/api';
import Loader from '../components/Loader';
import { Mail, MessageSquare, User, Briefcase, Calendar, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-200">Confirm Delete</button>
        </div>
      </div>
    </div>
  );
};

const ContactSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modalState, setModalState] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getContactSubmissions();
        setSubmissions(data);
      } catch (error) { toast.error('Failed to fetch messages.'); } 
      finally { setLoading(false); }
    };
    fetchSubmissions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteContactSubmission(id);
      toast.success('Message deleted.');
      setSubmissions(prev => prev.filter(sub => sub._id !== id));
    } catch { toast.error('Delete failed.'); }
    closeModal();
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllContactSubmissions();
      toast.success('All messages cleared.');
      setSubmissions([]);
    } catch { toast.error('Clear failed.'); }
    closeModal();
  };
  
  const openModal = (onConfirm, title, message) => setModalState({ isOpen: true, onConfirm, title, message });
  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  const filtered = submissions.filter(sub => filter === 'all' || sub.type === filter);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });

  if (loading) return <Loader />;

  return (
    <>
      <ConfirmationModal {...modalState} onClose={closeModal} />
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                <p className="text-gray-500 text-sm">Inquiries from Users and Cafes</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                    {['all', 'user', 'cafe'].map(f => (
                        <button 
                            key={f} 
                            onClick={() => setFilter(f)} 
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === f ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                {submissions.length > 0 && (
                    <button 
                        onClick={() => openModal(handleDeleteAll, 'Clear Inbox?', 'This will permanently remove all messages.')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                        title="Delete All"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>

        <div className="grid gap-4">
            {filtered.length > 0 ? filtered.map(sub => (
                <div key={sub._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl shrink-0 ${sub.type === 'cafe' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                            {sub.type === 'cafe' ? <Briefcase className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-800">{sub.username}</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {formatDate(sub.createdAt)}
                                    </span>
                                    <button onClick={() => openModal(() => handleDelete(sub._id), 'Delete Message?', 'This action cannot be undone.')} className="text-gray-300 hover:text-red-500 transition">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                <Mail className="w-3 h-3" /> {sub.email}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-gray-400" /> {sub.subject}
                                </p>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{sub.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="text-center py-20 text-gray-400">No messages found.</div>
            )}
        </div>
      </div>
    </>
  );
};
export default ContactSubmissionsPage;