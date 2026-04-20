import { defineType, defineField } from 'sanity'
import { CommentIcon, StarIcon, UserIcon, PresentationIcon } from '@sanity/icons'

export default defineType({
  name: 'testimonial',
  title: 'Client Testimonials',
  type: 'document',
  icon: CommentIcon,

  // 🟢 1. Clean UI Tabs for the Team
  groups: [
    { name: 'client', title: 'Client Details', default: true, icon: UserIcon },
    { name: 'content', title: 'Feedback & Media', icon: CommentIcon },
    { name: 'metrics', title: 'Tags & ROI', icon: PresentationIcon },
    { name: 'settings', title: 'Settings', icon: StarIcon },
  ],

  fields: [
    // ==========================================
    // GROUP: CLIENT DETAILS
    // ==========================================
    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      group: 'client',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Designation',
      type: 'string',
      group: 'client',
      description: 'e.g., Founder, VP of Marketing, Real Estate Developer',
    }),
    defineField({
      name: 'company',
      title: 'Company Name',
      type: 'string',
      group: 'client',
    }),
    defineField({
      name: 'image',
      title: 'Client Avatar / Company Logo',
      type: 'image',
      group: 'client',
      options: { hotspot: true },
    }),

    // ==========================================
    // GROUP: FEEDBACK & MEDIA
    // ==========================================
    defineField({
      name: 'feedback',
      title: 'Client Feedback',
      type: 'text',
      group: 'content',
      rows: 4,
      validation: (Rule) => Rule.required(),
      description: 'Main testimonial text. Keep it impactful.',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video Testimonial URL (Optional)',
      type: 'url',
      group: 'content',
      description: 'YouTube or Vimeo link. Video testimonials build 10x more trust!',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),

    // ==========================================
    // GROUP: TAGS & ROI METRICS
    // ==========================================
    defineField({
      name: 'highlightMetric',
      title: 'Highlight Metric / Big Win',
      type: 'string',
      group: 'metrics',
      description: 'e.g., "Scaled to $100k/mo" or "3.5x ROAS". Frontend par highlight karne ke liye.',
    }),
    defineField({
      name: 'serviceTag',
      title: 'Related Service / Industry',
      type: 'string',
      group: 'metrics',
      options: {
        list: [
          { title: 'Performance Ads', value: 'Performance Ads' },
          { title: 'Luxury Real Estate', value: 'Luxury Real Estate' },
          { title: 'SEO & Content', value: 'SEO' },
          { title: 'Web Development', value: 'Web Development' },
        ],
      },
      description: 'Isse aap specific service page par wahi testimonials dikha payenge.',
    }),

    // ==========================================
    // GROUP: SETTINGS
    // ==========================================
    defineField({
      name: 'rating',
      title: 'Star Rating',
      type: 'number',
      group: 'settings',
      validation: (Rule) => Rule.min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'featured',
      title: 'Featured (Hero Testimonial)',
      type: 'boolean',
      group: 'settings',
      description: 'Turn ON to show this at the top of the Homepage or as a large card.',
      initialValue: false,
    }),
  ],

  // 🟢 2. Smart Preview in Sanity Studio
  preview: {
    select: {
      title: 'name',
      company: 'company',
      media: 'image',
      featured: 'featured',
      rating: 'rating'
    },
    prepare({ title, company, media, featured, rating }) {
      return {
        title: title,
        subtitle: `${featured ? '⭐ FEATURED | ' : ''}${company ? company + ' | ' : ''}${rating} Stars`,
        media: media || UserIcon,
      }
    },
  },
})