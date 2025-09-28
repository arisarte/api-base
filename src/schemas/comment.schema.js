import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const commentSchema = {
  type: 'object',
  required: ['article_id', 'content'],
  properties: {
    article_id: { type: 'integer', minimum: 1 },
    content: { type: 'string', minLength: 1, maxLength: 2000 }
  },
  additionalProperties: false
};

export const validateComment = ajv.compile(commentSchema);
