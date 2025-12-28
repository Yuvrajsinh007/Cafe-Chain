// src/user/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, ArrowRight, User, Shield, Camera, X, Award, Users, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfile, updateProfile, changePassword } from '../api/api';
import Loader from "../components/Loader";

// 1. Move Modal OUTSIDE the component to prevent re-renders
const Modal = ({ children, closeModal }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={closeModal}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#4a3a2f]"
        >
          <X size={24} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
};

const ProfilePage = () => {
  const { user: authUser, logout, updateUserData } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState('');

  // Modal State
  const [showEdit, setShowEdit] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);

  // Form State - Edit Profile
  const [editName, setEditName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Form State - Change Password
  const [changingPwd, setChangingPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  // Fetch profile
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    const load = async () => {
      try {
        setGlobalError('');
        const phone = authUser?.phone || localStorage.getItem('userPhone');
        if (!phone) return;
        const data = await getProfile(phone);
        setProfile(data);
        setEditName(data.name || '');
      } catch (e) {
        setGlobalError(e?.toString() || 'Failed to load profile');
      }
    };
    load();
    return () => clearTimeout(timer);
  }, [authUser]);

  // Reset Edit Form when opening
  useEffect(() => {
    if (showEdit && profile) {
      setEditName(profile.name || '');
      setEditError('');
      setEditSuccess('');
      setSelectedImage(null);
      setSelectedFile(null);
    }
  }, [showEdit, profile]);

  // Reset Password Form when opening
  useEffect(() => {
    if (showChangePwd) {
      setPwdError('');
      setPwdSuccess('');
    }
  }, [showChangePwd]);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result?.success) {
        navigate('/user/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Handlers ---

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setEditError('');
      setEditSuccess('');
      const phone = authUser?.phone || localStorage.getItem('userPhone');
      if (!phone) throw new Error('Missing user phone');

      const updateData = { name: editName };

      const performUpdate = async (data) => {
        const updated = await updateProfile(phone, data);
        setProfile(prev => ({ ...prev, ...updated.user }));
        updateUserData(updated.user);
        setEditSuccess('Profile updated successfully!');
        setTimeout(() => {
          setShowEdit(false);
        }, 1000);
      };

      if (selectedFile) {
        if (!selectedFile.type.startsWith('image/')) {
            throw new Error('Please select a valid image file');
        }
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            updateData.profilePic = reader.result;
            await performUpdate(updateData);
          } catch (innerErr) {
            setEditError(innerErr?.toString() || 'Failed to update profile');
          } finally {
            setSaving(false);
          }
        };
        reader.readAsDataURL(selectedFile);
      } else {
        await performUpdate(updateData);
        setSaving(false);
      }
    } catch (e) {
      setEditError(e?.toString() || 'Failed to update profile');
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      setChangingPwd(true);
      setPwdError('');
      setPwdSuccess('');
      const phone = authUser?.phone || localStorage.getItem('userPhone');
      if (!phone) throw new Error('Missing user phone');

      const currentPassword = form.currentPassword.value;
      const newPassword = form.newPassword.value;
      const confirmNewPassword = form.confirmNewPassword.value;

      if (!currentPassword || !newPassword || !confirmNewPassword)
        throw new Error('Enter all password fields');
      if (newPassword !== confirmNewPassword)
        throw new Error('New passwords do not match');

      await changePassword(phone, { currentPassword, newPassword });
      setPwdSuccess('Password changed successfully!');
      setTimeout(() => {
        setShowChangePwd(false);
      }, 1000);
      form.reset();
    } catch (e) {
      setPwdError(e?.toString() || 'Failed to change password');
    } finally {
      setChangingPwd(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#4a3a2f] font-sans pb-24">
      <AnimatePresence>
        {/* 2. Conditionally render modals with explicit KEYS */}
        {showEdit && (
          <Modal key="edit-modal" closeModal={() => setShowEdit(false)}>
            <h2 className="text-2xl font-bold mb-6 text-center pt-20 md:pt-0">Edit Your Profile</h2>
            <form onSubmit={handleEditProfile} className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32">
                  <img
                    src={
                      selectedImage ||
                      profile?.profilePic ||
                      `https://ui-avatars.com/api/?name=${profile?.name}&background=4a3a2f&color=fff&size=128`
                    }
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-stone-200"
                  />
                  <label
                    htmlFor="avatarInput"
                    className="absolute bottom-0 right-0 bg-[#4a3a2f] text-white p-2 rounded-full cursor-pointer hover:bg-opacity-90 transition-colors"
                  >
                    <Camera size={20} />
                  </label>
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#4a3a2f] focus:border-[#4a3a2f] transition"
                />
              </div>
              {editError && <div className="text-red-500 text-sm text-center">{editError}</div>}
              {editSuccess && <div className="text-green-600 text-sm text-center">{editSuccess}</div>}
              <button
                disabled={saving}
                className="w-full bg-[#4a3a2f] text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-md disabled:bg-opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </Modal>
        )}

        {showChangePwd && (
          <Modal key="pwd-modal" closeModal={() => setShowChangePwd(false)}>
            <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                name="currentPassword"
                type="password"
                placeholder="Current Password"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#4a3a2f]"
              />
              <input
                name="newPassword"
                type="password"
                placeholder="New Password"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#4a3a2f]"
              />
              <input
                name="confirmNewPassword"
                type="password"
                placeholder="Confirm New Password"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#4a3a2f]"
              />
              {pwdError && <div className="text-red-500 text-sm text-center">{pwdError}</div>}
              {pwdSuccess && <div className="text-green-600 text-sm text-center">{pwdSuccess}</div>}
              <button
                disabled={changingPwd}
                className="w-full bg-[#4a3a2f] text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-md disabled:bg-opacity-50"
              >
                {changingPwd ? 'Changing...' : 'Update Password'}
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile</h1>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile card */}
          <motion.div
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-stone-50 rounded-2xl p-8 text-center shadow-sm border border-stone-200">
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={
                    profile?.profilePic ||
                    `https://ui-avatars.com/api/?name=${profile?.name}&background=4a3a2f&color=fff&size=128`
                  }
                  alt="Profile Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
              <h2 className="mt-4 text-2xl font-bold">
                {profile?.name || 'Your Name'}
              </h2>
              <p className="text-gray-500">
                {profile?.email || 'your@email.com'}
              </p>
              {profile?.createdAt && (
                <p className="mt-1 text-sm text-gray-400">
                  Joined on: {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </motion.div>

          {/* Right side */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Stats */}
            <div className="bg-stone-50 rounded-2xl p-6 shadow-sm border border-stone-200">
              <h3 className="text-lg font-bold mb-4">Your Stats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg border border-stone-200 text-center">
                  <Award className="w-8 h-8 mx-auto text-[#4a3a2f] mb-2" />
                  <p className="text-3xl font-extrabold">{profile?.xp ?? 0}</p>
                  <p className="text-sm text-gray-500">XP </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-stone-200 text-center">
                  <Users className="w-8 h-8 mx-auto text-[#4a3a2f] mb-2" />
                  <p className="text-3xl font-extrabold">
                    {profile?.referralChildren?.length ?? 0}
                  </p>
                  <p className="text-sm text-gray-500">Referrals</p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-stone-50 rounded-2xl p-6 shadow-sm border border-stone-200">
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link
                  to="/user/invoice-history"
                  className="group flex items-center justify-between p-4 rounded-lg bg-white hover:bg-[#4a3a2f] hover:text-white transition-colors border border-stone-200"
                >
                  <div>
                    <div className="font-semibold">Invoice History</div>
                    <p className="text-sm text-gray-500 group-hover:text-stone-300">
                      Review your past cafe check-ins.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </Link>

                <Link
                  to="/user/points-history"
                  className="group flex items-center justify-between p-4 rounded-lg bg-white hover:bg-[#4a3a2f] hover:text-white transition-colors border border-stone-200"
                >
                  <div>
                    <div className="font-semibold">Points History</div>
                    <p className="text-sm text-gray-500 group-hover:text-stone-300">
                      Track your points.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </Link>

                <a
                  href="/user/rewards"
                  className="group flex items-center justify-between p-4 rounded-lg bg-white hover:bg-[#4a3a2f] hover:text-white transition-colors border border-stone-200"
                >
                  <div>
                    <div className="font-semibold">Refer & Earn</div>
                    <p className="text-sm text-gray-500 group-hover:text-stone-300">
                      Share with friends to earn bonus points.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Account settings */}
            <div className="bg-stone-50 rounded-2xl p-6 shadow-sm border border-stone-200">
              <h3 className="text-lg font-bold mb-4">Account Settings</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowEdit(true)}
                  className="w-full flex items-center justify-between text-left p-4 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">Edit Profile</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* ADDED: Change Password Button */}
                {/* <button
                  onClick={() => setShowChangePwd(true)}
                  className="w-full flex items-center justify-between text-left p-4 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">Change Password</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </button> */}

                <Link
                  to="/user/privacy-policy"
                  className="w-full flex items-center justify-between text-left p-4 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">Privacy Policy</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Link>

                <Link
                  to="/user/terms-and-conditions"
                  className="w-full flex items-center justify-between text-left p-4 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">Terms & Conditions</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Link>

                <Link
                  to="/user/contactus"
                  className="w-full flex items-center justify-between text-left p-4 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">Contact Us</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 text-left p-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;