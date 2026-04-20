import { defineType, defineField, defineArrayMember } from 'sanity'
import { 
  PresentationIcon, 
  BarChartIcon, 
  EarthGlobeIcon, 
  ControlsIcon,
  UserIcon
} from '@sanity/icons'

export default defineType({
  name: 'caseStudy',
  title: 'Case Studies',
  type: 'document',
  icon: PresentationIcon,
  
  // 🟢 1. Extended Field Groups (Now with SEO & Settings)
  groups: [
    { name: 'core', title: 'Core Info', default: true },
    { name: 'narrative', title: 'The Narrative' },
    { name: 'metrics', title: 'Results & Impact', icon: BarChartIcon },
    { name: 'media', title: 'Media & Proof' },
    { name: 'seo', title: 'SEO & Social', icon: EarthGlobeIcon },
    { name: 'settings', title: 'Settings', icon: ControlsIcon },
  ],

  fields: [
    // ==========================================
    // GROUP: CORE INFO
    // ==========================================
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      group: 'core',
      description: 'Keep it catchy. Example: Scaling Luxury Real Estate with High-Intent Funnels',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'core',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientName',
      title: 'Client / Brand Name',
      type: 'string',
      group: 'core',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      group: 'core',
      description: 'Example: Real Estate, SaaS, E-commerce',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      group: 'core',
      rows: 3,
      description: 'Used on the Grid Cards. Keep it under 2-3 lines.',
      validation: (Rule) => Rule.required().max(200),
    }),

    // ==========================================
    // GROUP: THE NARRATIVE
    // ==========================================
    defineField({
      name: 'overview',
      title: 'Project Overview',
      type: 'text',
      group: 'narrative',
      rows: 4,
    }),
    defineField({
      name: 'problem',
      title: 'The Challenge (Pain Points)',
      type: 'array',
      group: 'narrative',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'strategy',
      title: 'Our Strategy',
      type: 'text',
      group: 'narrative',
      rows: 5,
    }),
    defineField({
      name: 'execution',
      title: 'Execution Steps',
      type: 'array',
      group: 'narrative',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'conclusion',
      title: 'Key Takeaways',
      type: 'array',
      group: 'narrative',
      of: [defineArrayMember({ type: 'string' })],
    }),

    // ==========================================
    // GROUP: RESULTS & IMPACT
    // ==========================================
    defineField({
      name: 'result',
      title: 'Card Highlight Result (Single)',
      type: 'string',
      group: 'metrics',
      description: 'Shown on the Grid Card. Example: +320% Leads',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'results',
      title: 'Detailed Results (Multiple)',
      type: 'array',
      group: 'metrics',
      of: [
        defineArrayMember({
          type: 'object',
          icon: BarChartIcon,
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. +120%' }),
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. Surge in Inquiries' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
            prepare({ title, subtitle }) {
              return { title, subtitle: `Metric: ${subtitle}`, icon: BarChartIcon }
            }
          }
        }),
      ],
    }),
    defineField({
      name: 'testimonial',
      title: 'Client Testimonial',
      type: 'object',
      group: 'metrics',
      icon: UserIcon,
      fields: [
        defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4 }),
        defineField({ name: 'name', title: 'Client Name', type: 'string' }),
        defineField({ name: 'role', title: 'Role', type: 'string' }),
        defineField({ name: 'company', title: 'Company (Optional)', type: 'string' }),
        // 🟢 NAYA: Client Avatar Upload
        defineField({ name: 'image', title: 'Client Avatar', type: 'image', options: { hotspot: true } }),
      ],
    }),

    // ==========================================
    // GROUP: MEDIA & PROOF
    // ==========================================
    defineField({
      name: 'image',
      title: 'Cover Image (Thumbnail)',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'images',
      title: 'Behind the Scenes (Screenshots)',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
    }),

    // ==========================================
    // 🟢 NEW GROUP: SEO & SOCIAL
    // ==========================================
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'If blank, the Project Title will be used (Max 60 chars).',
      validation: (Rule) => Rule.max(60).warning('Longer titles may be truncated by Google.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 2,
      description: 'Optimal length is 150-160 characters.',
      validation: (Rule) => Rule.max(160).warning('Keep it under 160 characters for best SEO.'),
    }),

    // ==========================================
    // 🟢 NEW GROUP: SETTINGS
    // ==========================================
    defineField({
      name: 'isFeatured',
      title: 'Featured Case Study',
      type: 'boolean',
      group: 'settings',
      description: 'Turn this on to show this case study on the Homepage.',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      group: 'settings',
      initialValue: () => new Date().toISOString(),
    }),
  ],

  // 🟢 Advanced Sanity Studio Preview
  preview: {
    select: {
      title: 'title',
      client: 'clientName',
      media: 'image',
      result: 'result',
      isFeatured: 'isFeatured',
    },
    prepare(selection) {
      const { title, client, media, result, isFeatured } = selection
      return {
        title: title,
        // Dikhata hai ki featured hai ya nahi
        subtitle: `${isFeatured ? '⭐ FEATURED | ' : ''}${client} | 🔥 ${result || 'No result'}`,
        media: media,
      }
    },
  },
})