import { defineType, defineField, defineArrayMember } from 'sanity'
import { 
  DocumentTextIcon, 
  TextIcon, 
  ImageIcon, 
  EarthGlobeIcon, 
  ControlsIcon,
  LinkIcon 
} from '@sanity/icons'

export const postType = defineType({
  name: 'post',
  title: 'Blog Posts',
  type: 'document',
  icon: DocumentTextIcon,
  
  // 🟢 1. Clean UI Tabs for Editors & Content Writers
  groups: [
    { name: 'core', title: 'Core Details', default: true, icon: TextIcon },
    { name: 'content', title: 'Body Content', icon: DocumentTextIcon },
    { name: 'media', title: 'Media', icon: ImageIcon },
    { name: 'seo', title: 'SEO Settings', icon: EarthGlobeIcon },
    { name: 'settings', title: 'Settings & Links', icon: ControlsIcon },
  ],

  fields: [
    // ==========================================
    // GROUP: CORE DETAILS
    // ==========================================
    defineField({
      name: 'title',
      title: 'Post Title',
      type: 'string',
      group: 'core',
      description: 'Keep it engaging. Example: The 2026 Guide to Scaling Google Ads',
      validation: (Rule) => Rule.required().max(90),
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
      name: 'excerpt',
      title: 'Short Excerpt / Summary',
      type: 'text',
      group: 'core',
      rows: 3,
      description: 'Blog Grid Cards aur Homepage par dikhane ke liye (Max 200 chars).',
      validation: (Rule) => Rule.required().max(250),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'core',
      to: { type: 'author' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'core',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
      description: 'Select 1 or 2 relevant categories.',
      validation: (Rule) => Rule.required().min(1),
    }),

    // ==========================================
    // GROUP: BODY CONTENT
    // ==========================================
    defineField({
      name: 'body',
      title: 'Main Content',
      type: 'blockContent', // Yeh aapka advanced blockContent use karega
      group: 'content',
      description: 'Yahan apna pura article likhein. Use headers, images, and CTAs.',
      validation: (Rule) => Rule.required(),
    }),

    // ==========================================
    // GROUP: MEDIA
    // ==========================================
    defineField({
      name: 'mainImage',
      title: 'Featured Cover Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'SEO ke liye important hai. Image ko describe karein.',
          validation: (Rule) => Rule.required(),
        })
      ]
    }),

    // ==========================================
    // GROUP: SEO SETTINGS
    // ==========================================
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Override the default title for Search Engines (Max 60 chars).',
      validation: (Rule) => Rule.max(60).warning('Keep it under 60 characters for best Google display.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      group: 'seo',
      rows: 2,
      description: 'Google search results snippet (Max 160 chars).',
      validation: (Rule) => Rule.max(160).warning('Keep it under 160 characters.'),
    }),

    // ==========================================
    // GROUP: SETTINGS & LINKS
    // ==========================================
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      group: 'settings',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Feature this Post?',
      type: 'boolean',
      group: 'settings',
      description: 'Toggle ON to pin this to the top of the Blog or Homepage.',
      initialValue: false,
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Articles (Internal Linking)',
      type: 'array',
      group: 'settings',
      icon: LinkIcon,
      of: [defineArrayMember({ type: 'reference', to: { type: 'post' } })],
      description: 'Manually select 2-3 posts to show at the bottom for better user retention.',
      validation: (Rule) => Rule.max(3),
    }),
  ],

  // 🟢 2. Smart Sanity Dashboard Preview
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      isFeatured: 'isFeatured',
      category: 'categories.0.title', // Gets the first category
    },
    prepare(selection) {
      const { title, author, media, isFeatured, category } = selection
      return {
        title: title,
        subtitle: `${isFeatured ? '⭐ FEATURED | ' : ''}✍️ ${author || 'No Author'} | 🏷️ ${category || 'Uncategorized'}`,
        media: media || DocumentTextIcon,
      }
    },
  },
})