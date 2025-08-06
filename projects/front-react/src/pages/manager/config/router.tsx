import React, { lazy, Suspense } from "react";
import { Navigate, Routes, Route } from "react-router";
import Help from '../views/help/Help'
import ProxyConfigure from '../views/configure/ProxyConfigure'
import InterceptionConfig from "../views/configure/InterceptionConfig.tsx";
import RedirectPathVariable from '../views/configure/RedirectPathVariable'
import HostList from '../views/host/HostList'
import EditHost from '../views/host/EditHost'
import CreateHost from '../views/host/CreateHost'
import RuleList from '../views/rule/RuleList'
import EditRule from '../views/rule/EditRule'
import CreateRule from '../views/rule/CreateRule'
import FilterList from '../views/filter/FilterList'
import DataList from '../views/data/DataList'
import DeviceList from '../views/device/DeviceList'

/*const Help = lazy(() => import("../views/help/Help"));

const ProxyConfigure = lazy(() => import("../views/configure/ProxyConfigure"));
const RedirectPathVariable = lazy(() => import("../views/configure/RedirectPathVariable"));

const HostList = lazy(() => import("../views/host/HostList"));
const EditHost = lazy(() => import("../views/host/EditHost"));
const CreateHost = lazy(() => import("../views/host/CreateHost"));

const RuleList = lazy(() => import("../views/rule/RuleList"));
const EditRule = lazy(() => import("../views/rule/EditRule"));
const CreateRule = lazy(() => import("../views/rule/CreateRule"));

const FilterList = lazy(() => import("../views/filter/FilterList"));

const DataList = lazy(() => import("../views/data/DataList"));

const DeviceList = lazy(() => import("../views/device/DeviceList"));*/

export function ViewRouter() {
  return (
    // <Suspense>
      <Routes>
        <Route path="/" element={<Navigate to="/helpinstall" />} />
        <Route path="/helpinstall" element={<Help />} />

        <Route path="/proxy-app-configure" element={<ProxyConfigure />} />
        <Route path="/interception-config" element={<InterceptionConfig />} />
        <Route path="/redirect-path-variable" element={<RedirectPathVariable />} />

        <Route path="/hostfilelist" element={<HostList />} />
        <Route path="/edithost" element={<EditHost />} />
        <Route path="/createhostfile" element={<CreateHost />} />

        <Route path="/rulefilelist" element={<RuleList />} />
        <Route path="/editrule" element={<EditRule />} />
        <Route path="/createrulefile" element={<CreateRule />} />

        <Route path="/filter" element={<FilterList />} />

        <Route path="/datalist" element={<DataList />} />

        <Route path="/device" element={<DeviceList />} />
      </Routes>
    // </Suspense>
  );
}
