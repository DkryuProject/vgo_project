import React from 'react';
import ReactDOM from 'react-dom';
import { DrawerContext } from 'components/context/drawerContext';
import { Drawer } from 'antd';

const DrawerPortal = () => {
    const el = document.getElementById('drawer');
    const { drawer, drawerContent, closeDrawer, drawerStyle } =
        React.useContext(DrawerContext);

    if (drawer?.status) {
        return ReactDOM.createPortal(
            <>
                <Drawer
                    {...drawerStyle}
                    closable={false}
                    onClose={() => closeDrawer(drawer?.name)}
                    visible={drawer?.status}
                >
                    {drawerContent}
                </Drawer>
            </>,
            el
        );
    } else return null;
};

export default DrawerPortal;
