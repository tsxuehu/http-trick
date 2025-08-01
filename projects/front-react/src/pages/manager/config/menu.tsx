import { Menu, MenuProps } from "antd";
import React from "react";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  PieChartOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import { HashRouter as Router, Routes, Route, Link, useLocation } from "react-router";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/helpinstall",
    icon: <HomeOutlined />,
    label: <Link to="/helpinstall">使用说明</Link>
  },
  {
    key: "/proxy-configure",
    icon: <UserOutlined />,
    label: <Link to="/proxy-configure">代理配置</Link>
  },
  {
    key: "/redirect-path-variable",
    icon: <ShoppingCartOutlined />,
    label: <Link to="/redirect-path-variable">转发路径变量</Link>
  },
  {
    key: "/hostfilelist",
    icon: <FileTextOutlined />,
    label: <Link to="/hostfilelist">Host 管理</Link>
  },
  {
    key: "/filter",
    icon: <SettingOutlined />,
    label: <Link to="/filter">Http 过滤器</Link>
  },
  {
    key: "/rulefilelist",
    icon: <SettingOutlined />,
    label: <Link to="/rulefilelist">Http 转发</Link>
  },
  {
    key: "/datalist",
    icon: <SettingOutlined />,
    label: <Link to="/datalist">自定义 mock 数据</Link>
  },
  {
    key: "/device",
    icon: <SettingOutlined />,
    label: <Link to="/device">设备管理</Link>
  }
];

export function HttpTrickMenu() {
  const location = useLocation()
  return <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline" items={items} />;
}
