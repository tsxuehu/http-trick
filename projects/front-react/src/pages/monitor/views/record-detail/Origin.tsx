import React from 'react';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import ITrafficService from '../../service-api/ITrafficService.ts';
import EService from '../../config/EService.ts';
import { KeyValueList } from './KeyValueList.tsx';
interface IProps {}

interface IState {
  selectRecordId: number;
  currentRequestBody: string;
  currentResponseBody: string;
}

const trafficService = getServiceSync<ITrafficService>(EService.ITrafficService);

export default class Origin extends React.PureComponent<IProps, IState> {
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
    const { selectRecordId, currentRequestBody } = this.state;
    const currentSelectRecord = trafficService.getRecordMap()[selectRecordId];
    if (!currentSelectRecord) {
      return <></>;
    }
    const originRequest = currentSelectRecord.originRequest;
    return (
      <div>
        <div>
          <span>Header</span>
          <KeyValueList keyValueObj={originRequest?.headers ?? {}} />
        </div>
        <div>
          <span>Cookie</span>
          <KeyValueList keyValueObj={originRequest?.cookie ?? {}} />
        </div>
        <div>
          <span>Query Params</span>
          <KeyValueList keyValueObj={originRequest?.query ?? {}} />
        </div>
      </div>
    );
  }
}
