import { useState, useCallback } from 'react';

export default () => {
    const [drawer, setDrawer] = useState({});
    const [drawerContent, setDrawerContent] = useState(null);
    const [drawerStyle, setDrawerStyle] = useState({
        width: '500px',
        placement: 'right',
    });

    const handleDrawer = useCallback(
        (name, content = false, style) => {
            setDrawer({
                name: name,
                status: true,
            });

            if (content) {
                setDrawerContent(content);
            }

            if (style) {
                setDrawerStyle(style);
            }
        },
        [setDrawer, setDrawerContent, setDrawerStyle]
    );

    const closeDrawer = useCallback(
        (name, content = false, style) => {
            setDrawer({ name: name, status: false });
            setDrawerContent(content);

            if (style) {
                setDrawerStyle(style);
            }
        },

        [setDrawer, setDrawerContent, setDrawerStyle]
    );

    const openDrawer = useCallback(
        (name, content = false, style) => {
            setDrawer({ name: name, status: true });

            if (content) {
                setDrawerContent(content);
            }

            if (style) {
                setDrawerStyle(style);
            }
        },
        [setDrawer, setDrawerContent, setDrawerStyle]
    );

    return {
        drawer,
        drawerContent,
        handleDrawer,
        openDrawer,
        closeDrawer,
        drawerStyle,
    };
};
