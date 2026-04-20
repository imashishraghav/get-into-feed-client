import { defineType, defineField, defineArrayMember } from 'sanity'
import { CaseIcon, ListIcon, CheckmarkCircleIcon, EarthAmericasIcon } from '@sanity/icons'

export default defineType({
  name: 'job',
  title: 'Job Postings',
  type: 'document',
  icon: CaseIcon, // Yahan bhi update kar dein agar pehle BriefcaseIcon tha
  // ... baaki code
  
  // 🟢 1. Clean UI Tabs for HR / Admin
  groups: [
    { name: 'core', title: 'Job Overview', default: true },
    { name: 'details', title: 'Responsibilities & Requirements', icon: ThListIcon },
    { name: 'perks', title: 'Benefits & Perks', icon: CheckmarkCircleIcon },
    { name: 'seo', title: 'SEO', icon: EarthGlobeIcon },
    { name: 'settings', title: 'Status & Apply' },
  ],

  fields: [
    // ==========================================
    // GROUP: JOB OVERVIEW
    // ==========================================
    defineField({
      name: 'role',
      title: 'Job Role / Title',
      type: 'string',
      group: 'core',
      description: 'Example: Senior Performance Marketer, Frontend Developer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'core',
      description: 'Career page URL ke liye (e.g., /careers/senior-performance-marketer)',
      options: { source: 'role', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      group: 'core',
      options: {
        list: [
          { title: 'Performance Ads & Media Buying', value: 'ads' },
          { title: 'SEO & Content', value: 'seo' },
          { title: 'Web Development / Tech', value: 'tech' },
          { title: 'Design & Creative', value: 'design' },
          { title: 'Sales & Client Success', value: 'sales' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'core',
      options: {
        list: [
          { title: 'Noida (On-site)', value: 'Noida (On-site)' },
          { title: 'Remote', value: 'Remote' },
          { title: 'Hybrid (Noida)', value: 'Hybrid (Noida)' },
        ],
        layout: 'radio'
      },
      initialValue: 'Noida (On-site)',
    }),
    defineField({
      name: 'type',
      title: 'Job Type',
      type: 'string',
      group: 'core',
      options: {
        list: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        layout: 'radio'
      },
      initialValue: 'Full-time',
    }),
    defineField({
      name: 'experience',
      title: 'Experience Required',
      type: 'string',
      group: 'core',
      description: 'Example: 2-4 Years, Fresher, 5+ Years',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Summary',
      type: 'text',
      group: 'core',
      rows: 3,
      description: 'Careers page par job cards mein dikhane ke liye.',
      validation: (Rule) => Rule.required().max(250),
    }),

    // ==========================================
    // GROUP: RESPONSIBILITIES & REQUIREMENTS
    // ==========================================
    defineField({
      name: 'responsibilities',
      title: 'Key Responsibilities',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Day-to-day work kya hoga? (Renders as bullet points)',
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements & Skills',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Software, skills, ya mindset jo candidate mein hona chahiye.',
    }),

    // ==========================================
    // GROUP: BENEFITS & PERKS
    // ==========================================
    defineField({
      name: 'perks',
      title: 'Benefits & Perks',
      type: 'array',
      group: 'perks',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Why should they join Get Into Feed? (e.g. Health Insurance, Gym Allowance, Weekend Offs)',
    }),

    // ==========================================
    // GROUP: SEO
    // ==========================================
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Max 60 characters. Blank chhodne par Job Role use hoga.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 2,
      description: 'Max 160 characters. Job search engines (Google Jobs) ke liye zaroori.',
    }),

    // ==========================================
    // GROUP: SETTINGS & APPLY
    // ==========================================
    defineField({
      name: 'applyLink',
      title: 'Application Link (Google Form / HR Email)',
      type: 'url',
      group: 'settings',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
    }),
    defineField({
      name: 'isActive',
      title: 'Is this Job Active?',
      type: 'boolean',
      group: 'settings',
      description: 'Agar hiring band ho gayi hai, toh ise OFF kar dein (Delete karne ki zaroorat nahi hai).',
      initialValue: true,
    }),
  ],

  // 🟢 2. Smart Sanity Dashboard Preview
  preview: {
    select: {
      title: 'role',
      department: 'department',
      type: 'type',
      isActive: 'isActive',
    },
    prepare({ title, department, type, isActive }) {
      return {
        title: title,
        subtitle: `${isActive ? '🟢 ACTIVE' : '🔴 CLOSED'} | ${department || 'General'} | ${type}`,
        icon: BriefcaseIcon,
      }
    },
  },
})