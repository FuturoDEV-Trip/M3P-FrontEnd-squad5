import axios from 'axios';
import { getApiUrl } from './api';

export async function validateUser(userData) {
  const errors = {};

  try {
    const emailExistsResponse = await axios.get(`${getApiUrl('usuarios')}?email_usuario=${userData.email_usuario}`);    if (emailExistsResponse.data.length > 0) {
      errors.email_usuario = 'E-mail já registrado';
    }

    const cpfExistsResponse = await axios.get(`${getApiUrl('usuarios')}?cpf_usuario=${userData.cpf_usuario}`);    if (cpfExistsResponse.data.length > 0) {
      errors.cpf = 'CPF já registrado';
    }

  } catch (error) {
    console.error(error);
    errors.generalError = 'Ops! Algo deu errado.';
  }

  return errors;
}
