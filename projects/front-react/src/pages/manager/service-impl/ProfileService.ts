import IProfileService, { IUserProfile } from '../service-api/IProfileService';
import StateBase from '../../../common/StateBase';
import * as profileApi from '../../../api/profile';
import * as configApi from '../../../api/conf.ts';

export default class ProfileService extends StateBase<IUserProfile> implements IProfileService {
  constructor() {
    super({
      redirectPathVariables: {},
      enableRule: true,
      enableHost: true,
      enableFilter: true,
      goThroughProxyConfig: '',
      resolveHost: false,
      externalProxy: false,
      externalHttpProxy: false,
      externalSocks5Proxy: true,
      httpProxyIp: '',
      httpProxyPort: 8888,
      socks5ProxyIp: '',
      socks5ProxyPort: 8889,
    });
  }

  setProfile(profile: IUserProfile): void {
    this.setState(profile);
  }
  getProfile(): IUserProfile {
    return this.getState();
  }

  async setResolveHost(value: boolean): Promise<void> {
    if (value) {
      await profileApi.enableResolveHost();
    } else {
      await profileApi.disableResolveHost();
    }
  }
  async setEnableFilter(value: boolean): Promise<void> {
    if (value) {
      await profileApi.enableFilter();
    } else {
      await profileApi.disableFilter();
    }
  }
  async setEnableHost(value: boolean): Promise<void> {
    if (value) {
      await profileApi.enableHost();
    } else {
      await profileApi.disableHost();
    }
  }
  async setEnableRule(value: boolean): Promise<void> {
    if (value) {
      await profileApi.enableRule();
    } else {
      await profileApi.disableRule();
    }
  }

  async saveRedirectPathVariables(variables: Record<string, string>) {
    const data = this.getState();
    let copyProfile = JSON.parse(JSON.stringify(data));
    copyProfile.redirectPathVariables = variables;
    await profileApi.saveFile(copyProfile);
  }

  async saveProfile(part: Partial<IUserProfile>): Promise<void> {
    const oldConfig = this.getState();
    const newProfile = Object.assign({}, oldConfig, part);
    await profileApi.saveFile(newProfile);
  }
}
