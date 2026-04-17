export default {
  name: 'job',
  title: 'Careers',
  type: 'document',
  fields: [
    { name: 'role', title: 'Job Role', type: 'string' },
    { name: 'location', title: 'Location', type: 'string', initialValue: 'Noida / Remote' },
    { name: 'type', title: 'Job Type (Full-time / Intern)', type: 'string' },
    { name: 'description', title: 'Short Description', type: 'text' },
    { name: 'applyLink', title: 'Google Form / Apply Link', type: 'url' },
    { name: 'isActive', title: 'Is Job Active?', type: 'boolean', initialValue: true }
  ]
}