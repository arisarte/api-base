import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const articleSchema = {
  type: 'object',
  required: ['title', 'slug', 'content', 'category_id', 'author'],
  properties: {
    title: { type: 'string', minLength: 3, maxLength: 255 },
    slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
    content: { type: 'string', minLength: 10 },
    cover_image: { type: ['string', 'null'], format: 'uri', nullable: true },
    meta_title: { type: ['string', 'null'], maxLength: 255, nullable: true },
    meta_description: { type: ['string', 'null'], maxLength: 500, nullable: true },
    keywords: { type: ['string', 'null'], maxLength: 255, nullable: true },
    category_id: { type: 'integer', minimum: 1 },
    author: { type: 'string', minLength: 3, maxLength: 100 }
  },
  additionalProperties: false
};

export const validateArticle = ajv.compile(articleSchema);
