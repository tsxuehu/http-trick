/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from "axios";

export function setRuleCheckedState(ruleId: string, checked: boolean) {
  return axios.get('/filter/setRuleCheckedState', {
    params: {
      ruleId,
      checked: checked ? 1 : 0
    }
  });
}

export function saveRule(filter: any) {
  return axios.post('/filter/saveRule', filter);
}

export function removeRule(ruleId: string) {
  return axios.get('/filter/removeRule', {
    params: {
      ruleId
    }
  });
}
