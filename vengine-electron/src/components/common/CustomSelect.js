import React, { useEffect, useState, useCallback } from 'react';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const BASE_URL = process.env.REACT_APP_BASE_URL;

const handleTypeConfirm = (id) => {
    if (id === 'fashion') {
        return 1;
    } else if (id === 'finishing') {
        return 2;
    } else if (id === 'dyeing') {
        return 0;
    }
};

const CustomSelect = (props) => {
    const { id, rowId, selectType, dataIndex, record, onSelect, onBlur } =
        props;
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState();

    const loadOptions = useCallback(
        async (url) => {
            try {
                let option = [];
                let _option = [];

                const res = url
                    ? await axios.get(url, {
                          headers: {
                              'X-AUTH-TOKEN': localStorage.getItem('authToken'),
                          },
                      })
                    : 'afterSelect';
                if (res) {
                    // let option = [];
                    // let _option = [];
                    const defaultOption = {
                        id: '',
                        name: 'NO SELECT',
                    };

                    switch (selectType.name) {
                        case 'company':
                            option =
                                res.data &&
                                res.data.list.map((v) => {
                                    return {
                                        id: v.companyId,
                                        name: v.companyName,
                                    };
                                });

                            switch (selectType.type) {
                                case 'relation':
                                    option = res.data?.list.map((v) => {
                                        return {
                                            id: v.companyID,
                                            name: v.companyName,
                                        };
                                    });

                                    // supplier 입장에서 조회 할때 All이란 타입이 들어가야함
                                    if (dataIndex === 'notEditable') {
                                        option.push({ id: null, name: 'All' });
                                    }
                                    break;

                                case 'brand':
                                    option = res.data?.list.map((v) => {
                                        return {
                                            id: v.companyID,
                                            name: v.companyName,
                                        };
                                    });
                                    break;

                                case 'after':
                                    option =
                                        res.data &&
                                        res.data.list
                                            .filter(
                                                (v) =>
                                                    Number(v.type) ===
                                                    handleTypeConfirm(id)
                                            )
                                            .map((v) => {
                                                return {
                                                    id: v.id,
                                                    name: v.name,
                                                    type: v.type,
                                                };
                                            });
                                    break;

                                case 'afterSelect':
                                    option = [
                                        { id: 0, name: 'dyeing' },
                                        { id: 1, name: 'fashion' },
                                        { id: 2, name: 'finishing' },
                                    ];
                                    break;

                                default:
                                    return option;
                            }

                            break;

                        case 'common':
                            switch (selectType.type) {
                                case 'uom':
                                    option =
                                        res.data &&
                                        res.data.list
                                            .filter((v) => v.id !== 18672) // km 필터링
                                            .map((v) => {
                                                return {
                                                    id: v.id,
                                                    name: v.name,
                                                };
                                            });
                                    break;

                                case 'list':
                                    // rm po에서 사용
                                    if (selectType.filter === 'length&mass') {
                                        option = res?.data?.list
                                            .filter(
                                                (v) =>
                                                    v.name2 === 'length' ||
                                                    v.name2 === 'mass'
                                            )
                                            .filter(
                                                (v) =>
                                                    v.name3 === 'yard' ||
                                                    v.name3 === 'inch' ||
                                                    v.name3 === 'meter' ||
                                                    v.name3 === 'lb' ||
                                                    v.name3 === 'kg'
                                            )
                                            .map((v) => {
                                                return {
                                                    id: v.id,
                                                    name: v.name3,
                                                };
                                            });
                                    } else if (
                                        selectType.filter ===
                                        'counting&length&mass'
                                    ) {
                                        option = res?.data?.list
                                            .filter(
                                                (v) =>
                                                    v.name2 === 'counting' ||
                                                    v.name2 === 'length' ||
                                                    v.name2 === 'mass'
                                            )
                                            .map((v) => {
                                                return {
                                                    id: v.id,
                                                    name: v.name3,
                                                };
                                            });
                                    } else {
                                        option = res?.data?.list.map((v) => {
                                            return {
                                                id: v.id,
                                                name: v.name || v?.name1,
                                            };
                                        });
                                    }

                                    break;

                                case 'currency':
                                    option =
                                        res.data &&
                                        res.data.list.map((v) => {
                                            return { id: v.id, name: v.name2 };
                                        });
                                    break;

                                case 'enums':
                                    option = res.data?.data[selectType.path]
                                        .filter((v) =>
                                            selectType.path === 'userStatus'
                                                ? v.key !== 'W'
                                                : true
                                        )
                                        .map((v) => {
                                            return {
                                                id: v.key,
                                                name: v.value,
                                            };
                                        });
                                    break;

                                case 'countries':
                                    option =
                                        res.data &&
                                        res.data.list.map((v) => {
                                            return {
                                                id: v.id,
                                                name: v.name1,
                                                data: v.name3,
                                            };
                                        });
                                    break;
                                case 'cities':
                                    option =
                                        res.data &&
                                        res.data.list.map((v) => {
                                            return {
                                                id: v.id,
                                                name: v.name,
                                            };
                                        });
                                    break;

                                default:
                                    option =
                                        res.data &&
                                        res.data.list.map((v) => {
                                            return { id: v.id, name: v.name1 };
                                        });
                                    break;
                            }
                            break;

                        case 'market':
                            option =
                                res.data &&
                                res.data.list.map((v) => {
                                    return { id: v.id, name: v.name };
                                });
                            break;

                        case 'material':
                            switch (selectType.type) {
                                case 'subsidary':
                                    option =
                                        res.data &&
                                        res.data.list.map((v) => {
                                            return {
                                                id: v.materialSubsidiarySizeId,
                                                name: `${v.size} ${v.sizeUom.name3}`,
                                                data: {
                                                    size: v.size,
                                                    sizeUom: v.sizeUom,
                                                },
                                            };
                                        });
                                    break;

                                case 'option':
                                    option =
                                        res.data &&
                                        res.data.list.map((v) => {
                                            return {
                                                id: v.materialOptionID,
                                                name: (
                                                    <div>
                                                        <div>
                                                            * CW : {v.cw}
                                                            {v.cwUom?.name3} *
                                                            Weight : {v.weight}{' '}
                                                            {v.weightUom?.name3}
                                                        </div>
                                                        <div>
                                                            * Finished/Dye
                                                            Method : Nano{' '}
                                                            {v.fashion?.name} +{' '}
                                                            {v.finishing?.name}{' '}
                                                            + {v.dyeing?.name}
                                                        </div>
                                                    </div>
                                                ),

                                                data: {
                                                    materialOptionID:
                                                        v.materialOptionID,
                                                    fashion: v.fashion,
                                                    finishing: v.finishing,
                                                    dyeing: v.dyeing,
                                                },
                                            };
                                        });
                                    break;
                                default:
                                    return option;
                            }

                            break;

                        case 'user':
                            option =
                                res.data &&
                                res.data.list.map((v) => {
                                    return {
                                        id: v.userLevelId,
                                        name: v.userLevelName,
                                    };
                                });
                            break;

                        case 'mcl':
                            switch (selectType.type) {
                                case 'assignPoColor':
                                    _option =
                                        res.data &&
                                        res.data.list.map((v) => {
                                            return { id: v, name: v };
                                        });

                                    option = [defaultOption, ..._option];
                                    break;

                                case 'assignPoSize':
                                    _option =
                                        res.data &&
                                        res.data.list.map((v) => {
                                            return { id: v, name: v };
                                        });

                                    option = [defaultOption, ..._option];
                                    break;

                                case 'assignPoMarket':
                                    _option =
                                        res.data &&
                                        res.data.list.map((v) => {
                                            return { id: v, name: v };
                                        });

                                    option = [defaultOption, ..._option];
                                    break;

                                default:
                                    option =
                                        res.data &&
                                        res.data.list.map((v) => {
                                            return { id: v.id, name: v.name1 };
                                        });
                                    break;
                            }
                            break;

                        default:
                            return option;
                    }

                    setOptions(option);
                }
            } catch (e) {
                console.log(e);
            }
        },
        [id, selectType, dataIndex]
    );

    useEffect(() => {
        let url;
        // console.log('selectType: ', selectType);
        switch (selectType.name) {
            case 'company':
                url = `${BASE_URL}/v1/companys`;
                switch (selectType.type) {
                    case 'relation':
                        url = `${BASE_URL}/v1/company/${selectType.path}`;
                        break;

                    case 'brand':
                        const { buyerCompany } = record;
                        url = `${BASE_URL}/v1/brand/${buyerCompany?.id}`;
                        break;

                    case 'after':
                        url = `${BASE_URL}/v1/company-info/list?type=after`;
                        break;

                    case 'afterSelect':
                        url = undefined;
                        break;

                    default:
                        return url;
                }
                break;

            case 'common':
                switch (selectType.type) {
                    // case 'after':
                    //     url = `${BASE_URL}/v1/common/afters/list`;
                    //     break;

                    case 'uom':
                        url = `${BASE_URL}/v1/common/basic/uom/${selectType.path}`;
                        break;

                    case 'enums':
                        url = `${BASE_URL}/v1/common/enums`;
                        break;

                    case 'countries':
                        url = `${BASE_URL}/v1/common/basic/countries`;
                        break;

                    case 'cities':
                        const { country } = record;
                        // if (!selectType['path']) {
                        //     return alert('Counry를 먼저 선택해 주세요.');
                        // }

                        url = `${BASE_URL}/v1/common/basic/cities/${
                            country?.name3 || country?.data
                        }`;
                        break;

                    case 'list':
                        url = `${BASE_URL}/v1/common/basic/list/${selectType.path}`;
                        break;
                    default:
                        url =
                            `${BASE_URL}/v1/common/basic/list/` +
                            selectType.type;
                        break;
                }
                break;

            case 'market':
                url = `${BASE_URL}/v1/company-info/list?type=market`;
                break;

            case 'material':
                url = `${BASE_URL}/v1/material/${selectType.type}/info/${selectType.path}
                    `;
                break;

            case 'user':
                url = `${BASE_URL}/v1/user/${selectType.type}/${selectType.path}
                    `;
                break;

            case 'mcl':
                switch (selectType.type) {
                    case 'assignPoColor':
                        url = `${BASE_URL}/v1/mcl/assign/po/color/${selectType.path}`;
                        break;
                    case 'assignPoSize':
                        url = `${BASE_URL}/v1/mcl/assign/po/size/${selectType.path}`;
                        break;
                    case 'assignPoMarket':
                        url = `${BASE_URL}/v1/mcl/assign/po/market/${selectType.path}`;
                        break;
                    default:
                        return url;
                }
                break;

            default:
                return url;
        }

        loadOptions(url);

        if (props.value) {
            setValue(props.value.name);
        }

        // return () => {
        //     loadOptions(url);
        // };
    }, [selectType, rowId, record, props.value, loadOptions]);

    // useEffect(() => {
    //     return () => {
    //         loadOptions();
    //     };
    // }, [loadOptions]);

    return (
        <Select
            // allowClear
            size="small"
            style={{ wordBreak: 'keep-all' }}
            showSearch
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={value}
            onSelect={onSelect}
            onBlur={onBlur}
            autoFocus={true}
            defaultOpen={true}
        >
            {options &&
                options.map((option) => {
                    return (
                        <Option
                            key={option.id}
                            value={option.id}
                            data={option.data && option.data}
                        >
                            {option.name}
                        </Option>
                    );
                })}
        </Select>
    );
};

export default CustomSelect;
