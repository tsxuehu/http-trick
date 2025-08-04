import React from "react";
import {getServiceSync} from "@spring4js/container-browser/lib/esm/global-fn";
import IProfileService, {IUserProfile} from "../../service-api/IProfileService";
import EService from "../../config/EService.ts";
import {Table, Button, Input, Popconfirm, message} from "antd";

const profileService = getServiceSync<IProfileService>(EService.IProfileService);


interface IProps {
}

interface IState {
}


export default class ProxyConfigure extends React.PureComponent<IProps, IState> {
    state: IState = {};


    render() {
        return (<div></div>
        );
    }
}
