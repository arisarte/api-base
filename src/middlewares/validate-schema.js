export function validateSchema(schemaValidator) {
  return async (req, reply) => {
    const valid = schemaValidator(req.body);
    if (!valid) {
      reply.code(400).send({
        success: false,
        message: 'Payload inválido',
        errors: schemaValidator.errors
      });
      return false; // interrompe o fluxo
    }
    return true;
  };
}
