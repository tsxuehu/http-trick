import React from 'react';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import ITrafficService from '../../service-api/ITrafficService.ts';
import EService from '../../config/EService.ts';
interface IProps {}

interface IState {
  selectRecordId: number;
  currentRequestBody: string;
  currentResponseBody: string;
}

const trafficService = getServiceSync<ITrafficService>(EService.ITrafficService);

export default class Timeline extends React.PureComponent<IProps, IState> {
  state: IState = {
    selectRecordId: -1,
    currentRequestBody: '',
    currentResponseBody: '',
  };

  unTraffic?: () => void;
  componentDidMount() {
    this.unTraffic = trafficService.subscribe((state) => {
      this.setState({
        selectRecordId: state.selectRecordId,
        currentRequestBody: state.currentRequestBody,
        currentResponseBody: state.currentResponseBody,
      });
    });
  }

  componentWillUnmount() {
    this.unTraffic?.();
  }

  render() {
    return <div>Timeline</div>;
  }
}
