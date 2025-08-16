import React from 'react';
import { Menu } from 'antd';
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons';

interface IProps {
  onClick: (key: string) => void;
  close: () => void;
}

export const RecordContextMenu: React.FC<IProps> = (props) => {
  const items = [
    { key: 'saveData', icon: <PieChartOutlined />, label: '保存为mock数据' },
    { key: 'copyUrl', icon: <DesktopOutlined />, label: '复制url' },
  ];
  const onClick = () => {};
  return (
    <Menu
      selectable={false}
      mode="vertical"
      onClick={({ item, key, keyPath, domEvent }) => {
        props.onClick(key);
        props.close();
      }}
      items={items}
    />
  );
};
