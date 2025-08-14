import EService from './EService';
import WorkbenchService from '../service-impl/WorkbenchService';
import TrafficService from '../service-impl/TrafficService.ts';

const services = {
  [EService.IWorkbenchService]: new WorkbenchService(),
  [EService.ITrafficService]: new TrafficService(),
};
export default services;
