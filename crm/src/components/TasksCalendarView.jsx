import React, { useState } from 'react';
import { createAgencyMeeting } from '../utils/calendarScheduler.js';

export function TasksCalendarView({ leads = [], onShowToast }) {
  const [tasks, setTasks] = useState([
    {
      id: 'tsk_01',
      title: 'Conduct 15-Min Creative Audit Call with Vikram (LuxeLiving)',
      leadName: 'Vikramaditya Singhania',
      company: 'LuxeLiving Realty',
      priority: 'URGENT',
      dueDate: 'Today, 4:00 PM',
      completed: false,
      assignee: 'Ashish (Founder)',
      meetUrl: 'https://meet.google.com/gif-revops-aud'
    },
    {
      id: 'tsk_02',
      title: 'Review Script Hook for Reel #09 UGC Concept',
      leadName: 'Sneha Kapur',
      company: 'GlowUp Skincare',
      priority: 'HIGH',
      dueDate: 'Tomorrow, 11:30 AM',
      completed: false,
      assignee: 'Simran (Reels Lead)',
      meetUrl: null
    },
    {
      id: 'tsk_03',
      title: 'Follow Up on Retainer Proposal Dispatch (48h Window)',
      leadName: 'Rohit Verma',
      company: 'UrbanFit Gyms',
      priority: 'NORMAL',
      dueDate: 'Nov 26, 2:00 PM',
      completed: true,
      assignee: 'Rahul (Sales Lead)',
      meetUrl: null
    }
  ]);

  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [meetingTitle, setMeetingTitle] = useState('Growth Sprint Strategy Call');
  const [meetingTime, setMeetingTime] = useState('Today at 5:00 PM');

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === selectedLeadId) || leads[0];
    const meeting = createAgencyMeeting({
      lead,
      title: meetingTitle,
      scheduledAt: meetingTime
    });

    setTasks((prev) => [
      {
        id: `tsk_${Date.now()}`,
        title: meeting.title,
        leadName: lead.name,
        company: lead.company,
        priority: 'HIGH',
        dueDate: meetingTime,
        completed: false,
        assignee: 'Ashish (Founder)',
        meetUrl: meeting.meet_url
      },
      ...prev
    ]);

    setIsMeetingModalOpen(false);
    onShowToast?.(`Meeting scheduled with Google Meet link generated!`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 text-xs">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">Tasks & Meeting Hub</h2>
          <p className="text-slate-500">Track client deliverables, follow-up SLAs, and scheduled Google Meet audits</p>
        </div>

        <button
          onClick={() => setIsMeetingModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition"
        >
          <span>📅</span> Schedule Discovery Call
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto pt-4 space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
              task.completed
                ? 'bg-slate-50 dark:bg-slate-850/50 border-slate-200 dark:border-slate-800 opacity-60'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
              <div>
                <span className={`font-bold text-slate-900 dark:text-slate-100 block ${task.completed ? 'line-through text-slate-400' : ''}`}>
                  {task.title}
                </span>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>🏢 {task.company}</span>
                  <span>•</span>
                  <span>👤 {task.assignee}</span>
                  <span>•</span>
                  <span>⏱️ {task.dueDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {task.meetUrl && (
                <a
                  href={task.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px] hover:bg-blue-100 transition"
                >
                  Join Google Meet 🎥
                </a>
              )}
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                task.priority === 'URGENT'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : task.priority === 'HIGH'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Meeting Booking Modal */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-black text-sm">Schedule Discovery Audit Call</h3>
              <button onClick={() => setIsMeetingModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleScheduleMeeting} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Select Client / Lead</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.company})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Meeting Title</label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Date & Time</label>
                <input
                  type="text"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  placeholder="e.g. Tomorrow at 3:00 PM IST"
                  className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-xl text-blue-900 dark:text-blue-200 text-[11px]">
                ✓ A unique Google Meet room will be generated and synchronized to the lead timeline.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMeetingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Confirm & Generate Link ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
