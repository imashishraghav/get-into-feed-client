import { defineType, defineArrayMember, defineField } from 'sanity'
import { ImageIcon, LinkIcon, DocumentIcon, BulbOutlineIcon, ComponentIcon } from '@sanity/icons'

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      // 🟢 1. Typography Styles
      styles: [
        { title: 'Normal', value: 'normal' },
        // H1 is generally reserved for the main page title for SEO, so we start with H2 in the editor
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      // 🟢 2. Lists (Added Numbered Lists)
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' }
      ],
      // 🟢 3. Inline Marks & Decorators
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
          { title: 'Inline Code', value: 'code' } // Great for technical marketing terms
        ],
        // 🟢 4. Advanced Annotations (Links)
        annotations: [
          // External Link (With "Open in new tab" option)
          {
            name: 'link',
            type: 'object',
            title: 'External Link',
            icon: LinkIcon,
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) => Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
              {
                name: 'blank',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
          // Internal Link (Crucial for SEO - linking to other case studies or services)
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal Link',
            icon: DocumentIcon,
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: [
                  { type: 'caseStudy' },
                  // { type: 'service' }, // Uncomment if you have a service schema
                  // { type: 'post' }     // Uncomment if you have a blog post schema
                ],
              },
            ],
          },
        ],
      },
    }),

    // ==========================================
    // 🟢 5. CUSTOM BLOCKS (Rich Media & UI)
    // ==========================================

    // Advanced Image Block (With Alt, Caption, and Layout options)
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Text displayed below the image (optional).',
        }),
        defineField({
          name: 'layout',
          type: 'string',
          title: 'Layout Style',
          options: {
            list: [
              { title: 'Full Width', value: 'full' },
              { title: 'Inline / Wrapped', value: 'inline' },
            ],
            layout: 'radio',
          },
          initialValue: 'full',
        })
      ]
    }),

    // Callout / Highlight Box (For tips, warnings, or key metrics)
    defineArrayMember({
      name: 'callout',
      type: 'object',
      title: 'Callout Box',
      icon: BulbOutlineIcon,
      fields: [
        defineField({
          name: 'intent',
          type: 'string',
          title: 'Type',
          options: {
            list: [
              { title: 'Info (Blue)', value: 'info' },
              { title: 'Success (Teal/Green)', value: 'success' },
              { title: 'Warning (Yellow)', value: 'warning' },
            ],
            layout: 'radio'
          },
          initialValue: 'info'
        }),
        defineField({
          name: 'text',
          type: 'text',
          title: 'Callout Text',
          rows: 3,
          validation: (Rule) => Rule.required()
        })
      ],
      preview: {
        select: { title: 'text', subtitle: 'intent' },
        prepare({ title, subtitle }) {
          return { title: title, subtitle: `Callout: ${subtitle}`, icon: BulbOutlineIcon }
        }
      }
    }),

    // Inline CTA Button (To generate leads directly from inside an article)
    defineArrayMember({
      name: 'cta',
      type: 'object',
      title: 'Call to Action Button',
      icon: ComponentIcon,
      fields: [
        defineField({
          name: 'buttonText',
          type: 'string',
          title: 'Button Text',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'link',
          type: 'url',
          title: 'Button Link',
          validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
        }),
      ],
      preview: {
        select: { title: 'buttonText', subtitle: 'link' },
        prepare({ title, subtitle }) {
          return { title: `CTA: ${title}`, subtitle, icon: ComponentIcon }
        }
      }
    }),

  ],
})