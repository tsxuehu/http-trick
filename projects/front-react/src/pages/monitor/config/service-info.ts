import EService from "./EService";
import WorkbenchService from "../service-impl/WorkbenchService";

const services = {
    [EService.IWorkbenchService]: new WorkbenchService(),

}
export default services
