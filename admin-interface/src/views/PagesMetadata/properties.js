export const mainProperties = [
  { label: 'Uri', name: 'uri', type: 'string', initial: '' },
  { label: 'Title', name: 'title', type: 'string', initial: '' },
  { label: 'Is base page', name: 'isBasePage', type: 'boolean', initial: false },
  { label: 'Meta keywords', name: 'metaKeywords', type: 'string', initial: '' },
  { label: 'Meta description', name: 'metaDescription', type: 'string', initial: '' },
  { label: 'Priority', name: 'priority', type: 'number', initial: 0.5,
    inputProps: { step: '0.1', min:'0.0', max: '1.0' }
  },
];

export const additionalProperties = [
  { name: 'changefreq', type: 'select', initial: '' }
];

export const changefreqOptions = [
  { id: 'always', name: 'always' },
  { id: 'hourly', name: 'hourly' },
  { id: 'daily', name: 'daily' },
  { id: 'weekly', name: 'weekly' },
  { id: 'monthly', name: 'monthly' },
  { id: 'yearly', name: 'yearly' },
];