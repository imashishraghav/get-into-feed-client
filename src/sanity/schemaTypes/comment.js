export default {
  name: 'comment',
  type: 'document',
  title: 'Comment',
  icon: () => '💬', 
  
  // Tabs in CMS
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'moderation', title: 'Moderation' },
    { name: 'metrics', title: 'Metrics' },
  ],

  fields: [
    // ================= CONTENT GROUP =================
    {
      name: 'name',
      type: 'string',
      title: 'Author Name',
      group: 'content',
      validation: (Rule) => Rule.required().min(2).max(50),
    },
    {
      name: 'email',
      type: 'string',
      title: 'Author Email',
      group: 'content',
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: 'comment',
      type: 'text',
      title: 'Comment Body',
      group: 'content',
      validation: (Rule) => Rule.required().min(3).max(1000),
    },
    {
      name: 'post',
      type: 'reference',
      to: [{ type: 'post' }],
      title: 'Related Post',
      group: 'content',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'parentComment',
      type: 'reference',
      to: [{ type: 'comment' }],
      title: 'Parent Comment (For Replies)',
      group: 'content',
    },

    // ================= MODERATION GROUP =================
    // 🟢 FIX: 'approved' field wapas aa gayi hai!
    {
      name: 'approved',
      type: 'boolean',
      title: 'Approve Comment',
      description: "Turn this ON to show the comment on the website.",
      group: 'moderation',
      initialValue: false,
    },
    {
      name: 'isPinned',
      type: 'boolean',
      title: 'Pin this comment?',
      description: 'Pinned comments will appear at the very top of the discussion.',
      group: 'moderation',
      initialValue: false,
    },

    // ================= METRICS GROUP =================
    {
      name: 'likes',
      type: 'number',
      title: 'Total Likes',
      group: 'metrics',
      initialValue: 0,
      readOnly: true, 
    },
  ],

  // Preview setup updated for 'approved' boolean
  preview: {
    select: {
      title: 'name',
      subtitle: 'comment',
      approved: 'approved', // 🟢 Using approved field here
      isPinned: 'isPinned'
    },
    prepare({ title, subtitle, approved, isPinned }) {
      // ✅ Agar approved true hai toh Green Tick, warna Wait icon
      const statusIcon = approved ? '✅' : '⏳';
      const pinIcon = isPinned ? ' 📌' : '';

      return {
        title: `${title}${pinIcon}`,
        subtitle: `${statusIcon} - ${subtitle}`,
      };
    },
  },
};