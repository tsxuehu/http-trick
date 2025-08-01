import React from "react";
import IAppInfoService, {IAppInfo} from "../../service-api/IAppInfoService.ts";
import IUserService, {IUserInfo} from "../../service-api/IUserService.ts";
import {getServiceSync} from "@spring4js/container-browser/lib/esm/global-fn";
import EService from "../../config/EService.ts";
// @ts-ignore
import qrcode from "qrcode-js";

import './help.less'

interface IProps {
}

interface IState {
    appInfo: IAppInfo;
    userInfo: IUserInfo;
}

const appInfoService = getServiceSync<IAppInfoService>(EService.IAppInfoService);
const userService = getServiceSync<IUserService>(EService.IUserService);

export default class Help extends React.PureComponent<IProps, IState> {
    state: IState = {
        appInfo: appInfoService.getState(),
        userInfo: userService.getState()
    };

    componentDidMount() {
        userService.subscribe((userInfo: IUserInfo) => {
            this.setState({userInfo});
        });
        appInfoService.subscribe((appInfo: IAppInfo) => {
            this.setState({appInfo});
        });
    }

    render() {
        const {appInfo, userInfo} = this.state;
        const certUrl = `http://${appInfo.pcIp}:${appInfo.webUiPort}/utils/rootCA.crt`;
        const imgUrl = qrcode.toDataURL(certUrl, 4);
        const remotePacUrl = `http://${appInfo.pcIp}:${appInfo.webUiPort}/profile/proxy.pac?proxy-ip=${appInfo.pcIp}&user-id=${userInfo.userId}`
        const localPacUrl = `http://127.0.0.1:${appInfo.webUiPort}/profile/proxy.pac?proxy-ip=127.0.0.1&user-id=${userInfo.userId}`
        return (
            <div className="install-body">
                <h1>Http Trick</h1>
                <h2 id="toc_0">一、说明</h2>

                <p>http trick是http协议代理工具，需要设置浏览器代理或者系统代理才能使用本工具。</p>
                <p>远程PAC: {remotePacUrl}</p>
                <p>本地PAC: {localPacUrl}</p>

                <h2 id="toc_1">二、chrome 代理插件安装(用于设置浏览器代理)</h2>

                <p>推荐安装 SwitchyOmega <a
                    href="https://chromewebstore.google.com/detail/proxy-switchyomega-3-zero/pfnededegaaopdmhkdmcofjmoldfiped"
                    target="_blank">点击安装代理插件</a></p>

                <h4 id="toc_2">插件使用说明</h4>

                <ol>
                    <li>安装完插件后请设置插件代理地址为<code>127.0.0.1</code>，代理协议: http，端口为<code>http
                        trick</code>代理端口(默认8001)。
                    </li>
                    <li>如不清楚如何配置 SwitchyOmega，请参考 <a href="/help/chrome/" target="_blank">chrome
                        代理设置指南</a></li>
                </ol>

                <h2 id="toc_3">三、证书安装</h2>

                <h4 id="toc_4">1. 为什么需要安装证书</h4>

                <p>由于<code>http trick</code>会代理 https 的请求，所以需要本地安装<code>http trick</code>的https 证书。
                </p>

                <h4 id="toc_5">2. 证书下载</h4>

                <ol>
                    <li>mac 系统请<a href={certUrl}>点击下载到本地安装</a>
                    </li>
                    <li>手机请扫码安装证书<img className="install-body__qrcode" src={imgUrl}/></li>
                    <li>证书信任请参考<a href="/help/cert/" target="_blank">如何信任证书</a></li>
                </ol>
            </div>
        );
    }
}
