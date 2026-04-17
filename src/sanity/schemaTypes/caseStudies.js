export default {
  name: 'caseStudies',
  title: 'Case Studies',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      description: 'Example: Scaling E-commerce Brand X',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'client',
      title: 'Client / Brand Name',
      type: 'string',
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      description: 'High quality image for the case study card',
    },
    {
      name: 'category',
      title: 'Service Category',
      type: 'string',
      description: 'Example: Performance Ads, SEO, Social Growth',
    },
    {
      name: 'highlightStat',
      title: 'Highlight Stat Value (The Big Number)',
      type: 'string',
      description: 'Example: 340% or 10x or 2.1M',
    },
    {
      name: 'highlightLabel',
      title: 'Highlight Stat Label',
      type: 'string',
      description: 'Example: ROAS Increase or Organic Traffic',
    },
    {
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      description: 'Card par dikhane ke liye short description',
    },
    {
      name: 'content',
      title: 'Full Case Study Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    },
  ],
}