import { UserIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Team & Authors', // Renamed to fit an agency structure
  type: 'document',
  icon: UserIcon,
  
  // 🟢 1. Field Groups for a clean Sanity Studio UI
  groups: [
    { name: 'profile', title: 'Core Profile', default: true },
    { name: 'bio', title: 'Biography' },
    { name: 'social', title: 'Social Links' },
  ],
  
  fields: [
    // ==========================================
    // GROUP: CORE PROFILE
    // ==========================================
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      group: 'profile',
      validation: (Rule) => Rule.required().error('Author ka naam zaroori hai.'),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'profile',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Designation',
      type: 'string',
      group: 'profile',
      description: 'Example: Founder, Digital Marketing Manager, SEO Specialist',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Profile Picture',
      type: 'image',
      group: 'profile',
      options: {
        hotspot: true, // Enables precise cropping in Sanity
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'SEO aur Accessibility ke liye important hai.',
        }
      ]
    }),

    // ==========================================
    // GROUP: BIOGRAPHY
    // ==========================================
    defineField({
      name: 'shortBio',
      title: 'Short Bio (For Author Cards)',
      type: 'text',
      group: 'bio',
      rows: 3,
      description: 'Blog post ke bottom mein dikhane ke liye (Max 200 characters).',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'fullBio',
      title: 'Full Biography',
      type: 'array',
      group: 'bio',
      description: 'Author ki detailed profile page ke liye full story.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ],
          lists: [{ title: 'Bullet Points', value: 'bullet' }],
        }),
      ],
    }),

    // ==========================================
    // GROUP: SOCIAL LINKS
    // ==========================================
    defineField({
      name: 'socials',
      title: 'Social Media Links',
      type: 'object',
      group: 'social',
      fields: [
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
          validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
        },
        {
          name: 'twitter',
          title: 'X (Twitter) URL',
          type: 'url',
          validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
        },
        {
          name: 'email',
          title: 'Public Email Address',
          type: 'string',
          // Regex validation for proper email format
          validation: (Rule) => Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).error('Please enter a valid email address'),
        }
      ]
    }),
  ],

  // 🟢 2. Advanced Preview Logic
  preview: {
    select: {
      title: 'name',
      subtitle: 'role', // Fetches the role for the subtitle
      media: 'image',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title,
        // Dashboard mein Author ke naam ke niche uski designation dikhegi
        subtitle: subtitle ? `💼 ${subtitle}` : 'Team Member',
        media: media,
      }
    },
  },
})