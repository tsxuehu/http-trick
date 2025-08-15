import React from 'react';
import './top-bar.less';
import { Button, Input } from 'antd';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import ITrafficService, { IFilter, IMonitorState } from '../service-api/ITrafficService.ts';
import EService from '../config/EService.ts';
import { CaretRightOutlined, DeleteOutlined, PauseOutlined } from '@ant-design/icons';

interface IProps {}

interface IState {
  monitorState: IMonitorState;
  filter: IFilter;
}

const trafficService = getServiceSync<ITrafficService>(EService.ITrafficService);

export default class TopBar extends React.PureComponent<IProps, IState> {
  state: IState = {
    monitorState: trafficService.getMonitorState(),
    filter: trafficService.getLocalFilter(),
  };

  unTraffic?: () => void;

  componentDidMount() {
    this.unTraffic = trafficService.subscribe((state) => {
      this.setState({ monitorState: state.monitorState, filter: state.filter });
    });
  }
  componentWillUnmount() {
    this.unTraffic?.();
  }

  clearMonitorData() {}

  setRecordState(record: boolean) {}

  setHost(host: string) {}

  setPath(path: string) {}

  render() {
    const { monitorState, filter } = this.state;
    return (
      <div className="top-bar">
        <span className={`icon-btn ${monitorState.overflow ? 'overflow' : ''}`}>
          <CaretRightOutlined onClick={() => this.setRecordState(false)} />
          <PauseOutlined onClick={() => this.setRecordState(true)} />
        </span>
        <span className="icon-btn">
          <DeleteOutlined onClick={() => this.clearMonitorData()} />
        </span>
        <span className="tips " style={{ visibility: monitorState.overflow ? 'initial' : 'hidden' }}>
          记录已满，请清除历史记录
        </span>
        <span className="filters">
          Filter:
          <Input placeholder="Host" value={filter.host} onChange={(e) => this.setHost(e.target.value)} />
          /
          <Input placeholder="Path" value={filter.path} onChange={(e) => this.setPath(e.target.value)} />
        </span>
        <div className="placeholder"></div>
        <a className="goto-manager" href="/index.html" target="_blank">
          <Button>管理</Button>
        </a>
      </div>
    );
  }
}
