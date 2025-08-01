import IMockDataService, { IMockItem } from "../service-api/IMockDataService.ts";
import StateBase from "../../../common/StateBase.ts";

export default class MockDataService extends StateBase<IMockItem[]> implements IMockDataService {
    constructor() {
        super([]);
    }
}
