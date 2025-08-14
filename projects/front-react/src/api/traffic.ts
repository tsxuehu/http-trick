import axios from 'axios';
import queryString from 'query-string';
import { assertAxiosRes } from './utils.ts';

export async function getResponseBody(id: string) {
  try {
    let result = await axios.get(`/traffic/getResponseBody?id=${id}`);
    return result.data;
  } catch (e) {
    return '';
  }
}

export async function getRequestBody(id: string) {
  try {
    let result = await axios.get(`/traffic/getRequestBody?id=${id}`);
    return result.data;
  } catch (e) {
    return '';
  }
}

export async function setStopRecord(stop: boolean) {
  let response = await axios.get(`/traffic/stopRecord?stop=${stop}`);
  assertAxiosRes(response);
}

export async function clear() {
  let response = await axios.get('/traffic/clear');
  assertAxiosRes(response);
}

export async function setFilter(filter: any) {
  let response = await axios.get(`/traffic/setfilter?path=${filter.path}&host=${filter.host}`);
  assertAxiosRes(response);
}

let pairSplitRegExp = /; */;
let decode = decodeURIComponent;

function tryDecode(str: string, decode: any) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

export function parseCookie(str: string, options: any) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    // @ts-ignore
    if (undefined == obj[key]) {
      // @ts-ignore
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

export function parseQuery(path: string) {
  if (!path || path.indexOf('?') < 0) return {};

  return queryString.parse(path.split('?')[1]);
}
