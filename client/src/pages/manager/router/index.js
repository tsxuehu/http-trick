import Vue from 'vue'
import Router from 'vue-router'
import Configure from '../views/configure/Configure'
import RedirectPathVariable from '../views/configure/RedirectPathVariable'

import HostFileList from '../views/host/FileList'
import EditHost from '../views/host/EditHost'
import CreateHostFile from '../views/host/CreateFile'

import RuleFileList from '../views/rule/FileList'
import EditRule from '../views/rule/EditRule'
import CreateRuleFile from '../views/rule/CreateFile'

import Filter from '../views/filter/Filter'

import DataList from '../views/data/DataList'

import DeviceList from '../views/device/DeviceList'

import HelpInstall from '../views/help/Install'

import ProxyConfigure from '../views/proxy/Configure'


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
