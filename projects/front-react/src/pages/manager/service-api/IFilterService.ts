import IStateBase from '../../../common/IStateBase.ts'
import { IRule } from './IRuleService.ts'

export default interface IFilterService extends IStateBase<{ filters: IRule[] }> {
  setFilters(filters: IRule[]): void
  getFilters(): IRule[]
  removeFilter(id: string): Promise<void>
  saveFilter(filter: IRule): Promise<void>
  setFilterCheckedState(ruleId: string, checked: boolean): Promise<void>
}
