import React from 'react';
import useDrawer from 'core/hook/useDrawer';
import { DrawerPortal } from 'components/UI/molecules';

let DrawerContext;
const { Provider } = (DrawerContext = React.createContext());

const DrawerProvider = ({ children }) => {
    const {
        drawer,
        drawerContent,
        handleDrawer,
        openDrawer,
        closeDrawer,
        drawerStyle,
    } = useDrawer();

    return (
        <Provider
            value={{
                drawer,
                drawerContent,
                handleDrawer,
                openDrawer,
                closeDrawer,
                drawerStyle,
            }}
        >
            <DrawerPortal />
            {children}
        </Provider>
    );
};

export { DrawerContext, DrawerProvider };
