import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout, Menu, Space } from 'antd';
import {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    PushpinOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';

import CompanyInfoList from './CompanyInfoList';
import { regExpTestUtil } from 'core/utils/regExpUtil';
import useGtag from 'core/hook/useGtag';

const { Sider } = Layout;
const { SubMenu } = Menu;

const menuIcons = [
    <UserOutlined />,
    <LaptopOutlined />,
    <NotificationOutlined />,
    <PushpinOutlined />,
];

const CompanyInfo = () => {
    const location = useLocation();
    const path1 = location.pathname.split('/')[2];
    const path2 = location.pathname.split('/')[3];
    const [menus, setMenus] = useState([]);
    const [type, setType] = useState('season');
    const { trackPageView } = useGtag();
    const userMenuGetMenuType = useSelector(
        (state) => state.userMenuReducer.get.menuType
    );
    const menuClickHandle = (item) => {
        setType(item.key);
    };

    useEffect(() => {
        if (userMenuGetMenuType.data) {
            const { smenus } = userMenuGetMenuType?.data
                ?.find((v) => regExpTestUtil(v?.label) === path1)
                .items?.find((v) => {
                    return regExpTestUtil(v?.label) === path2;
                });
            setMenus(smenus.filter((v) => v.key !== 'garment'));
        }
    }, [userMenuGetMenuType, path1, path2, setMenus]);

    // Gtag
    useEffect(() => {
        trackPageView({
            page_title: `${type?.toUpperCase()} | ITEM REGISTRATION | SYSTEM `,
        });
    }, [type, trackPageView]);

    return (
        <div style={{ padding: '1rem' }}>
            <div
                style={{
                    padding: '0.5rem',
                    border: '1px solid lightgray',
                    borderRadius: '3px',
                    boxShadow: '3px 3px gray',
                }}
            >
                <div
                    style={{
                        padding: '1rem 1rem 0 1rem',
                        fontSize: '0.625rem',
                        fontWeight: 'bold',
                    }}
                >
                    <Space>
                        <PushpinOutlined />
                        ITEM REGISTRATION
                    </Space>
                </div>
                <Layout style={{ padding: '2rem 1rem' }}>
                    <Sider
                        style={{
                            // overflow: "auto",
                            left: 0,
                        }}
                    >
                        <Menu
                            theme="light"
                            mode="inline"
                            defaultSelectedKeys={['season']}
                            defaultOpenKeys={['sales']}
                            style={{
                                height: '100%',
                                borderRight: 0,
                                fontSize: '0.625rem',
                                color: '#7f7f7f',
                            }}
                            onSelect={menuClickHandle}
                        >
                            {menus?.map((v, i) => {
                                return (
                                    <SubMenu
                                        key={v.key}
                                        icon={menuIcons[i]}
                                        title={v.title}
                                    >
                                        {v?.data?.map((v2) => {
                                            return (
                                                <Menu.Item
                                                    key={v2.key}
                                                    style={{
                                                        fontSize: '0.625rem',
                                                        color: '#7f7f7f',
                                                    }}
                                                >
                                                    {v2.title ===
                                                    'DOCUMENT FORMAT'
                                                        ? 'DOCUMENT CONTRACT'
                                                        : v2.title}
                                                </Menu.Item>
                                            );
                                        })}
                                    </SubMenu>
                                );
                            })}
                        </Menu>
                    </Sider>
                    <Layout>
                        <CompanyInfoList type={type} />
                    </Layout>
                </Layout>
            </div>
        </div>
    );
};

export default CompanyInfo;
