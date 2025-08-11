import IFilterService from "../service-api/IFilterService.ts";
import StateBase from "../../../common/StateBase.ts";
import { IRule } from "../service-api/IRuleService.ts";

export default class FilterService extends StateBase<{ filters: IRule[] }> implements IFilterService {
  constructor() {
    super({ filters: [] });
  }

  setFilters(filters: IRule[]): void {
    this.setState({ filters });
  }

  getFilters(): IRule[] {
    return this.getState().filters;
  }

}
