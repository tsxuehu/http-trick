import Vue from 'vue'
import Router from 'vue-router'
import Configure from 'src/manager/views/configure/Configure'
import RedirectPathVariable from 'src/manager/views/configure/RedirectPathVariable'

import HostFileList from 'src/manager/views/host/FileList'
import EditHost from 'src/manager/views/host/EditHost'
import CreateHostFile from 'src/manager/views/host/CreateFile'

import RuleFileList from 'src/manager/views/rule/FileList'
import EditRule from 'src/manager/views/rule/EditRule'
import CreateRuleFile from 'src/manager/views/rule/CreateFile'

import Filter from 'src/manager/views/filter/Filter'

import DataList from 'src/manager/views/data/DataList'

import DeviceList from 'src/manager/views/device/DeviceList'

import HelpInstall from 'src/manager/views/help/Install'

import ProxyConfigure from 'src/manager/views/proxy/Configure'


Vue.use(Router);

export default new Router({
  routes: [
    {path: '/configure',component: Configure},
    {path: '/redirect-path-variable',component: RedirectPathVariable},

    {path: '/hostfilelist',component: HostFileList},
    {path: '/edithost',component: EditHost},
    {path: '/createhostfile',component: CreateHostFile},

    {path: '/rulefilelist',component: RuleFileList},
    {path: '/editrule',component: EditRule},
    {path: '/createrulefile',component: CreateRuleFile},

    {path: '/filter',component: Filter},

    {path: '/datalist',component: DataList},

    {path: '/device',component: DeviceList},

    {path: '/helpinstall',component: HelpInstall, alias: '/'},

    {path: '/proxyconfig',component: ProxyConfigure}
  ]
})
