import React, { useState } from 'react';
import { 
  Play, 
  Video, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  Filter,
  Check,
  Send,
  RotateCcw,
  X
} from 'lucide-react';
import { ACTIVE_PROJECTS } from '../data/projectData.js';

export function ReelsStudioView({ currentUser, onShowToast }) {
  const [activeProject, setActiveProject] = useState(ACTIVE_PROJECTS[0]);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending_approval', 'approved', 'draft'
  const [reviewingReel, setReviewingReel] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(4);
  const [newCommentText, setNewCommentText] = useState('');

  const reels = activeProject?.reelsDeliverables || [];

  const filteredReels = reels.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const approvedCount = reels.filter((r) => r.status === 'approved').length;
  const pendingCount = reels.filter((r) => r.status === 'pending_approval').length;

  const handleApprove = (reelId) => {
    const updated = reels.map((r) => (r.id === reelId ? { ...r, status: 'approved' } : r));
    setActiveProject({ ...activeProject, reelsDeliverables: updated });
    if (reviewingReel?.id === reelId) {
      setReviewingReel({ ...reviewingReel, status: 'approved' });
    }
    onShowToast?.('Reel approved! Dispatched to Performance Marketing for Meta Ads scaling.');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !reviewingReel) return;

    const timeStr = `00:${currentTimeSec < 10 ? '0' : ''}${currentTimeSec}`;
    const comment = {
      id: `c_${Date.now()}`,
      timestamp: timeStr,
      author: currentUser?.name || 'Reviewer',
      text: newCommentText.trim(),
      resolved: false
    };

    const updatedComments = [...(reviewingReel.comments || []), comment];
    const updatedReel = { ...reviewingReel, comments: updatedComments };
    const updatedReels = reels.map((r) => (r.id === reviewingReel.id ? updatedReel : r));

    setReviewingReel(updatedReel);
    setActiveProject({ ...activeProject, reelsDeliverables: updatedReels });
    setNewCommentText('');
    onShowToast?.(`Comment pinned at ${timeStr}!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Monthly Content Retainer
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {approvedCount} / 12 Reels Ready
            </span>
          </div>
          <h2 className="text-[18px] font-semibold text-slate-900 mt-1">
            12 Reels Studio — {activeProject?.clientCompany || 'Singhania Couture'}
          </h2>
          <p className="text-[13px] text-slate-500 mt-0.5">
            9:16 vertical reels review with Frame.io style timestamped pins and 1-tap Meta Ads hand-off
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({reels.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending_approval')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition flex items-center gap-1 ${
              statusFilter === 'pending_approval'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            In Review ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition ${
              statusFilter === 'approved'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3-COLUMN 9:16 MEDIA CARD GRID
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReels.map((reel) => {
          const isApproved = reel.status === 'approved';
          const isReview = reel.status === 'pending_approval';

          return (
            <div
              key={reel.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-subtle hover:border-slate-300 transition-colors flex flex-col group"
            >
              {/* 9:16 Preview Frame */}
              <div 
                onClick={() => setReviewingReel(reel)}
                className="relative aspect-[9/16] bg-slate-900 overflow-hidden cursor-pointer"
              >
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    {reel.duration}
                  </span>
                  {isApproved ? (
                    <span className="bg-emerald-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Check className="w-3 h-3" /> Approved
                    </span>
                  ) : (
                    <span className="bg-amber-400 text-slate-950 text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                      Client Review
                    </span>
                  )}
                </div>

                {/* Play Button Indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                </div>

                {/* Bottom Hook Title */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] text-slate-300 font-mono block">
                    Version: {reel.currentVersion} • {reel.comments?.length || 0} pinned notes
                  </span>
                  <h4 className="text-[14px] font-semibold leading-snug line-clamp-2 mt-0.5">
                    {reel.title}
                  </h4>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[12px] text-slate-500 font-medium truncate">
                  Rahul Verma (Editor)
                </span>

                <button
                  onClick={() => setReviewingReel(reel)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-[12px] px-3.5 py-1.5 rounded-lg transition shrink-0"
                >
                  Review &amp; Approve
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FRAME.IO STYLE VIDEO REVIEW MODAL
          ───────────────────────────────────────────────────────────── */}
      {reviewingReel && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div 
            onClick={() => setReviewingReel(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row z-10">
            
            {/* Left: 9:16 Video Player Simulation */}
            <div className="md:w-1/2 bg-slate-950 p-6 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl bg-black">
                <img
                  src={reviewingReel.thumbnailUrl}
                  alt={reviewingReel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Clock className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </button>
                </div>
                {/* Timestamp watermark */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-mono">
                  00:0{currentTimeSec} / {reviewingReel.duration}
                </div>
              </div>

              {/* Scrubber bar */}
              <div className="w-full max-w-[280px] mt-4 space-y-1">
                <input
                  type="range"
                  min="0"
                  max="26"
                  value={currentTimeSec}
                  onChange={(e) => setCurrentTimeSec(Number(e.target.value))}
                  className="w-full accent-[#D4FF00] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>00:00</span>
                  <span>Scrub to pin feedback</span>
                  <span>{reviewingReel.duration}</span>
                </div>
              </div>
            </div>

            {/* Right: Comments, Versions & Approval */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar">
              
              <div>
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                      Reel Approval Workflow
                    </span>
                    <h3 className="text-[16px] font-semibold text-slate-900 mt-0.5">
                      {reviewingReel.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setReviewingReel(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Pinned Comments List */}
                <div className="mt-4 space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar">
                  <h4 className="text-[12px] font-semibold text-slate-700">
                    Pinned Timestamp Comments ({reviewingReel.comments?.length || 0})
                  </h4>
                  {reviewingReel.comments?.map((comment) => (
                    <div 
                      key={comment.id}
                      onClick={() => setCurrentTimeSec(parseInt(comment.timestamp.split(':')[1], 10) || 4)}
                      className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-colors cursor-pointer text-[12px]"
                    >
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-semibold text-slate-900">{comment.author}</span>
                        <span className="bg-slate-200 text-slate-800 font-mono text-[10px] px-1.5 py-0.2 rounded font-bold">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-600">{comment.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <form onSubmit={handleAddComment} className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    placeholder={`Pin feedback at 00:0${currentTimeSec}...`}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 text-[13px] text-slate-900 px-3 py-1.5 rounded-lg focus:outline-none focus:border-slate-400"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-[12px] px-3 py-1.5 rounded-lg transition"
                  >
                    Pin Note
                  </button>
                </form>
              </div>

              {/* Bottom Actions */}
              <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                <button
                  onClick={() => {
                    handleApprove(reviewingReel.id);
                  }}
                  className="flex-1 bg-[#D4FF00] hover:bg-[#c4ec00] text-slate-950 font-semibold text-[13px] py-2 px-4 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Approve Reel for Meta Ads
                </button>

                <button
                  onClick={() => setReviewingReel(null)}
                  className="text-slate-500 hover:text-slate-800 text-[12px] font-medium px-3 py-2"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}