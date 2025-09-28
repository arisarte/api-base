import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const newsletterSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' }
  },
  required: ['email'],
  additionalProperties: false
};

const validateNewsletter = ajv.compile(newsletterSchema);

export { validateNewsletter };
