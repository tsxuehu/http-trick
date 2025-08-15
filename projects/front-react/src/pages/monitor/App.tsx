import React, { useState } from 'react';
import './main.less';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import RecordList from './components/RecordList.tsx';
import TopBar from './components/TopBar.tsx';
import RecordDetail from './components/RecordDetail.tsx';

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <TopBar></TopBar>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div className="monitor-body">
            <RecordList></RecordList>
            <RecordDetail></RecordDetail>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Http Trick ©{new Date().getFullYear()} Created by tsxuehu</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
