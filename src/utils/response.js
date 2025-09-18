export function success(data, message = 'OK') {
  return { success: true, message, data };
}

export function error(message = 'Erro interno', code = 500) {
  return { success: false, message, code };
}
