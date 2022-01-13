import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { Switch, withRouter, useHistory, useLocation } from 'react-router-dom';
import dotenv from 'dotenv';
import { ToastContainer as ToastProvider } from 'react-toastify';
import { userGetEmailAsyncAction } from 'store/user/reducer';
import { userMenuGetMenuTypeAsyncAction } from 'store/user/menu/reducer';
import { Layout as LayoutAntd } from 'antd';

// import {
//     SigninPage,
//     SignupPage,
//     UserUpdatePage,
//     VendorPage,
//     DatabasePage,
//     CompanyUpdatePage,
//     NoticePage,
// } from 'pages';
// import SupplierPage from 'pages/company/SupplierPage';
// import ForgotPasswordPage from 'pages/user/ForgotPasswordPage';
// import { DashboardPage, VerifyPage, MaterialPage } from 'components/pages';
// import QrCode from 'pages/helper/QrCode';

import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from 'components/common/layout';
import { MainMenu } from 'components/user';
import { Loading } from 'components/UI/atoms';

import {
    PartnerManagementContainer,
    UserLists,
} from 'components/company/vendor/database';

import { ModalProvider } from 'components/context/modalContext';
import { DrawerProvider } from 'components/context/drawerContext';
import { Error, NotFound } from 'components/common/notFound';
import channelTalkUtil from 'core/utils/channelTalkUtil';

import 'antd/dist/antd.less';
import './styles/App.css';
import 'react-toastify/dist/ReactToastify.css';
import service from 'asserts/images/service.png';

const SigninPage = lazy(() =>
    import('pages').then((module) => ({ default: module.SigninPage }))
);
const SignupPage = lazy(() =>
    import('pages').then((module) => ({ default: module.SignupPage }))
);
const UserUpdatePage = lazy(() =>
    import('pages').then((module) => ({ default: module.UserUpdatePage }))
);
const VendorPage = lazy(() =>
    import('pages').then((module) => ({ default: module.VendorPage }))
);
const DatabasePage = lazy(() =>
    import('pages').then((module) => ({ default: module.DatabasePage }))
);
const CompanyUpdatePage = lazy(() =>
    import('pages').then((module) => ({ default: module.CompanyUpdatePage }))
);
const NoticePage = lazy(() =>
    import('pages').then((module) => ({ default: module.NoticePage }))
);
const SupplierPage = lazy(() => import('pages/company/SupplierPage'));
const ForgotPasswordPage = lazy(() => import('pages/user/ForgotPasswordPage'));
const DashboardPage = lazy(() =>
    import('components/pages').then((module) => ({
        default: module.DashboardPage,
    }))
);
const VerifyPage = lazy(() =>
    import('components/pages').then((module) => ({
        default: module.VerifyPage,
    }))
);
const MaterialPage = lazy(() =>
    import('components/pages').then((module) => ({
        default: module.MaterialPage,
    }))
);
const QrCode = lazy(() => import('pages/helper/QrCode'));

dotenv.config();

const requireLogin = (to, from, next) => {
    if (to.meta.auth) {
        if (localStorage.getItem('authToken')) {
            if (to.meta.userTermsAgree === 0) {
                return next.redirect('/userUpdate');
            }
            if (
                to.meta.companyTermsAgree === 0 ||
                to.meta.companyTermsFinalAgree === 0
            ) {
                return next.redirect('/companyUpdate');
            }

            return next();
        }
        return next.redirect('/signin');
    } else {
        return next();
    }
};

// localStorage.setItem('vengine_state', true);

const App = () => {
    const dispatch = useDispatch();
    const email = localStorage.getItem('email');
    const lang = 'ko';
    const history = useHistory();
    const location = useLocation();
    const [menuType, setMenuType] = useState(null);

    const signinPost = useSelector((state) => state.signReducer.post.signin);

    const userGetEmail = useSelector((state) => state.userReducer.get.email);
    const handleUserGetEmail = useCallback(
        (payload) => dispatch(userGetEmailAsyncAction.request(payload)),
        [dispatch]
    );

    const handleUserMenuGetMenuType = useCallback(
        (payload) => dispatch(userMenuGetMenuTypeAsyncAction.request(payload)),
        [dispatch]
    );
    const handleUserMenuGetMenuTypeInit = useCallback(
        () => dispatch(userMenuGetMenuTypeAsyncAction.initial()),
        [dispatch]
    );

    useEffect(() => {
        if (!signinPost.data && email) {
            handleUserGetEmail({ email, lang });
        }
    }, [email, lang, signinPost, handleUserGetEmail]);

    useEffect(() => {
        if (userGetEmail.error) {
            localStorage.clear();
            history.push('/signin');
        } else if (userGetEmail.data) {
            const { id, name1 } = userGetEmail.data.data.menuType;
            setMenuType({ menuTypeId: id, type: name1 });
        }
    }, [userGetEmail, history, setMenuType]);

    useEffect(() => {
        if (menuType && menuType?.type !== 'CUSTOM') {
            history.push('/');
            handleUserMenuGetMenuType(menuType);
        } else {
            handleUserMenuGetMenuTypeInit();
        }
    }, [
        menuType,
        history,
        handleUserMenuGetMenuType,
        handleUserMenuGetMenuTypeInit,
    ]);

    useEffect(() => {
        const { handleBoot, handleShutdown } = channelTalkUtil();

        handleBoot({
            pluginKey: process.env.REACT_APP_CHANNEL_TALK_KEY,
        });

        return () => handleShutdown();
    }, []);

    // 임시 서비스 점검
    // const INSIDE_IP = '211.63.210.203';
    // const [ip, setIP] = useState('');

    // useEffect(() => {
    //     const getData = async () => {
    //         const res = await Axios.get('https://geolocation-db.com/json/');
    //         setIP(res.data.IPv4);
    //     };
    //     getData();
    // }, []);

    return (
        <div className="App">
            <ErrorBoundary FallbackComponent={Error}>
                <Suspense fallback={<Loading />}>
                    {true ? (
                        <ModalProvider>
                            <DrawerProvider>
                                <ToastProvider
                                    position="top-right"
                                    autoClose={5000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                />

                                <GuardProvider
                                    guards={[requireLogin]}
                                    // loading={() => <div>...Loading</div>}
                                    error={(e) => {
                                        return <Error />;
                                    }}
                                >
                                    <Switch>
                                        <GuardedRoute
                                            path="/signin"
                                            component={SigninPage}
                                        />
                                        <GuardedRoute
                                            exact
                                            path={['/signup/', '/signup/:type']}
                                            component={SignupPage}
                                        />
                                        <GuardedRoute
                                            path="/forgotPassword"
                                            component={ForgotPasswordPage}
                                        />
                                        <GuardedRoute
                                            exact
                                            path="/verify"
                                            component={VerifyPage}
                                        />

                                        {/* <GuardedRoute
                                    exact
                                    path="/verifyMail"
                                    component={VerifyMailPage}
                                />
                                <GuardedRoute
                                    exact
                                    path="/verifyCode"
                                    component={VerifyCodePage}
                                /> */}

                                        <Layout>
                                            {/* 아직 결정 되지 않아서 Layout 안에 구현 */}
                                            <Layout.Side />

                                            <LayoutAntd>
                                                <Layout.Header>
                                                    <MainMenu
                                                        history={history}
                                                        location={location}
                                                        menuType={menuType}
                                                        onMenuType={setMenuType}
                                                    />
                                                </Layout.Header>
                                                <Layout.Main>
                                                    <GuardedRoute
                                                        exact
                                                        meta={{
                                                            auth: true,
                                                            userTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.termsAgree,
                                                            companyTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgree,
                                                            companyTermsFinalAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgreeFinal,
                                                        }}
                                                        path={[
                                                            '/',
                                                            '/dashboard',
                                                        ]}
                                                    >
                                                        <DashboardPage
                                                            menuType={menuType}
                                                        />
                                                    </GuardedRoute>
                                                    <GuardedRoute
                                                        meta={{
                                                            auth: true,
                                                            userTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.termsAgree,
                                                            companyTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgree,
                                                            companyTermsFinalAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgreeFinal,
                                                        }}
                                                        path="/vendor"
                                                        component={VendorPage}
                                                    />

                                                    <GuardedRoute
                                                        meta={{
                                                            auth: true,
                                                            userTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.termsAgree,
                                                            companyTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgree,
                                                            companyTermsFinalAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgreeFinal,
                                                        }}
                                                        path="/supplier"
                                                        component={SupplierPage}
                                                    />
                                                    {/* 타입 공통 */}
                                                    <GuardedRoute
                                                        meta={{
                                                            auth: true,
                                                            userTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.termsAgree,
                                                            companyTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgree,
                                                            companyTermsFinalAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgreeFinal,
                                                        }}
                                                        path={[
                                                            '/vendor/materialregister',
                                                            '/supplier/materialregister',
                                                        ]}
                                                        component={
                                                            // MaterialRegistrationContainer
                                                            MaterialPage
                                                        }
                                                    />
                                                    <GuardedRoute
                                                        meta={{
                                                            auth: true,
                                                            userTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.termsAgree,
                                                            companyTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgree,
                                                            companyTermsFinalAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgreeFinal,
                                                        }}
                                                        path={[
                                                            '/vendor/database',
                                                            '/supplier/database',
                                                        ]}
                                                        component={DatabasePage}
                                                    />

                                                    <GuardedRoute
                                                        meta={{
                                                            auth: true,
                                                            userTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.termsAgree,
                                                            companyTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgree,
                                                            companyTermsFinalAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgreeFinal,
                                                        }}
                                                        path={[
                                                            '/vendor/system/partnermanagement',
                                                            '/supplier/system/partnermanagement',
                                                        ]}
                                                        component={
                                                            PartnerManagementContainer
                                                        }
                                                    />
                                                    <GuardedRoute
                                                        meta={{
                                                            auth: true,
                                                            userTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.termsAgree,
                                                            companyTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgree,
                                                            companyTermsFinalAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.company
                                                                    ?.termsAgreeFinal,
                                                        }}
                                                        path={[
                                                            '/vendor/system/userList',
                                                            '/supplier/system/userList',
                                                        ]}
                                                        component={UserLists}
                                                    />

                                                    <GuardedRoute
                                                        meta={{
                                                            auth: true,
                                                            userTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.termsAgree,
                                                        }}
                                                        exact
                                                        path="/companyUpdate"
                                                        component={
                                                            CompanyUpdatePage
                                                        }
                                                    />
                                                    <GuardedRoute
                                                        meta={{
                                                            auth: true,
                                                        }}
                                                        exact
                                                        path="/userUpdate"
                                                        component={
                                                            UserUpdatePage
                                                        }
                                                    />

                                                    <GuardedRoute
                                                        meta={{
                                                            auth: true,
                                                            userTermsAgree:
                                                                userGetEmail
                                                                    .data?.data
                                                                    ?.termsAgree,
                                                        }}
                                                        exact
                                                        path="/qrCode"
                                                        component={QrCode}
                                                    />

                                                    <GuardedRoute
                                                        meta={{
                                                            auth: true,
                                                        }}
                                                        path="/notice"
                                                        component={NoticePage}
                                                    />
                                                </Layout.Main>
                                            </LayoutAntd>
                                        </Layout>

                                        <GuardedRoute
                                            path="*"
                                            component={NotFound}
                                        />
                                    </Switch>
                                </GuardProvider>
                            </DrawerProvider>
                        </ModalProvider>
                    ) : (
                        <div
                            style={{
                                position: 'fixed',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                background: '#fff',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src={service}
                                style={{
                                    display: 'block',
                                    width: '500px',
                                }}
                                alt="server"
                            />
                        </div>
                    )}
                </Suspense>
            </ErrorBoundary>
        </div>
    );
};

export default withRouter(React.memo(App));
