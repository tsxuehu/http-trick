import { Menu, MenuProps } from 'antd'
import React, { useEffect, useState } from 'react'
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  PieChartOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router'
import { getServiceSync } from '@spring4js/container-browser/lib/esm/global-fn'
import IConfigureService from '../service-api/IConfigureService.ts'
import EService from './EService.ts'
import IUserService from '../service-api/IUserService.ts'

const configureService = getServiceSync<IConfigureService>(EService.IConfigureService)
const userService = getServiceSync<IUserService>(EService.IUserService)

type MenuItem = Required<MenuProps>['items'][number]

function getMenuItems(): MenuItem[] {
  const professionalVersion = configureService.getConfig().professionalVersion
  const items: MenuItem[] = [
    {
      key: '/helpinstall',
      icon: <HomeOutlined />,
      label: <Link to="/helpinstall">使用说明</Link>,
    },
  ]
  if (userService.isRoot()) {
    items.push({
      key: '/proxy-configure',
      icon: <UserOutlined />,
      label: <Link to="/proxy-app-configure">代理程序设置</Link>,
    })
  }

  if (professionalVersion) {
    items.push(
      ...[
        {
          key: '/interception-config',
          icon: <ShoppingCartOutlined />,
          label: <Link to="/interception-config">请求拦截设置</Link>,
        },
        {
          key: '/redirect-path-variable',
          icon: <ShoppingCartOutlined />,
          label: <Link to="/redirect-path-variable">转发路径变量</Link>,
        },
        {
          key: '/hostfilelist',
          icon: <FileTextOutlined />,
          label: <Link to="/hostfilelist">Host 管理</Link>,
        },
        {
          key: '/filter',
          icon: <SettingOutlined />,
          label: <Link to="/filter">Http 过滤器</Link>,
        },
        {
          key: '/rulefilelist',
          icon: <SettingOutlined />,
          label: <Link to="/rulefilelist">Http 转发</Link>,
        },
        {
          key: '/datalist',
          icon: <SettingOutlined />,
          label: <Link to="/datalist">自定义 mock 数据</Link>,
        },
        {
          key: '/device',
          icon: <SettingOutlined />,
          label: <Link to="/device">设备管理</Link>,
        },
      ],
    )
  } else {
    items.push(
      ...[
        {
          key: '/interception-config',
          icon: <ShoppingCartOutlined />,
          label: <Link to="/interception-config">请求拦截设置</Link>,
        },
        {
          key: '/rulefilelist',
          icon: <SettingOutlined />,
          label: <Link to="/rulefilelist">Http 转发</Link>,
        },
        {
          key: '/datalist',
          icon: <SettingOutlined />,
          label: <Link to="/datalist">自定义 mock 数据</Link>,
        },
      ],
    )
  }

  return items
}

export function HttpTrickMenu() {
  const [items, setItems] = useState<MenuItem[]>([])

  useEffect(() => {
    const unConfig = configureService.subscribe((config) => {
      const items = getMenuItems()
      setItems(items)
    })
    const unUser = userService.subscribe((user) => {
      const items = getMenuItems()
      setItems(items)
    })
    return () => {
      unConfig()
      unUser()
    }
  }, [])

  const location = useLocation()

  return <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline" items={items} />
}
