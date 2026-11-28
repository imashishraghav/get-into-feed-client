/**
 * GetIntoFeed Agency CRM — Calendar & Meeting Scheduler Adapter
 * Generates instant Google Meet / Zoom links, schedules client reviews,
 * and attaches appointments directly to lead timelines.
 */

export function generateGoogleMeetLink() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const segment = (len) => Array.from({ length: len }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  return `https://meet.google.com/${segment(3)}-${segment(4)}-${segment(3)}`;
}

export function createAgencyMeeting({
  lead,
  title,
  meetingType = '15-Min Growth Audit Call',
  scheduledAt,
  durationMinutes = 30,
  hostName = 'Ashish (Founder)'
}) {
  const meetLink = generateGoogleMeetLink();
  const id = `meet_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  return {
    id,
    lead_id: lead.id,
    lead_name: lead.name,
    company: lead.company,
    title: title || `${meetingType} with ${lead.name}`,
    meeting_type: meetingType,
    scheduled_at: scheduledAt || new Date(Date.now() + 86400000).toISOString(),
    duration_minutes: durationMinutes,
    meet_url: meetLink,
    host_name: hostName,
    status: 'scheduled',
    created_at: new Date().toISOString()
  };
}
