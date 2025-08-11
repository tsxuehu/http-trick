import IFilterService from '../service-api/IFilterService.ts'
import StateBase from '../../../common/StateBase.ts'
import { IRule } from '../service-api/IRuleService.ts'
import * as filterApi from '../../../api/filter'
export default class FilterService extends StateBase<{ filters: IRule[] }> implements IFilterService {
  constructor() {
    super({ filters: [] })
  }

  setFilters(filters: IRule[]): void {
    this.setState({ filters })
  }

  getFilters(): IRule[] {
    return this.getState().filters
  }
  async removeFilter(id: string): Promise<void> {
    await filterApi.removeFilter(id)
  }
  async saveFilter(filter: IRule): Promise<void> {
    await filterApi.saveFilter(filter)
  }
  async setFilterCheckedState(ruleId: string, checked: boolean) {
    await filterApi.setFilterCheckedState(ruleId, checked)
  }
}
