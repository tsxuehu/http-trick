
import axios from 'axios';

export function getAppInfo() {
  return axios.get('/app/get-info');
}
