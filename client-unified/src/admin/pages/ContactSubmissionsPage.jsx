import React, { useState, useEffect } from 'react';
import { getContactSubmissions, deleteContactSubmission, deleteAllContactSubmissions } from '../api/api';
import Loader from '../components/Loader';
import { Mail, MessageSquare, User, Briefcase, Calendar, Trash2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

// A simple, reusable confirmation modal component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full transform transition-all">
        <div className="flex items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <ShieldAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:w-auto sm:text-sm"
            onClick={onConfirm}
          >
            Confirm Delete
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
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

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getContactSubmissions();
      setSubmissions(data);
    } catch (error) {
      toast.error('Failed to fetch contact submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteContactSubmission(id);
      toast.success('Submission deleted successfully.');
      setSubmissions(submissions.filter(sub => sub._id !== id));
    } catch (error) {
      toast.error('Failed to delete submission.');
    }
    closeModal();
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllContactSubmissions();
      toast.success('All submissions have been deleted.');
      setSubmissions([]);
    } catch (error) {
      toast.error('Failed to delete all submissions.');
    }
    closeModal();
  };
  
  const openModal = (onConfirmCallback, title, message) => {
    setModalState({ isOpen: true, onConfirm: onConfirmCallback, title, message });
  };
  
  const closeModal = () => {
    setModalState({ isOpen: false, onConfirm: null, title: '', message: '' });
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'all') return true;
    return sub.type === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <Loader />;

  return (
    <>
      <ConfirmationModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
      />
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h1 className="text-2xl font-bold text-gray-800">Contact Form Submissions</h1>
              <div className="flex items-center space-x-2">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>All</button>
                <button onClick={() => setFilter('user')} className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Users</button>
                <button onClick={() => setFilter('cafe')} className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'cafe' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Cafes</button>
              </div>
              <button
                onClick={() => openModal(() => handleDeleteAll(), 'Delete All Submissions?', 'Are you absolutely sure you want to delete all submissions? This action cannot be undone.')}
                disabled={submissions.length === 0}
                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete All
              </button>
            </div>
            
            <div className="space-y-4">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map(submission => (
                  <div key={submission._id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className={`mt-1 p-2 rounded-full ${submission.type === 'cafe' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                        {submission.type === 'cafe' ? <Briefcase size={20} /> : <User size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{submission.username}</h3>
                            <a href={`mailto:${submission.email}`} className="text-sm text-indigo-600 hover:underline flex items-center">
                              <Mail size={14} className="mr-1" />
                              {submission.email}
                            </a>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(submission.createdAt)}
                            </span>
                            <button
                              onClick={() => openModal(() => handleDelete(submission._id), 'Delete Submission?', 'Are you sure you want to delete this message? This action is permanent.')}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete this submission"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 font-medium flex items-center">
                          <MessageSquare size={14} className="mr-2" />
                          Subject: {submission.subject}
                        </p>
                        <p className="text-sm text-gray-800 mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">{submission.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No submissions to display.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactSubmissionsPage;
