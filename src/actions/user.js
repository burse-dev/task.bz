import { LOAD_AUTH_USER_DATA } from './types';

export default data => async dispatch => fetch('/api/user/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${data}`,
  },
})
  .then(response => response.json())
  .catch(() => ({
    notFound: true,
  }))
  .then(payload => dispatch({
    type: LOAD_AUTH_USER_DATA,
    payload,
  }));
