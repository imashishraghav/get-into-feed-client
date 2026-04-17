export default {
  name: 'service',
  title: 'Services',
  type: 'document',
  // FIELDSETS: Sanity Studio ko clean aur organized rakhne ke liye
  fieldsets: [
    { name: 'general', title: '1. General Info & Grid Display', options: { collapsible: true, collapsed: false } },
    { name: 'hero', title: '2. Service Page Hero Section', options: { collapsible: true, collapsed: false } },
    { name: 'details', title: '3. Detailed Content & Deliverables', options: { collapsible: true, collapsed: false } },
    { name: 'faqs', title: '4. Frequently Asked Questions', options: { collapsible: true, collapsed: true } },
    { name: 'seo', title: '5. SEO & Metadata', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // ----------------------------------------------------------------------
    // 1. GENERAL INFO (Cards & Grids ke liye)
    // ----------------------------------------------------------------------
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      fieldset: 'general',
      description: 'Services ko frontend par sort karne ke liye (e.g., 1, 2, 3).',
    },
    {
      name: 'title',
      title: 'Service Title',
      type: 'string',
      fieldset: 'general',
      description: 'Example: Performance Marketing',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      fieldset: 'general',
      description: 'Website par iska link kaisa dikhega (e.g., /services/performance-marketing)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'icon',
      title: 'Service Icon',
      type: 'image',
      fieldset: 'general',
      description: 'Homepage/Services page ke cards par dikhane ke liye icon.',
      options: { hotspot: true },
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      fieldset: 'general',
      description: 'Card par dikhane ke liye brief summary (Max 150 chars).',
      validation: (Rule) => Rule.required().max(150),
    },

    // ----------------------------------------------------------------------
    // 2. HERO SECTION (Jab user page open karega)
    // ----------------------------------------------------------------------
    {
      name: 'tagline',
      title: 'Hero Tagline',
      type: 'string',
      fieldset: 'hero',
      description: 'Example: "Dominate the feed with data-driven ad campaigns."',
    },
    {
      name: 'coverImage',
      title: 'Cover / Hero Image',
      type: 'image',
      fieldset: 'hero',
      description: 'Service detail page ka main banner ya high-quality image.',
      options: { hotspot: true },
    },

    // ----------------------------------------------------------------------
    // 3. DETAILED CONTENT & DELIVERABLES
    // ----------------------------------------------------------------------
    {
      name: 'content',
      title: 'Main Content Body',
      type: 'array',
      fieldset: 'details',
      description: 'Service ka in-depth explanation.',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } }
      ],
    },
    {
      name: 'deliverables',
      title: 'What\'s Included (Deliverables)',
      type: 'array',
      fieldset: 'details',
      description: 'Clients ko is service mein exact kya milega? (Checklist item)',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Deliverable Title', type: 'string', description: 'e.g., Custom Ad Creatives' },
            { name: 'description', title: 'Short Description', type: 'string', description: 'e.g., We design 10 high-converting creatives monthly.' }
          ]
        }
      ]
    },

    // ----------------------------------------------------------------------
    // 4. FAQs
    // ----------------------------------------------------------------------
    {
      name: 'faqs',
      title: 'Service FAQs',
      type: 'array',
      fieldset: 'faqs',
      description: 'Common questions related to this specific service.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text', rows: 3 }
          ]
        }
      ]
    },

    // ----------------------------------------------------------------------
    // 5. SEO & METADATA
    // ----------------------------------------------------------------------
    {
      name: 'seoTitle',
      title: 'SEO Meta Title',
      type: 'string',
      fieldset: 'seo',
      description: 'Agar empty chhoda, toh Service Title use hoga.',
      validation: (Rule) => Rule.max(60).warning('Optimal SEO title is under 60 characters.')
    },
    {
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 2,
      fieldset: 'seo',
      description: 'Google search results mein dikhne wala text.',
      validation: (Rule) => Rule.max(160).warning('Optimal SEO description is under 160 characters.')
    }
  ],

  // ----------------------------------------------------------------------
  // SANITY STUDIO PREVIEW
  // ----------------------------------------------------------------------
  preview: {
    select: {
      title: 'title',
      subtitle: 'tagline',
      media: 'icon'
    }
  }
}