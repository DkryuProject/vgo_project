import React from 'react';
import styled from 'styled-components';

import { Layout as LayoutAntd, Menu } from 'antd';
// import { useLocalStorage } from 'core/utils/localStorage';

import { PieChartOutlined } from '@ant-design/icons';

const {
    Header: HeaderAntd,
    Content: ContentAntd,
    Sider: SiderAntd,
} = LayoutAntd;
const Layout = ({ children }) => {
    return (
        <LayoutAntd style={{ minHeight: '100vh', minWidth: '1000px' }}>
            {children}
        </LayoutAntd>
    );
};

const Header = ({ children }) => {
    return (
        <HeaderAntd style={{ padding: 0, height: '40px' }}>
            {children}
        </HeaderAntd>
    );
};

Layout.Header = Header;

const Side = ({ children }) => {
    // 임시로... 차후에 쿠키 내용이랑 배열로 합쳐서 저장.
    // const [isCollapsedSidebar, setIsCollapsedSidebar] =
    //     useLocalStorage('vengine_state');

    // const SiderToggle = useCallback(() => {
    //     setIsCollapsedSidebar((isCollapsedSidebar) => !isCollapsedSidebar);
    // }, [setIsCollapsedSidebar]);
    return (
        <SiderAntd
            // collapsible
            collapsed={true}
            // onCollapse={false}
            collapsedWidth="60"
        >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item
                    key="1"
                    icon={<PieChartOutlined />}
                    style={{ fontWeight: 'bold' }}
                >
                    Vgo
                </Menu.Item>
                {/* <Menu.Item
                    key="2"
                    icon={<DesktopOutlined />}
                    style={{ fontWeight: 'bold' }}
                >
                    Option
                </Menu.Item>
                <SubMenu
                    key="sub1"
                    icon={<UserOutlined />}
                    title="CBD"
                    style={{ fontWeight: 'bold' }}
                >
                    <Menu.Item key="3">CBD Board</Menu.Item>
                    <Menu.Item key="4">CBD Analyze</Menu.Item>
                    <Menu.Item key="5">CBD Statistics</Menu.Item>
                </SubMenu>
                <SubMenu
                    key="sub2"
                    icon={<TeamOutlined />}
                    title="MCL"
                    style={{ fontWeight: 'bold' }}
                >
                    <Menu.Item key="6">MCL Board</Menu.Item>
                    <Menu.Item key="8">MCL Analyze</Menu.Item>
                    <Menu.Item key="9">MCL Statistics</Menu.Item>
                </SubMenu>
                <SubMenu
                    key="sub3"
                    icon={<AreaChartOutlined />}
                    title="V Report"
                    style={{ fontWeight: 'bold' }}
                >
                    <Menu.Item key="10">Supplier PO</Menu.Item>
                    <Menu.Item key="11">Buyer PO</Menu.Item>
                    <Menu.Item key="12">Daily Report</Menu.Item>
                    <Menu.Item key="13">Monthly Report</Menu.Item>
                    <Menu.Item key="14">Yearly Report</Menu.Item>
                </SubMenu>
                <Menu.Item
                    key="15"
                    icon={<FileOutlined />}
                    style={{ fontWeight: 'bold' }}
                >
                    Material Charts
                </Menu.Item>
                <Menu.Item
                    key="16"
                    icon={<SettingOutlined />}
                    style={{ fontWeight: 'bold' }}
                >
                    Settings
                </Menu.Item> */}
            </Menu>
        </SiderAntd>
    );
};

Layout.Side = Side;

const Main = ({ children }) => {
    return (
        <ContentAntd>
            <LayoutWrap>
                <div id="layout"> {children}</div>
            </LayoutWrap>
        </ContentAntd>
    );
};

Layout.Main = Main;

const LayoutWrap = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-top: 40px;

    #layout {
        position: relative;
        width: 100%;
        height: 100%;

        text-align: left;
        transition: all 0.5s ease;
        overflow-y: auto;
    }
`;

export default Layout;
