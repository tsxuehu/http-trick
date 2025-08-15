import React, { MouseEvent } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import ITrafficService from '../service-api/ITrafficService.ts';
import EService from '../config/EService.ts';
import cn from 'classnames';
import './record-list.less';
import { showContextMenu } from '../../../components/context-menu/helper.ts';

interface IProps {}

interface IState {
  filteredRecordArray: number[];
  rightClickedRecordId: number;
  selectRecordId: number;
}

const trafficService = getServiceSync<ITrafficService>(EService.ITrafficService);

export default class RecordList extends React.PureComponent<IProps, IState> {
  state: IState = {
    filteredRecordArray: [],
    rightClickedRecordId: -1,
    selectRecordId: -1,
  };

  unTraffic?: () => void;

  componentDidMount() {
    this.unTraffic = trafficService.subscribe((state) => {
      this.setState({
        filteredRecordArray: state.filteredRecordArray,
        rightClickedRecordId: state.rightClickedRecordId,
        selectRecordId: state.selectRecordId,
      });
    });
  }

  componentWillUnmount() {
    this.unTraffic?.();
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    showContextMenu({
      top: 100,
      left: 100,
      render: (close) => {
        return <>上下文菜单测试</>;
      },
    });
  }

  onClickRow() {}

  renderRow(index: number, rowId: number, style: any) {
    const { selectRecordId, rightClickedRecordId } = this.state;
    const recordMap = trafficService.getRecordMap();
    const { response, requestData, originRequest } = recordMap[rowId];
    let duration;
    if (response) {
      duration = response?.remoteResponseEndTime - response?.remoteRequestBeginTime;
    }
    return (
      <div
        style={style}
        onClick={() => this.onClickRow()}
        className={cn('record row', {
          selected: selectRecordId === rowId,
          'right-clicked': rightClickedRecordId === rowId,
        })}
        onContextMenu={(e) => this.onContextMenu(e)}
      >
        <div className="cell cell-index">{index + 1}</div>
        <div className="cell cell-status">{response?.statusCode}</div>
        <div className="cell cell-method">{originRequest?.method}</div>
        <div className="cell cell-protocol">{originRequest?.protocol}</div>
        <div className="cell cell-host">{originRequest?.hostname}</div>
        <div className="cell cell-path">{originRequest?.pathname}</div>
        <div className="cell cell-type">{originRequest?.headers['content-type']}</div>
        <div className="cell cell-device">{originRequest?.deviceId}</div>
        <div className="cell cell-time">{duration}</div>
      </div>
    );
  }

  render() {
    const { filteredRecordArray } = this.state;
    return (
      <div className="traffic-list" onContextMenu={(e) => this.onContextMenu(e)}>
        <div className="header row">
          <div className="cell cell-index">#</div>
          <div className="cell cell-status">Status</div>
          <div className="cell cell-method">Method</div>
          <div className="cell cell-protocol">Protocol</div>
          <div className="cell cell-host">Host</div>
          <div className="cell cell-path">Path</div>
          <div className="cell cell-type">Type</div>
          <div className="cell cell-device">Device</div>
          <div className="cell cell-time">Time</div>
        </div>
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            return (
              <FixedSizeList
                height={height}
                width={300}
                itemCount={filteredRecordArray.length}
                itemSize={35}
                itemData={{
                  dataSource: filteredRecordArray,
                }}
                itemKey={(index: number, data: any) => {
                  return data.dataSource[index];
                }}
              >
                {({ index, style, data }: { index: number; style: any; data: any }) =>
                  this.renderRow(index, data.dataSource[index], style)
                }
              </FixedSizeList>
            );
          }}
        </AutoSizer>
      </div>
    );
  }
}
