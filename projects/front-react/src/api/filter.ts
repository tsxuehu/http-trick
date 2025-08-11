/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios'
import { assertAxiosRes } from './utils.ts'

export async function setFilterCheckedState(ruleId: string, checked: boolean) {
  const response = await axios.get('/filter/setRuleCheckedState', {
    params: {
      ruleId,
      checked: checked ? 1 : 0,
    },
  })
  assertAxiosRes(response)
}

export async function saveFilter(filter: any) {
  const response = await axios.post('/filter/saveRule', filter)
  assertAxiosRes(response)
}

export async function removeFilter(ruleId: string) {
  const response = await axios.get('/filter/removeRule', {
    params: {
      ruleId,
    },
  })
  assertAxiosRes(response)
}
