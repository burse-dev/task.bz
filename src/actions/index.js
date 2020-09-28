import {
  AUTH_SIGN_UP,
  AUTH_SIGN_OUT,
} from './types';

export const logOut = () => async (dispatch) => {
  localStorage.removeItem('JWT_TOKEN');

  dispatch({
    type: AUTH_SIGN_OUT,
    payload: '',
  });

  return true;
};

export const emailAuth = data => async (dispatch) => {
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('password', data.password);

  const res = await fetch('/api/email/login', {
    method: 'POST',
    body: formData,
  });

  if (res.status === 401) {
    throw new Error('Неверная почта или пароль');
  }

  const response = await res.json();

  dispatch({
    type: AUTH_SIGN_UP,
    payload: response.token,
  });

  localStorage.setItem('JWT_TOKEN', response.token);

  return true;
};
