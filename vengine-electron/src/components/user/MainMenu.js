import React, { useCallback, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { regExpTestUtil } from 'core/utils/regExpUtil';
import { userGetEmailAsyncAction } from 'store/user/reducer';
import styled from 'styled-components';
import { Menu, Breadcrumb, Button, Select, Space, Badge } from 'antd';
import {
    SettingOutlined,
    ContainerOutlined,
    CarOutlined,
    BulbOutlined,
    DollarCircleOutlined,
    LeftCircleOutlined,
    DatabaseOutlined,
    HomeOutlined,
    BarcodeOutlined,
} from '@ant-design/icons';
import { Fragment } from 'react';
import TableButton from 'components/common/table/TableButton';
import { noticeGetPagesAsyncAction } from 'store/notice/reducer';
import { Ellipsis } from 'components/UI/atoms';

const { Option } = Select;
const { SubMenu } = Menu;

const MenuIcon = [
    <ContainerOutlined />,
    <CarOutlined />,
    <BulbOutlined />,
    <DollarCircleOutlined />,
    <SettingOutlined />,
    <DatabaseOutlined />,
    <HomeOutlined />,
    <BarcodeOutlined />,
];

const MainMenu = (props) => {
    const { location, history, menuType, onMenuType } = props;
    const path1 = location.pathname.split('/')[2];
    const path2 = location.pathname.split('/')[3];
    const dispatch = useDispatch();

    const userMenuGetMenuType = useSelector(
        (state) => state.userMenuReducer.get.menuType
    );

    const userGetEmail = useSelector((state) => state.userReducer.get.email);
    const handleUserGetEmailInit = useCallback(
        () => dispatch(userGetEmailAsyncAction.initial()),
        [dispatch]
    );

    const noticeGetPages = useSelector(
        (state) => state.noticeReducer.get.pages
    );
    const handleNoticeGetPages = useCallback(
        (payload) => dispatch(noticeGetPagesAsyncAction.request(payload)),
        [dispatch]
    );

    const noticeState = useMemo(() => {
        let current = new Date();
        current.setDate(current.getDate() - 3);
        const result = noticeGetPages.data?.page?.content?.some(
            (v) => new Date(v.updated).getTime() > current.getTime()
        );

        return result;
    }, [noticeGetPages]);

    // 조회
    useEffect(() => {
        if (userGetEmail.data) {
            handleNoticeGetPages({ current: 1, pageSize: 15 });
        }
    }, [userGetEmail.data, handleNoticeGetPages]);

    // if (!userMenuGetMenuType.data) {
    //     return false;
    // }

    const SelectTypeBox = useCallback(
        () => (
            <Select
                defaultValue={menuType?.type}
                onChange={(_, record) =>
                    onMenuType((menuType) => ({
                        ...menuType,
                        menuTypeId: record.value,
                        type: record.children,
                    }))
                }
                style={{
                    width: 120,
                    height: 30,
                    color: '#068485',
                    fontWeight: 'bold',
                }}
                disabled={
                    userGetEmail.data?.data?.user_type?.toLowerCase() === 'p'
                        ? true
                        : false
                }
            >
                {/* <Option value={1}>BUYER</Option> */}
                <Option value={2}>VENDOR</Option>
                {/* <Option value={3}>FACTORY</Option> */}
                <Option value={4}>SUPPLIER</Option>
                {/* <Option value={5}>FORWARDER</Option> */}
            </Select>
        ),
        [menuType, onMenuType, userGetEmail.data]
    );
    return (
        <HeaderWrap>
            <MenuWrap>
                <div className="logoWrap">
                    <Link to={'/'}>
                        <HomeOutlined
                            style={{
                                width: '26px',
                                height: '26px',
                                color: '#068485',
                                fontSize: 18,
                                paddingRight: 10,
                            }}
                        />
                    </Link>
                    <div style={{ paddingRight: '10px' }} />
                    <SelectTypeBox />
                </div>
                <Menu
                    mode="horizontal"
                    theme="light"
                    style={{
                        width: '100%',
                        paddingTop: 3,
                        backgroundColor: 'white',
                    }}
                >
                    {userMenuGetMenuType?.data?.map((v1, i1) => {
                        return (
                            <SubMenu
                                key={`SubMenu${i1}`}
                                icon={MenuIcon[i1]}
                                title={v1.label}
                                style={{ fontWeight: 'bold', color: '#068485' }}
                                onTitleClick={() => {
                                    // if (v1.label === 'PLM') {
                                    //     return history.push(
                                    //         '/vendor/plmHelper'
                                    //     );
                                    // }

                                    // 하위 메뉴가 없다면  설정해둔 pathname으로 이동
                                    if (!v1.items) {
                                        return history.push(v1.pathname);
                                    }

                                    return;
                                }}
                            >
                                {v1?.items
                                    ?.filter(
                                        (v) => v.label !== 'BUYER MANAGEMENT'
                                    )
                                    // User가 Member면 User list 숨김
                                    ?.filter(
                                        (v) =>
                                            userGetEmail.data?.data?.level
                                                ?.userLevelId !== 1 ||
                                            v.label !== 'USER LIST'
                                    )
                                    ?.map((v2, i2) => {
                                        return (
                                            <Menu.Item
                                                key={`setting:${i1}${i2}`}
                                            >
                                                <Link to={v2?.pathname}>
                                                    {v2?.label}
                                                </Link>
                                            </Menu.Item>
                                        );
                                    })}
                            </SubMenu>
                        );
                    })}
                </Menu>

                <div className="searchWrap">
                    <Space>
                        {/* 일단 search는 나중에 */}
                        {/* <Input
                            placeholder="Search"
                            style={{
                                // width: 150,
                                minWidth: 50,
                            }}
                        /> */}
                        {/* <TableButton
                            toolTip={{
                                placement: 'topLeft',
                                title: 'Notices',
                                arrowPointAtCenter: true,
                            }}
                            mode="bell"
                            size="small"
                            onClick={() =>
                                openModal(
                                    'Bug Report',
                                    <iframe
                                        src="https://docs.google.com/forms/d/e/1FAIpQLSdIWKacaHbuJds64Q3Cbje77gur9JWhm5s4quipZOOJV8NPtQ/viewform"
                                        // src="https://docs.google.com/spreadsheetembeddedform?formkey=1FAIpQLSdIWKacaHbuJds64Q3Cbje77gur9JWhm5s4quipZOOJV8NPtQ"
                                        width="100%"
                                        height="500px"
                                        style={{ border: '0px' }}
                                    ></iframe>,
                                    null,
                                    '70%'
                                )
                            }
                        />

                        <TableButton
                            toolTip={{
                                placement: 'topLeft',
                                title: 'Notices',
                                arrowPointAtCenter: true,
                            }}
                            mode="bell"
                            size="small"
                            onClick={() => {
                                var anchor = document.createElement('a');
                                anchor.href =
                                    'https://docs.google.com/forms/d/e/1FAIpQLSdIWKacaHbuJds64Q3Cbje77gur9JWhm5s4quipZOOJV8NPtQ/viewform';
                                anchor.target = '_blank';
                                anchor.click();
                            }}
                        /> */}

                        <div
                            style={{
                                minWidth: '150px',
                                maxWidth: '250px',
                                color: '#068485',
                            }}
                        >
                            <Ellipsis>
                                {userGetEmail.data?.data?.userName} (
                                {userGetEmail.data?.data?.email})
                            </Ellipsis>
                        </div>
                        <Badge dot={noticeState}>
                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Notices',
                                    arrowPointAtCenter: true,
                                }}
                                mode="bell"
                                size="small"
                                onClick={() => history.push('/notice/lists')}
                            />
                        </Badge>
                        <TableButton
                            toolTip={{
                                placement: 'topLeft',
                                title: 'User Info',
                                arrowPointAtCenter: true,
                            }}
                            mode="user"
                            size="small"
                            onClick={() => history.push('/userUpdate')}
                        />
                        {userGetEmail.data?.data?.user_type?.toLowerCase() ===
                            'p' || (
                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Company Info',
                                    arrowPointAtCenter: true,
                                }}
                                mode="company"
                                size="small"
                                onClick={() => history.push('/companyUpdate')}
                            />
                        )}
                        <TableButton
                            toolTip={{
                                placement: 'topLeft',
                                title: 'Guide',
                                arrowPointAtCenter: true,
                            }}
                            mode="question"
                            size="small"
                            onClick={
                                () => {
                                    var anchor = document.createElement('a');
                                    anchor.href =
                                        'https://v-go.notion.site/v-go/V-Go-Service-Guide-7f641ce3d4eb4588abb3faa33e35ff70';
                                    anchor.target = '_blank';
                                    anchor.click();
                                }

                                // window.open(
                                //     'https://v-go.notion.site/v-go/A-Better-Way-For-Your-Apparel-Work-100901faca1a45a5a6f7d9d588f59475',
                                //     'name',
                                //     'width=1024,height=768,top=500,left=500,status=no,toolbar=no,location=no,scrollbars=no'
                                // )
                            }
                        />
                        <div style={{ marginLeft: '100px' }}>
                            <TableButton
                                toolTip={{
                                    placement: 'topLeft',
                                    title: 'Logout',
                                    arrowPointAtCenter: true,
                                }}
                                mode="logout"
                                size="small"
                                onClick={() => {
                                    localStorage.clear();
                                    handleUserGetEmailInit();
                                    return history.push('/signin');
                                }}
                            />
                        </div>
                        {/* {userGetEmail.data?.data.userId === 2 && (
                            <Button
                                onClick={() => history.push('/qrCode')}
                                icon={
                                    <BarcodeOutlined
                                        style={{
                                            fontSize: '16px',
                                            color: '#068485',
                                        }}
                                    />
                                }
                                size="small"
                                style={{
                                    borderColor: '#068485',
                                }}
                            />
                        )} */}
                    </Space>
                </div>
            </MenuWrap>

            <BreadcrumbWrap>
                <Button
                    icon={
                        <LeftCircleOutlined
                            style={{ fontSize: '24px', color: '#ffffff' }}
                        />
                    }
                    onClick={() => history.goBack()}
                    title={'Back'}
                    style={{ border: '0px', background: 'transparent' }}
                />

                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/" style={{ color: '#ffffff' }}>
                            HOME
                        </Link>
                    </Breadcrumb.Item>
                    {userMenuGetMenuType.data
                        ?.filter((v) => regExpTestUtil(v.label) === path1)
                        .map((v, i) => {
                            return (
                                <Fragment key={i}>
                                    <Breadcrumb.Item>
                                        <Link
                                            to={''}
                                            style={{
                                                color: '#ffffff',
                                            }}
                                        >
                                            {v.label}
                                        </Link>
                                    </Breadcrumb.Item>
                                    {v.items
                                        ?.filter(
                                            (v2) =>
                                                regExpTestUtil(v2.label) ===
                                                path2
                                        )
                                        .map((v2, i2) => {
                                            return (
                                                <Breadcrumb.Item key={i2}>
                                                    <Link
                                                        to={''}
                                                        style={{
                                                            color: '#ffffff',
                                                        }}
                                                    >
                                                        {v2.label}
                                                    </Link>
                                                </Breadcrumb.Item>
                                            );
                                        })}
                                </Fragment>
                            );
                        })}

                    {/* {userMenuGetMenuType.data
                        .filter((f1) => regExpTestUtil(f1.label) === path1)
                        .map((v1, i1) => {
                            return v1.items
                                ?.filter(
                                    (f2) => regExpTestUtil(f2.label) === path2
                                )
                                ?.map((v2, i2) => {
                                    return v2.breadcrumb.map((v3, i3) => {
                                        return (
                                            <Breadcrumb.Item>
                                                <Link
                                                    to={v3.pathname}
                                                    style={{
                                                        color: '#ffffff',
                                                    }}
                                                >
                                                    {v3.name}
                                                </Link>
                                            </Breadcrumb.Item>
                                        );
                                    });
                                });
                        })} */}
                </Breadcrumb>
            </BreadcrumbWrap>
        </HeaderWrap>
    );
};

const HeaderWrap = styled.div`
    width: 100%;
    // padding: 0 10px;
    background-color: white;
`;

const MenuWrap = styled.div`
    // border: 1px solid red;
    width: 100%;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    .logoWrap {
        padding: 2px 0px;
        // border-bottom: 1px solid lightgray;
        display: flex;
        align-items: center;
        img {
            display: block;
            margin-right: 0.5rem;
        }
    }

    .ant-menu {
        .ant-menu-item {
            ${({ theme }) => theme.fonts.h7};
        }
        .ant-menu-submenu {
            .ant-menu-submenu-title {
                ${({ theme }) => theme.fonts.h7};
            }
        }
        border: 0;
    }

    .ant-select-arrow {
        color: #068485;
    }

    .searchWrap {
        display: flex;
        height: 40px;
        align-items: center;
        margin-left: auto;
        // border-bottom: 1px solid lightgray;
    }
`;

const BreadcrumbWrap = styled.div`
    display: flex;
    flex: 1;
    background-color: #068485;
    justify-content: start;
    align-items: center;
    // padding-top: 5px;
    padding: 4px 10px;
    .ant-breadcrumb {
        margin-left: 1rem;
        .ant-breadcrumb-link a {
            ${({ theme }) => theme.fonts.h6};
        }
    }
`;

export default React.memo(MainMenu);
