export default {
  name: 'pricing',
  title: 'Pricing Plans',
  type: 'document',
  fieldsets: [
    { name: 'display', title: '1. Display & Categorization', options: { collapsible: true, collapsed: false } },
    { name: 'billing', title: '2. Billing & Pricing Options', options: { collapsible: true, collapsed: false } },
    { name: 'features', title: '3. Features & Deliverables', options: { collapsible: true, collapsed: false } },
    { name: 'visuals', title: '4. Badges & Visuals', options: { collapsible: true, collapsed: true } },
    { name: 'action', title: '5. Call to Action & Stripe Integration', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // ----------------------------------------------------------------------
    // 1. DISPLAY & CATEGORIZATION
    // ----------------------------------------------------------------------
    { 
      name: 'order', 
      title: 'Display Order', 
      type: 'number',
      fieldset: 'display',
      description: 'Enter 1, 2, 3 to sort plans left-to-right.',
      validation: (Rule) => Rule.required().integer().positive()
    },
    { 
      name: 'planName', 
      title: 'Plan Name', 
      type: 'string', 
      fieldset: 'display',
      description: 'e.g., Growth Phase, Omnichannel Scale',
      validation: (Rule) => Rule.required().max(40)
    },
    { 
      name: 'description', 
      title: 'Plan Description', 
      type: 'text',
      rows: 2,
      fieldset: 'display',
      description: 'e.g., "For emerging brands scaling up to $20k/mo in ad spend."',
      validation: (Rule) => Rule.max(150)
    },

    // ----------------------------------------------------------------------
    // 2. BILLING & PRICING OPTIONS
    // ----------------------------------------------------------------------
    { 
      name: 'monthlyPrice', 
      title: 'Monthly Price', 
      type: 'string', 
      fieldset: 'billing',
      description: 'e.g., "3,500" or "Custom". (Do not include currency symbols, add them in frontend)',
      validation: (Rule) => Rule.required()
    },
    { 
      name: 'yearlyPrice', 
      title: 'Yearly/Commitment Price', 
      type: 'string', 
      fieldset: 'billing',
      description: 'e.g., "2,800". Leave blank if this plan doesn\'t have a yearly option.',
    },
    {
      name: 'yearlyDiscountBadge',
      title: 'Yearly Discount Badge',
      type: 'string',
      fieldset: 'billing',
      description: 'e.g., "Save 20%" - Shows up next to the yearly toggle.',
      hidden: ({ document }) => !document?.yearlyPrice
    },
    {
      name: 'disclaimerText',
      title: 'Pricing Disclaimer (Optional)',
      type: 'string',
      fieldset: 'billing',
      description: 'e.g., "+ $1,500 One-time setup fee" or "Minimum 3-month commitment."'
    },

    // ----------------------------------------------------------------------
    // 3. VISUALS & BADGES
    // ----------------------------------------------------------------------
    { 
      name: 'isPopular', 
      title: 'Highlight as Premium/Popular?', 
      type: 'boolean', 
      fieldset: 'visuals',
      initialValue: false,
      description: 'Turns the card dark/premium with glowing borders.'
    },
    { 
      name: 'badge', 
      title: 'Badge Text', 
      type: 'string', 
      fieldset: 'visuals',
      description: 'e.g., AGENCY STANDARD (Only shows if Highlight is ON)',
      hidden: ({ document }) => !document?.isPopular 
    },

    // ----------------------------------------------------------------------
    // 4. FEATURES & DELIVERABLES
    // ----------------------------------------------------------------------
    { 
      name: 'features', 
      title: 'Features List', 
      type: 'array', 
      fieldset: 'features',
      of: [
        { 
          type: 'object',
          fields: [
            {
              name: 'featureName',
              title: 'Feature Name',
              type: 'string',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'isIncluded',
              title: 'Is Included?',
              type: 'boolean',
              initialValue: true,
            },
            {
              name: 'isHighlighted',
              title: 'Highlight this Feature?',
              type: 'boolean',
              initialValue: false,
              description: 'Turn ON to make this feature bold or stand out (e.g., "Dedicated Media Buyer")'
            },
            {
              name: 'tooltip',
              title: 'Tooltip Info (Optional)',
              type: 'string',
              description: 'Explains the feature on hover.'
            }
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
                subtitle: `${isIncluded ? '✅' : '❌'} ${isHighlighted ? ' | 🔥 Highlighted' : ''}`
              }
            }
          }
        }
      ]
    },

    // ----------------------------------------------------------------------
    // 5. CALL TO ACTION & STRIPE INTEGRATION
    // ----------------------------------------------------------------------
    {
      name: 'ctaText',
      title: 'Button Text',
      type: 'string',
      fieldset: 'action',
      initialValue: 'Apply Now',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'stripeMonthlyLink',
      title: 'Monthly Stripe Payment Link',
      type: 'url',
      fieldset: 'action',
      description: 'The direct Stripe Checkout link for the monthly retainer.'
    },
    {
      name: 'stripeYearlyLink',
      title: 'Yearly/Commitment Stripe Payment Link',
      type: 'url',
      fieldset: 'action',
      description: 'The direct Stripe Checkout link for the discounted retainer.',
      hidden: ({ document }) => !document?.yearlyPrice
    },
    {
      name: 'fallbackLink',
      title: 'Fallback Link (Contact/Typeform)',
      type: 'string',
      fieldset: 'action',
      description: 'e.g., /contact or a Typeform link. Used if no Stripe links are provided or for Custom plans.',
      initialValue: '/contact'
    }
  ],

  // ----------------------------------------------------------------------
  // SANITY STUDIO PREVIEW
  // ----------------------------------------------------------------------
  preview: {
    select: {
      title: 'planName',
      price: 'monthlyPrice',
      isPopular: 'isPopular'
    },
    prepare({ title, price, isPopular }) {
      return {
        title: `${isPopular ? '⭐ ' : ''}${title}`,
        subtitle: `Monthly: $${price}`
      }
    }
  }
}