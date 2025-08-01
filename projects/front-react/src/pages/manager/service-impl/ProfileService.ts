import IProfileService, { IUserProfile } from "../service-api/IProfileService";
import StateBase from "../../../common/StateBase";
import * as profileApi from "../../../api/profile";

export default class ProfileService extends StateBase<IUserProfile> implements IProfileService {
  constructor() {
    super({
      redirectPathVariables: {},
      enableRule: true,
      enableHost: true,
      enableFilter: true,
      goThroughProxyConfig: "",
      resolveHost: false,
      externalProxy: false,
      externalHttpProxy: false,
      externalSocks5Proxy: true,
      httpProxyIp: "",
      httpProxyPort: 8888,
      socks5ProxyIp: "",
      socks5ProxyPort: 8889
    });
  }

  async switchResolveHost() {
    const profile = this.getState();
    if (profile.resolveHost) {
      await profileApi.disableResolveHost();
    } else {
      await profileApi.enableResolveHost();
    }
  }

  async switchHost() {
    const profile = this.getState();
    if (profile.enableHost) {
      await profileApi.disableHost();
    } else {
      await profileApi.enableHost();
    }
  }

  async switchFilter() {
    const profile = this.getState();
    if (profile.enableFilter) {
      profileApi.disableFilter();
    } else {
      profileApi.enableFilter();
    }
  }

  async switchRule() {
    const profile = this.getState();
    if (profile.enableRule) {
      profileApi.disableRule();
    } else {
      profileApi.enableRule();
    }
  }
}
