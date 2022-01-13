import React, { useCallback } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import { Layout, Menu } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    SettingOutlined,
    AreaChartOutlined,
} from '@ant-design/icons';

import { DashboardPage, VendorPage, DatabasePage } from 'pages';
import { MainMenu } from 'components/user';
import { useLocalStorage } from 'core/utils/localStorage';
import CompanyUpdatePage from './company/CompanyUpdatePage';
import QrCode from './helper/QrCode';
import UserUpdatePage from './user/UserUpdatePage';
import SupplierPage from './company/SupplierPage';

import {
    MaterialRegistrationContainer,
    PartnerManagementContainer,
    UserLists,
} from 'components/company/vendor/database';

const {
    Header,
    Content,
    Sider,
    // Footer
} = Layout;
const { SubMenu } = Menu;

const MainPage = (props) => {
    const { match } = props;
    // const [status, setStatus] = useState("");

    // 임시로... 차후에 쿠키 내용이랑 배열로 합쳐서 저장.
    const [isCollapsedSidebar, setIsCollapsedSidebar] = useLocalStorage(
        'vengine_state'
    );

    const SiderToggle = useCallback(() => {
        setIsCollapsedSidebar((isCollapsedSidebar) => !isCollapsedSidebar);
    }, [setIsCollapsedSidebar]);

    // const handleEnter = useCallback(() => {
    //     status !== "hold" && setStatus("active");
    // }, [status]);

    // const handleLeave = useCallback(() => {
    //     status !== "hold" && setStatus("diabled");
    // }, [status]);

    return (
        <MainWrap>
            {/* <div
                style={{
                    height: "60px",
                    backgroundColor: "chocolate",
                    color: "white",
                }}
                id="titlebar"
            >
                <div id="drag-region">VENGINE</div>
            </div> */}
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={isCollapsedSidebar}
                    onCollapse={SiderToggle}
                    collapsedWidth="60"
                >
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        mode="inline"
                    >
                        <Menu.Item
                            key="1"
                            icon={<PieChartOutlined />}
                            style={{ fontWeight: 'bold' }}
                        >
                            VENGENE
                        </Menu.Item>
                        <Menu.Item
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
                        </Menu.Item>
                    </Menu>
                    {/* {localStorage.getItem("vengine_state") === "true" ? (
                        <Footer
                            style={{
                                position: "absolute",
                                bottom: "0",
                                paddingBottom: "70px",
                            }}
                        >
                            <CopyrightOutlined
                                style={{
                                    fontSize: "16px",
                                }}
                            />
                        </Footer>
                    ) : (
                        <div
                            style={{
                                position: "absolute",
                                bottom: "0",
                                paddingBottom: "60px",
                                paddingLeft: "50px",
                            }}
                        >
                            ©2021 VENGENE
                        </div>
                    )} */}
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, height: '40px' }}>
                        <MainMenu {...props} />
                    </Header>
                    <Content>
                        <LayoutWrap>
                            <div id="layout">
                                <Route
                                    exact
                                    path={`${match.path}`}
                                    component={DashboardPage}
                                />
                                <Route
                                    path={`${match.path}/vendor`}
                                    component={VendorPage}
                                />

                                <Route
                                    path={`${match.path}/supplier`}
                                    component={SupplierPage}
                                />
                                {/* 타입 공통 */}
                                <Route
                                    path={[
                                        `${match.path}/vendor/materialregister`,
                                        `${match.path}/supplier/materialregister`,
                                    ]}
                                    component={MaterialRegistrationContainer}
                                />
                                <Route
                                    path={[
                                        `${match.path}/vendor/database`,
                                        `${match.path}/supplier/database`,
                                    ]}
                                    component={DatabasePage}
                                />

                                <Route
                                    path={[
                                        `${match.path}/vendor/system/partnermanagement`,
                                        `${match.path}/supplier/system/partnermanagement`,
                                    ]}
                                    component={PartnerManagementContainer}
                                />
                                <Route
                                    path={[
                                        `${match.path}/vendor/system/userList`,
                                        `${match.path}/supplier/system/userList`,
                                    ]}
                                    component={UserLists}
                                />

                                {/* 공통 */}
                                <Route
                                    exact
                                    path={`${match.path}/companyUpdate`}
                                    component={CompanyUpdatePage}
                                />
                                <Route
                                    exact
                                    path={`${match.path}/userUpdate`}
                                    component={UserUpdatePage}
                                />

                                <Route
                                    exact
                                    path={`${match.path}/qrCode`}
                                    component={QrCode}
                                />
                            </div>
                        </LayoutWrap>
                    </Content>
                </Layout>
            </Layout>
            {/* <Footer style={{ height: 20 }}>
                <div
                    style={{
                        // position: "absolute",
                        // bottom: "0",
                        // paddingBottom: "60px",
                        // paddingLeft: "50px",
                        textAlign: "center",
                    }}
                >
                    ©2021 VENGENE
                </div>
            </Footer> */}
            {/* <LayoutWrap status={status}>
                <div
                    id="sideBar"
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}
                >
                    <input
                        type="checkbox"
                        value={status}
                        onChange={() => {
                            if (status === "hold") {
                                setStatus("active");
                            } else {
                                setStatus("hold");
                            }
                        }}
                    />
                    <div>Nav</div>
                </div>
                <div id="layout">
                    <Route
                        exact
                        path={`${match.path}`}
                        component={DashboardPage}
                    />
                    <Route
                        path={`${match.path}/vendor/:dept`}
                        component={VendorPage}
                    />
                </div>
            </LayoutWrap> */}
        </MainWrap>
    );
};

const MainWrap = styled.div`
    // #titlebar {
    //     padding: 4px;
    // }
    // #titlebar #drag-region {
    //     width: 100%;
    //     height: 100%;
    //     -webkit-app-region: drag;
    // }
    // overflow-y: auto;
`;

const LayoutWrap = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-top: 34px;

    #layout {
        position: relative;
        // padding: 0rem;
        // padding: 1rem;
        width: 100%;
        height: 100%;

        text-align: left;
        transition: all 0.5s ease;
        overflow-y: auto;
    }
`;

export default MainPage;
