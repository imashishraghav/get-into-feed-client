import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function CreativeDeliveryBoard({ project, onUpdateProject, isClientView = false }) {
  const deliverables = project?.reelsDeliverables || [];
  const [selectedReelId, setSelectedReelId] = useState(deliverables[0]?.id || 'reel_singh_01');
  const [selectedVersion, setSelectedVersion] = useState('v2');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(4); // default 4 seconds
  const [newCommentText, setNewCommentText] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const activeReel = deliverables.find((r) => r.id === selectedReelId) || deliverables[0];

  const formatSeconds = (sec) => {
    const s = Math.floor(sec);
    return `00:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (sec) => {
    setCurrentTimeSec(sec);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeReel) return;

    const timeStr = formatSeconds(currentTimeSec);
    const newComment = {
      id: `c_${Date.now()}`,
      timestamp: timeStr,
      author: isClientView ? (project?.clientName || 'Client') : 'Ashish (Founder)',
      text: newCommentText.trim(),
      resolved: false
    };

    activeReel.comments.push(newComment);
    setNewCommentText('');
    setFeedbackSuccess(`Comment pinned at ${timeStr}!`);
    setTimeout(() => setFeedbackSuccess(''), 3000);

    if (onUpdateProject) {
      onUpdateProject({ ...project });
    }
  };

  const handleApproveReel = () => {
    if (!activeReel) return;
    activeReel.status = 'approved';
    setFeedbackSuccess('Reel approved! Dispatched to Performance Ads team for campaign scaling.');
    setTimeout(() => setFeedbackSuccess(''), 3500);
    if (onUpdateProject) onUpdateProject({ ...project });
  };

  const handleRequestRevision = () => {
    if (!activeReel) return;
    activeReel.status = 'pending_approval';
    setFeedbackSuccess('Revision request logged. Rahul Verma (Video Editor) notified via WhatsApp.');
    setTimeout(() => setFeedbackSuccess(''), 3500);
    if (onUpdateProject) onUpdateProject({ ...project });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-3 h-3" />
              12 Reels Creative Studio
            </span>
            <span className="text-xs text-slate-500 font-mono">Frame.io Style Review</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Vertical Video Review & Timestamped Approvals
          </h2>
          <p className="text-xs text-slate-500">
            Pause video at any timestamp to leave exact pinpoint feedback for GetIntoFeed video editors.
          </p>
        </div>

        {/* Global Action CTA */}
        <div className="flex items-center gap-2">
          {activeReel?.status === 'approved' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Approved for Meta Ads
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRequestRevision}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
              >
                Request Revision
              </button>
              <button
                type="button"
                onClick={handleApproveReel}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Approve Reel
              </button>
            </>
          )}
        </div>
      </div>

      {feedbackSuccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 p-2.5 text-xs font-medium text-emerald-800 text-center flex items-center justify-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {feedbackSuccess}
        </div>
      )}

      {/* Main Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left: Deliverables List (3 cols) */}
        <div className="lg:col-span-3 p-4 bg-slate-50/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>Sprint Reels ({deliverables.length})</span>
            <span className="text-slate-400">12/mo</span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {deliverables.map((reel) => {
              const isSelected = reel.id === selectedReelId;
              const isApproved = reel.status === 'approved';
              return (
                <button
                  key={reel.id}
                  type="button"
                  onClick={() => {
                    setSelectedReelId(reel.id);
                    setSelectedVersion(reel.currentVersion);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex gap-3 ${
                    isSelected
                      ? 'bg-white border-blue-500 ring-2 ring-blue-100 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    className="w-12 h-16 object-cover rounded-md flex-shrink-0 bg-slate-100 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                        {reel.currentVersion} • {reel.duration}
                      </span>
                      {isApproved ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          Review
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-slate-900 line-clamp-2 leading-snug">
                      {reel.title}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{reel.comments?.length || 0} comments</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: 9:16 Vertical Video Player Simulation (5 cols) */}
        <div className="lg:col-span-5 p-5 flex flex-col items-center justify-center bg-slate-900 text-white relative select-none">
          {/* Version Selector Tabs */}
          <div className="w-full flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              {['v1', 'v2', 'v3'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedVersion(v)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    selectedVersion === v
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {v.toUpperCase()} {activeReel?.currentVersion === v ? '(Current)' : ''}
                </button>
              ))}
            </div>

            <span className="text-slate-400 font-mono text-xs">
              Frame {Math.round(currentTimeSec * 30)} / 900
            </span>
          </div>

          {/* 9:16 Vertical Frame Container */}
          <div className="relative w-[240px] sm:w-[260px] aspect-[9/16] bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700/60 flex flex-col justify-between group">
            {/* Background image mockup simulating vertical video */}
            <img
              src={activeReel?.thumbnailUrl}
              alt="Video Preview"
              className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

            {/* Top Reel Info Overlay */}
            <div className="relative p-3 flex items-center justify-between text-xs text-white">
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs font-mono text-[10px] font-bold">
                9:16 HD 1080×1920
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-[10px] font-bold uppercase tracking-wider">
                REC
              </span>
            </div>

            {/* Center Play / Pause Icon Button */}
            <div className="relative flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-lg"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </button>
            </div>

            {/* Bottom Playback & Scrubber Controls */}
            <div className="relative p-3 space-y-2 bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>{formatSeconds(currentTimeSec)}</span>
                <span>{activeReel?.duration || '00:26'}</span>
              </div>

              {/* Scrub Slider */}
              <input
                type="range"
                min="0"
                max="26"
                step="1"
                value={currentTimeSec}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />

              {/* Timestamp Markers for Comments */}
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                {activeReel?.comments?.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      const [m, s] = c.timestamp.split(':');
                      handleSeek(Number(s));
                    }}
                    className="hover:text-blue-400 font-mono flex items-center gap-0.5 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700"
                    title={c.text}
                  >
                    📍 {c.timestamp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Click timestamps below or drag slider to pin comment at exact second.
          </p>
        </div>

        {/* Right: Timestamped Comments & Revision Feed (4 cols) */}
        <div className="lg:col-span-4 p-4 flex flex-col h-full bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              Timestamped Feedback ({activeReel?.comments?.length || 0})
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              Current: {formatSeconds(currentTimeSec)}
            </span>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[380px]">
            {(!activeReel?.comments || activeReel.comments.length === 0) ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <Clock className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                No comments yet. Pause video to pin feedback.
              </div>
            ) : (
              activeReel.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-lg border text-xs transition-colors ${
                    comment.resolved
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : 'bg-blue-50/40 border-blue-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const [, s] = comment.timestamp.split(':');
                        handleSeek(Number(s));
                      }}
                      className="inline-flex items-center gap-1 font-mono font-bold text-blue-700 bg-blue-100/80 hover:bg-blue-200 px-1.5 py-0.5 rounded text-[10px]"
                    >
                      <Clock className="w-2.5 h-2.5" />
                      {comment.timestamp}
                    </button>
                    <span className="font-semibold text-slate-800 text-[11px]">
                      {comment.author}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Feedback Input pinned to current timestamp */}
          <form onSubmit={handleAddComment} className="pt-3 border-t border-slate-200 mt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Pinning at: <strong className="font-mono text-blue-600">{formatSeconds(currentTimeSec)}</strong></span>
              <span className="text-slate-400">Enter to submit</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="e.g. Enlarge hook text, fix audio volume..."
                className="w-full text-xs pl-3 pr-9 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="absolute right-1.5 top-1.5 p-1 text-slate-400 hover:text-blue-600 disabled:opacity-40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
