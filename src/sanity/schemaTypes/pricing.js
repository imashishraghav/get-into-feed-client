import { defineType, defineField, defineArrayMember } from 'sanity'
import { 
  CreditCardIcon, 
  StarIcon, 
  CheckmarkCircleIcon, 
  PresentationIcon,
  LinkIcon
} from '@sanity/icons'

export default defineType({
  name: 'pricing',
  title: 'Pricing Plans',
  type: 'document',
  icon: CreditCardIcon,
  
  // 🟢 1. Clean UI Tabs (Replaced Fieldsets with Groups for a premium Studio look)
  groups: [
    { name: 'display', title: 'Plan Details', default: true, icon: PresentationIcon },
    { name: 'billing', title: 'Pricing & Billing', icon: CreditCardIcon },
    { name: 'visuals', title: 'Badges & Visuals', icon: StarIcon },
    { name: 'features', title: 'Features & Deliverables', icon: CheckmarkCircleIcon },
    { name: 'action', title: 'CTA & Checkout', icon: LinkIcon },
  ],

  fields: [
    // ----------------------------------------------------------------------
    // 1. DISPLAY & CATEGORIZATION
    // ----------------------------------------------------------------------
    defineField({ 
      name: 'order', 
      title: 'Display Order', 
      type: 'number',
      group: 'display',
      description: 'Enter 1, 2, 3 to sort plans left-to-right on the website.',
      validation: (Rule) => Rule.required().integer().positive()
    }),
    defineField({ 
      name: 'planName', 
      title: 'Plan Name', 
      type: 'string', 
      group: 'display',
      description: 'e.g., Growth Phase, Omnichannel Scale, Custom Enterprise',
      validation: (Rule) => Rule.required().max(40)
    }),
    defineField({ 
      name: 'description', 
      title: 'Plan Description', 
      type: 'text',
      rows: 2,
      group: 'display',
      description: 'e.g., "For emerging brands scaling up to $20k/mo in ad spend."',
      validation: (Rule) => Rule.max(150)
    }),
    defineField({
      name: 'recommendedFor',
      title: 'Recommended For (Target Audience)',
      type: 'string',
      group: 'display',
      description: 'Optional: Extra tag line e.g., "Best for Real Estate Developers"',
    }),

    // ----------------------------------------------------------------------
    // 2. BILLING & PRICING OPTIONS
    // ----------------------------------------------------------------------
    defineField({
      name: 'currencySymbol',
      title: 'Currency Symbol',
      type: 'string',
      group: 'billing',
      options: {
        list: [
          { title: 'USD ($)', value: '$' },
          { title: 'INR (₹)', value: '₹' },
          { title: 'GBP (£)', value: '£' },
          { title: 'EUR (€)', value: '€' },
        ],
        layout: 'radio'
      },
      initialValue: '$',
    }),
    defineField({ 
      name: 'monthlyPrice', 
      title: 'Monthly Price', 
      type: 'string', 
      group: 'billing',
      description: 'e.g., "3,500", "99,000" or "Custom".',
      validation: (Rule) => Rule.required()
    }),
    defineField({ 
      name: 'yearlyPrice', 
      title: 'Yearly/Commitment Price', 
      type: 'string', 
      group: 'billing',
      description: 'e.g., "2,800". Leave blank if this plan doesn\'t have a yearly/quarterly option.',
    }),
    defineField({
      name: 'yearlyDiscountBadge',
      title: 'Discount Badge Text',
      type: 'string',
      group: 'billing',
      description: 'e.g., "Save 20%" - Shows up next to the pricing toggle.',
      hidden: ({ document }) => !document?.yearlyPrice
    }),
    defineField({
      name: 'disclaimerText',
      title: 'Pricing Disclaimer',
      type: 'string',
      group: 'billing',
      description: 'e.g., "+ $1,500 One-time setup fee" or "Minimum 3-month commitment."'
    }),

    // ----------------------------------------------------------------------
    // 3. VISUALS & BADGES
    // ----------------------------------------------------------------------
    defineField({ 
      name: 'isPopular', 
      title: 'Highlight as Premium/Popular?', 
      type: 'boolean', 
      group: 'visuals',
      initialValue: false,
      description: 'Turns the card dark/premium with glowing borders on the frontend.'
    }),
    defineField({ 
      name: 'badge', 
      title: 'Badge Text', 
      type: 'string', 
      group: 'visuals',
      description: 'e.g., AGENCY STANDARD, MOST POPULAR',
      hidden: ({ document }) => !document?.isPopular 
    }),

    // ----------------------------------------------------------------------
    // 4. FEATURES & DELIVERABLES
    // ----------------------------------------------------------------------
    defineField({ 
      name: 'features', 
      title: 'Features List', 
      type: 'array', 
      group: 'features',
      of: [
        defineArrayMember({ 
          type: 'object',
          fields: [
            defineField({
              name: 'featureName',
              title: 'Feature Name',
              type: 'string',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'isIncluded',
              title: 'Is Included?',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'isHighlighted',
              title: 'Highlight Feature?',
              type: 'boolean',
              initialValue: false,
              description: 'Make this feature bold (e.g., "Dedicated Media Buyer")'
            }),
            defineField({
              name: 'tooltip',
              title: 'Tooltip Info (Optional)',
              type: 'string',
              description: 'Explains the feature on hover.'
            })
          ],
          preview: {
            select: {
              title: 'featureName',
              isIncluded: 'isIncluded',
              isHighlighted: 'isHighlighted'
            },
            prepare({ title, isIncluded, isHighlighted }) {
              return {
                title: title,
                subtitle: `${isIncluded ? '✅ Included' : '❌ Excluded'}${isHighlighted ? ' | 🔥 Highlighted' : ''}`
              }
            }
          }
        })
      ]
    }),

    // ----------------------------------------------------------------------
    // 5. CALL TO ACTION & STRIPE INTEGRATION
    // ----------------------------------------------------------------------
    defineField({
      name: 'ctaText',
      title: 'Button Text',
      type: 'string',
      group: 'action',
      initialValue: 'Apply Now',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'stripeMonthlyLink',
      title: 'Monthly Payment Link (Stripe/Razorpay)',
      type: 'url',
      group: 'action',
      description: 'The direct Checkout link for the monthly retainer.',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] })
    }),
    defineField({
      name: 'stripeYearlyLink',
      title: 'Yearly/Commitment Payment Link',
      type: 'url',
      group: 'action',
      hidden: ({ document }) => !document?.yearlyPrice,
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] })
    }),
    defineField({
      name: 'fallbackLink',
      title: 'Fallback Link (Contact Form)',
      type: 'string',
      group: 'action',
      description: 'Used for Custom plans or if no payment links are provided (e.g., /contact).',
      initialValue: '/contact'
    })
  ],

  // ----------------------------------------------------------------------
  // SMART SANITY STUDIO PREVIEW
  // ----------------------------------------------------------------------
  preview: {
    select: {
      title: 'planName',
      price: 'monthlyPrice',
      currency: 'currencySymbol',
      isPopular: 'isPopular',
      order: 'order'
    },
    prepare({ title, price, currency, isPopular, order }) {
      return {
        title: `${order ? `#${order} - ` : ''}${title}`,
        subtitle: `${isPopular ? '⭐ Premium | ' : ''}Monthly: ${currency || '$'}${price}`,
        icon: CreditCardIcon
      }
    }
  }
})