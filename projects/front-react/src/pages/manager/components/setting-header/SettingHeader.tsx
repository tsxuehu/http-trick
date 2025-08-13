import React from 'react';
import { Select, Switch } from 'antd';
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn';
import IProfileService from '../../service-api/IProfileService.ts';
import EService from '../../config/EService.ts';
import IRuleService, { IRuleFileSimple } from '../../service-api/IRuleService.ts';
import IHostService, { IHostFileListItem } from '../../service-api/IHostService.ts';

interface IProps {}
interface IState {
  enableFilter: boolean;
  enableHost: boolean;
  resolveIp: boolean;
  enableRule: boolean;
  ruleFileList: IRuleFileSimple[];
  hostFileList: IHostFileListItem[];
}

const profileService = getServiceSync<IProfileService>(EService.IProfileService);
const ruleService = getServiceSync<IRuleService>(EService.IRuleService);
const hostService = getServiceSync<IHostService>(EService.IHostService);

export default class SettingHeader extends React.PureComponent<IProps, IState> {
  state: IState = {
    enableFilter: false,
    enableHost: false,
    resolveIp: false,
    enableRule: false,
    ruleFileList: [],
    hostFileList: [],
  };
  unProfile?: () => void;
  unRule?: () => void;
  unHost?: () => void;
  componentDidMount() {
    this.unProfile = profileService.subscribe((data) => {
      this.setState({
        enableFilter: data.enableFilter,
        enableHost: data.enableHost,
        resolveIp: data.resolveIp,
        enableRule: data.enableRule,
      });
    });
    this.unRule = ruleService.subscribe((data) => {
      this.setState({ ruleFileList: data.ruleFileList });
    });
    this.unHost = hostService.subscribe((data) => {
      this.setState({ hostFileList: data.hostFileList });
    });
  }

  componentWillUnmount() {
    this.unProfile?.();
    this.unRule?.();
    this.unHost?.();
  }
  async setResolveIp(value: boolean) {
    await profileService.setResolveIp(value);
  }
  async setEnableFilter(value: boolean) {
    await profileService.setEnableFilter(value);
  }
  async setEnableHost(value: boolean) {
    await profileService.setEnableHost(value);
  }
  async setEnableRule(value: boolean) {
    await profileService.setEnableRule(value);
  }
  async selectHostFile(id: string) {
    await hostService.useFile(id);
  }
  async selectRuleFile(ids: string[]) {
    const { ruleFileList } = this.state;
    const oldCheckedIds = ruleFileList.filter((item) => item.checked).map((item) => item.id);
    const oldIdSet = new Set(oldCheckedIds);
    const newIdSet = new Set(ids);

    for (let id of oldCheckedIds) {
      if (!newIdSet.has(id)) {
        await ruleService.setFileCheckStatus(id, false);
      }
    }
    for (let id of ids) {
      if (!oldIdSet.has(id)) {
        await ruleService.setFileCheckStatus(id, true);
      }
    }
  }
  render() {
    const { enableFilter, enableHost, resolveIp, enableRule, ruleFileList, hostFileList } = this.state;
    const hostOptions = [];
    let selectedHostId = '';
    for (const hostFile of hostFileList) {
      if (hostFile.checked) {
        selectedHostId = hostFile.id;
      }
      hostOptions.push({ value: hostFile.id, label: hostFile.name });
    }

    const ruleOptions = [];
    let selectedRuleIds = [];
    for (const ruleFile of ruleFileList) {
      if (ruleFile.checked) {
        selectedRuleIds.push(ruleFile.id);
      }
      ruleOptions.push({ value: ruleFile.id, label: ruleFile.name });
    }

    return (
      <div className="setting-header">
        <span>
          解析IP <Switch checked={resolveIp} onChange={(value, e) => this.setResolveIp(value)} />
        </span>
        <span>
          Host设置
          <Select
            value={selectedHostId}
            style={{ width: 120 }}
            size="small"
            placeholder="请选择修改返回body操作"
            onChange={(value) => this.selectHostFile(value)}
            options={hostOptions}
          />
          <Switch checked={enableHost} onChange={(value, e) => this.setEnableHost(value)} />
        </span>
        <span>
          Rule设置
          <Select
            mode="multiple"
            value={selectedRuleIds}
            style={{ width: 120 }}
            size="small"
            placeholder="请选择修改返回body操作"
            onChange={(value) => this.selectRuleFile(value)}
            options={ruleOptions}
          />
          <Switch checked={enableRule} onChange={(value, e) => this.setEnableRule(value)} />
        </span>
        <span>
          过滤器开关 <Switch checked={enableFilter} onChange={(value, e) => this.setEnableFilter(value)} />
        </span>
      </div>
    );
  }
}
