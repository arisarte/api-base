import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const registerSchema = {
  type: 'object',
  required: ['name', 'email', 'password'],
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 100 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 }
  },
  additionalProperties: false
};

export const updateSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 100 },
    password: { type: 'string', minLength: 6 }
  },
  additionalProperties: false
};

export const validateRegister = ajv.compile(registerSchema);
export const validateUserUpdate = ajv.compile(updateSchema);
