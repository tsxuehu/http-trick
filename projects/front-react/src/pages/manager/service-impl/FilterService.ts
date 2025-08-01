import IFilterService from "../service-api/IFilterService.ts";
import StateBase from "../../../common/StateBase.ts";
import { IRule } from "../service-api/IRuleService.ts";

export default class FilterService extends StateBase<IRule[]> implements IFilterService {
  constructor() {
    super([]);
  }
}
