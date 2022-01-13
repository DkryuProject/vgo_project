import { regExpTestUtil } from 'core/utils/regExpUtil';

export default class menussModel {
    constructor(data) {
        this.data = data;
    }

    normalize() {
        const normalizeData = [];

        this.data.map((value) => {
            if (!normalizeData[value.lmenu.name1]) {
                normalizeData[value.lmenu.name1] = {};
            }

            return value.menus.map((v, i) => {
                if (!normalizeData[value.lmenu.name1][v.mmenu]) {
                    normalizeData[value.lmenu.name1][v.mmenu] = {};
                }

                if (!normalizeData[value.lmenu.name1][v.mmenu][v.smenu]) {
                    normalizeData[value.lmenu.name1][v.mmenu][v.smenu] = {};
                }

                return (normalizeData[value.lmenu.name1][v.mmenu][v.smenu] = {
                    menuId: v.menuId,
                    idx: v.idx,
                    companyType: v.companyType,
                    name: v.smenu,
                    accessType: v.accessType,
                });
            });
        });

        return normalizeData;
    }

    object(payload) {
        // type은 회사 타입 예)vendor, factory
        // const { type, history } = payload;
        const { type } = payload;
        const obj = this.data.map((v, i) => {
            return {
                type: regExpTestUtil(type),
                label: v.menu,
                pathname: `/${regExpTestUtil(type)}/${regExpTestUtil(v.menu)}`,
                items: v?.mmenus?.map((v2, i2) => {
                    return {
                        label: v2?.mmenu,
                        pathname: `/${regExpTestUtil(type)}/${regExpTestUtil(
                            v.menu
                        )}/${regExpTestUtil(v2?.mmenu)}`,

                        smenus: v2?.smenus?.reduce((acc, cur) => {
                            const startIndex = cur?.indexOf('[') + 1;
                            const endIndex = cur?.indexOf(']');
                            const startStr = cur?.slice(startIndex, endIndex);
                            const endStr = cur?.slice(endIndex + 1).trim();

                            const result = acc.find(
                                (v) => v?.key === startStr?.toLowerCase()
                            );
                            if (!result) {
                                acc.push({
                                    title: startStr,
                                    key: startStr?.toLowerCase(),
                                    data: [
                                        {
                                            title: endStr,
                                            key: endStr
                                                ?.toLowerCase()
                                                .split(' ')[0],
                                        },
                                    ],
                                });
                            } else {
                                result.data.push({
                                    title: endStr,
                                    key: endStr?.toLowerCase().split(' ')[0],
                                });
                            }
                            return acc;
                        }, []),

                        // items가 없을 수도 있어서
                        // 잠시 breadcrumb 사용 중지
                        breadcrumb: [
                            {
                                name: v.menu,
                                pathname: `/${regExpTestUtil(
                                    type
                                )}/${regExpTestUtil(v.menu)}`,
                            },
                            {
                                name: v2.mmenu,
                                pathname: `/${regExpTestUtil(
                                    type
                                )}/${regExpTestUtil(v2.mmenu)}`,
                            },
                        ],
                    };
                }),
            };
        });

        return obj;
    }
}
