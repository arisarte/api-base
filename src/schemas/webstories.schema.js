import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const webstorySchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    slides: { type: 'array', items: { type: 'object' } }
  },
  required: ['title', 'slides'],
  additionalProperties: false
};

export const validateWebstory = ajv.compile(webstorySchema);
