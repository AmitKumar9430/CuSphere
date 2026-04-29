import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Bell, Plus, X, Save, Edit, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
}

export function AdminNotificationManager() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setNotifications(data);
    }
    if (error) console.error('Error loading notifications:', error);
  }

  async function handleSubmit() {
    if (!formData.title.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (isEditing && currentNotification) {
      // Update existing notification
      const { error } = await supabase
        .from('notifications')
        .update({
          title: formData.title.trim(),
          message: formData.message.trim(),
          type: formData.type,
        })
        .eq('id', currentNotification.id);

      if (error) {
        console.error('Error updating notification:', error);
        alert('Failed to update notification: ' + error.message);
        return;
      }
      alert('Notification updated successfully!');
    } else {
      // Create new notification
      const { error } = await supabase.from('notifications').insert({
        title: formData.title.trim(),
        message: formData.message.trim(),
        type: formData.type,
      });

      if (error) {
        console.error('Error adding notification:', error);
        alert('Failed to add notification: ' + error.message);
        return;
      }
      alert('Notification added successfully!');
    }

    resetForm();
    setShowModal(false);
    loadNotifications();
  }

  async function handleDelete(notificationId: string) {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification: ' + error.message);
      return;
    }

    loadNotifications();
    alert('Notification deleted successfully!');
  }

  function openAddModal() {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  }

  function openEditModal(notification: Notification) {
    setCurrentNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
    });
    setIsEditing(true);
    setShowModal(true);
    setShowListModal(false);
  }

  function resetForm() {
    setFormData({
      title: '',
      message: '',
      type: 'info',
    });
    setCurrentNotification(null);
    setIsEditing(false);
  }

  const getTypeColor = (type: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700',
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      info: '💡',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  return (
    <>
      {/* Bell Icon with Badge */}
      <div className="relative">
        <button
          onClick={() => setShowListModal(true)}
          className="relative p-2 rounded-lg hover:bg-slate-800 transition"
          title="Manage Notifications"
        >
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* Add Notification Button (Alternative placement) */}
      <button
        onClick={openAddModal}
        className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-green-600 rounded hover:bg-green-700 transition text-sm"
        title="Add Notification"
      >
        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
        <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Notification</span>
      </button>

      {/* Notification List Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Manage Notifications
              </h2>
              <button
                onClick={() => setShowListModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <button
              onClick={() => {
                setShowListModal(false);
                openAddModal();
              }}
              className="mb-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition text-white"
            >
              <Plus className="w-5 h-5" /> Add New Notification
            </button>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 bg-slate-800 rounded-lg hover:bg-slate-750 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                          <span className="text-sm">{getTypeIcon(notification.type)}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-slate-300 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(notification)}
                            className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">
              {isEditing ? 'Edit Notification' : 'Add New Notification'}
            </h2>

            <label className="block mb-2 font-medium text-sm text-white">Title *</label>
            <input
              type="text"
              className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notification title"
            />

            <label className="block mb-2 font-medium text-sm text-white">Message *</label>
            <textarea
              className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter notification message"
              rows={4}
            />

            <label className="block mb-2 font-medium text-sm text-white">Type *</label>
            <select
              className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as 'info' | 'success' | 'warning' | 'error',
                })
              }
            >
              <option value="info">Info 💡</option>
              <option value="success">Success ✅</option>
              <option value="warning">Warning ⚠️</option>
              <option value="error">Error ❌</option>
            </select>

            <div className="flex justify-end gap-2 sm:gap-3 mt-4">
              <button
                className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition text-sm text-white"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" /> Cancel
              </button>
              <button
                className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition shadow-lg text-sm text-white"
                onClick={handleSubmit}
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                {isEditing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}