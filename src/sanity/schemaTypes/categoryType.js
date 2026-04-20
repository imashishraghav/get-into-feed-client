import { defineType, defineField } from 'sanity'
import { TagIcon, ComponentIcon, EarthGlobeIcon } from '@sanity/icons'

export const categoryType = defineType({
  name: 'category',
  title: 'Blog Categories',
  type: 'document',
  icon: TagIcon,
  
  // 🟢 1. Clean UI Tabs
  groups: [
    { name: 'core', title: 'Core Details', default: true, icon: TagIcon },
    { name: 'visuals', title: 'Visuals & UI', icon: ComponentIcon },
    { name: 'seo', title: 'SEO Settings', icon: EarthGlobeIcon },
  ],

  fields: [
    // ==========================================
    // GROUP: CORE DETAILS
    // ==========================================
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      group: 'core',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'core',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      group: 'core',
      to: [{ type: 'category' }],
      description: 'Agar yeh ek sub-category hai (e.g. "Google Ads" under "Performance Marketing"), toh yahan parent select karein.',
    }),
    defineField({
      name: 'description',
      title: 'Category Description',
      type: 'text',
      group: 'core',
      rows: 3,
      description: 'Category ke archive page par hero section mein dikhane ke liye.',
    }),

    // ==========================================
    // GROUP: VISUALS & UI
    // ==========================================
    defineField({
      name: 'colorTheme',
      title: 'Tag Color Theme',
      type: 'string',
      group: 'visuals',
      description: 'Frontend par is category ke badge ka color kaisa hoga?',
      options: {
        list: [
          { title: 'Agency Teal (Primary)', value: 'teal' },
          { title: 'Indigo / Purple', value: 'indigo' },
          { title: 'Rose / Red', value: 'rose' },
          { title: 'Amber / Yellow', value: 'amber' },
          { title: 'Slate / Gray', value: 'slate' },
        ],
        layout: 'radio',
      },
      initialValue: 'teal',
    }),
    defineField({
      name: 'image',
      title: 'Category Cover Image',
      type: 'image',
      group: 'visuals',
      options: { hotspot: true },
      description: 'Optional: Category page ke background ya hero section ke liye.',
    }),

    // ==========================================
    // GROUP: SEO SETTINGS
    // ==========================================
    defineField({
      name: 'seoTitle',
      title: 'SEO Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Ideally under 60 characters. Leave blank to use the Category Title.',
      validation: (Rule) => Rule.max(60).warning('Keep it under 60 characters for best Google display.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      group: 'seo',
      rows: 2,
      description: 'Ideally 150-160 characters for Google search results.',
      validation: (Rule) => Rule.max(160).warning('Longer descriptions will be truncated by search engines.'),
    }),
  ],

  // 🟢 2. Smart Preview in Sanity Studio
  preview: {
    select: {
      title: 'title',
      parentName: 'parent.title',
      media: 'image',
      color: 'colorTheme',
    },
    prepare(selection) {
      const { title, parentName, media, color } = selection
      return {
        title: title,
        // Dikhata hai ki iska parent kon hai aur konsa color selected hai
        subtitle: `${parentName ? `↳ Sub-category of ${parentName}` : 'Main Category'} | 🎨 ${color}`,
        media: media || TagIcon,
      }
    },
  },
})