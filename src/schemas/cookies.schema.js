import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });

export const cookieConsentSchema = {
  type: 'object',
  properties: {
    consent: { type: 'object', properties: { analytics: { type: 'boolean' } }, additionalProperties: false }
  },
  required: ['consent'],
  additionalProperties: false
};

export const validateCookieConsent = ajv.compile(cookieConsentSchema);
