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

export default class Response extends React.PureComponent<IProps, IState> {
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
    const { selectRecordId, currentResponseBody } = this.state;
    const currentSelectRecord = trafficService.getRecordMap()[selectRecordId];
    if (!currentSelectRecord) {
      return <></>;
    }
    const response = currentSelectRecord.response;
    return (
      <div>
        <div>
          <span>Header</span>
          <KeyValueList keyValueObj={response?.headers ?? {}} />
        </div>
        <div>
          <span>Body</span>
          <div>{String(currentResponseBody)}</div>
        </div>
      </div>
    );
  }
}
