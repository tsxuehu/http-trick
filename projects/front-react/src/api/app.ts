import axios from 'axios';
import { assertAxiosRes } from './utils.ts';

export async function getAppInfo() {
  const response = await axios.get('/app/get-info');
  assertAxiosRes(response);
  return response.data.data;
}
