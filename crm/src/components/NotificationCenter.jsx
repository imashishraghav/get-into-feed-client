import React, { useState } from 'react';

export function NotificationCenter({ onSelectLead, leads = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_01',
      title: '⏱️ 5-Min SLA Critical Alert',
      message: 'Vikramaditya (LuxeLiving Realty) has 01:42 remaining for first response.',
      category: 'SLA',
      time: '1m ago',
      unread: true,
      leadId: leads[0]?.id
    },
    {
      id: 'notif_02',
      title: '📄 Proposal Viewed in Real-Time',
      message: 'Sneha Kapur opened the 30-Day Growth Sprint proposal link.',
      category: 'Deals',
      time: '14m ago',
      unread: true,
      leadId: leads[1]?.id
    },
    {
      id: 'notif_03',
      title: '🧾 Razorpay UPI Payment Received',
      message: '₹1,77,000 received for Invoice #GIF/26-27/0104. Retainer marked Won.',
      category: 'Billing',
      time: '1h ago',
      unread: false,
      leadId: leads[2]?.id
    }
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="relative">
      
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-sm relative transition"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 p-3 space-y-2 text-xs animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-slate-100">Notifications ({unreadCount})</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] text-blue-600 font-semibold hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1.5">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  n.unread = false;
                  setIsOpen(false);
                  const matched = leads.find((l) => l.id === n.leadId);
                  if (matched) onSelectLead?.(matched);
                }}
                className={`p-2.5 rounded-xl border transition cursor-pointer ${
                  n.unread
                    ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900'
                    : 'bg-white dark:bg-slate-850 border-slate-100 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5">
                  <span className="font-bold text-blue-700 dark:text-blue-300">{n.category}</span>
                  <span>{n.time}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{n.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
