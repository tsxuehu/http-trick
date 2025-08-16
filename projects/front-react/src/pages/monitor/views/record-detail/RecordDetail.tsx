import React from 'react';
import { Tabs, TabsProps } from 'antd';
import Timeline from './Timeline.tsx';
import Origin from './Origin.tsx';
import Request from './Request.tsx';
import Response from './Response.tsx';
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

export default class RecordDetail extends React.PureComponent<IProps, IState> {
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

  getItems(): TabsProps['items'] {
    return [
      {
        key: '1',
        label: '原始请求',
        children: <Origin />,
      },
      {
        key: '2',
        label: 'Request',
        children: <Request />,
      },
      {
        key: '3',
        label: 'Response',
        children: <Response />,
      },
      {
        key: '4',
        label: 'Timeline',
        children: <Timeline />,
      },
    ];
  }
  render() {
    const items = this.getItems();
    return <Tabs className="record-detail" items={items} />;
  }
}
