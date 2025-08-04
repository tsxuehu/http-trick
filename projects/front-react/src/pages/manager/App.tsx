import React, { useState } from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { HashRouter as Router, } from "react-router";
import { HttpTrickMenu } from "./config/menu.tsx";
import { ViewRouter } from "./config/router.tsx";
// @ts-ignore
import './app.less'

const { Header, Content, Footer, Sider } = Layout;


const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <HttpTrickMenu></HttpTrickMenu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: "0 16px" }}>
            <ViewRouter></ViewRouter>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Http Trick ©{new Date().getFullYear()} Created by tsxuehu
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
