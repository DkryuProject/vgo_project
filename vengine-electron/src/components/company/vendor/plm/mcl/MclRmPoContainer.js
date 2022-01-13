import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';

import { Form, Steps, Button, Space } from 'antd';
import {
    MclRmPoShippingInfo,
    MclRmPoItemDetailInfo,
    MclRmPoOrderItemDetailInfo,
} from './';
const { Step } = Steps;

const MclRmPoContainer = (props) => {
    const { show } = props;
    // const { match, initialShow, onShow, onLeftSplit } = props;
    // const dispatch = useDispatch();
    // Shipping information form
    const [form] = Form.useForm();
    const mclRmPoItemDetailInfoRef = useRef();
    const mclRmPoOrderItemDetailInfoRef = useRef();

    // const [handleNotification] = useNotification();
    const [current, setCurrent] = useState(0);

    // rmPoId는 item을 선택해서 detail로 들어가거나 item 생성후 orderId를 rmPoId에 삽입한다
    const [rmPoId, setRmPoId] = useState(show.rmPo.id || '');

    // currency 삽입은 MclRmPoShippingInfo에서 currency를 새로 만들 때나 불러올 때  된다.
    // OrderItemDetailInfo 단계에서 Cover currency와 Order currency 가 다를 때
    // 환율를 삽입하기 위해서 사용 된다.
    const [currency, setCurrency] = useState(null);

    const handleMoveStep = useCallback(
        (type) => {
            if (type === 'next') {
                setCurrent(current + 1);
            } else if (type === 'prev') {
                setCurrent(current - 1);
            }
        },
        [current]
    );

    const handleShippingInfoSubmit = useCallback(() => {
        return form.submit();
    }, [form]);

    // MclRmPoItemDetailInfo 컴포넌트 안에 handleExcute 받아서 실행
    // 성공 여부에 따라 step의 next를 실행 시키기 위해
    const handleItemDetailInfo = useCallback(() => {
        const { handleExcute } = mclRmPoItemDetailInfoRef.current;
        handleExcute('save');
    }, [mclRmPoItemDetailInfoRef]);

    const handlePublished = useCallback(() => {
        const { handleExcute } = mclRmPoOrderItemDetailInfoRef.current;
        handleExcute('publish');
    }, [mclRmPoOrderItemDetailInfoRef]);

    const steps = [
        {
            title: 'First',
            content: (
                <MclRmPoShippingInfo
                    {...props}
                    form={form}
                    rmPoId={rmPoId}
                    onRmPoId={setRmPoId}
                    onMoveStep={handleMoveStep}
                    onCurrency={setCurrency}
                />
            ),
        },
        {
            title: 'Second',
            content: (
                <MclRmPoItemDetailInfo
                    {...props}
                    ref={mclRmPoItemDetailInfoRef}
                    rmPoId={rmPoId}
                    onMoveStep={handleMoveStep}
                />
            ),
        },
        {
            title: 'third',
            content: (
                <MclRmPoOrderItemDetailInfo
                    {...props}
                    ref={mclRmPoOrderItemDetailInfoRef}
                    rmPoId={rmPoId}
                    onMoveStep={handleMoveStep}
                    currency={currency}
                />
            ),
        },
    ];
    return (
        <MclRmPoContainerWrap>
            <div id="mclRmPoContainerWrap">
                <Steps current={current}>
                    {steps.map((v) => (
                        <Step key={v.title} />
                    ))}
                </Steps>
                <div>{steps[current].content}</div>
                <div className="buttonWrap">
                    <Space>
                        {current > 0 && (
                            <Button onClick={() => handleMoveStep('prev')}>
                                PREVIOUS
                            </Button>
                        )}
                        {current === 0 && (
                            <Button
                                type="primary"
                                onClick={() => handleShippingInfoSubmit()}
                            >
                                NEXT
                            </Button>
                        )}
                        {current === 1 && (
                            <Button
                                type="primary"
                                onClick={() => handleItemDetailInfo()}
                            >
                                NEXT
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button
                                type="primary"
                                onClick={() => handlePublished()}
                            >
                                CREATE
                            </Button>
                        )}
                    </Space>
                </div>
            </div>
        </MclRmPoContainerWrap>
    );
};

const MclRmPoContainerWrap = styled.div`
    height: 100%;
    padding: 1rem 1rem 2rem 1rem;
    overflow: auto;

    #mclRmPoContainerWrap {
        min-width: 500px;
        padding: 0.5rem;
        border: 1px solid lightgray;
        border-radius: 3px;
        box-shadow: 3px 3px gray;
        .titleWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
            .title {
                ${({ theme }) => theme.fonts.h5};
            }
        }
        .ant-form-item-control-input-content {
            height: 26px;
        }
        .contentsWrap {
            margin-top: 1rem;
            .content {
                .contentTitle {
                    ${({ theme }) => theme.fonts.h6};
                }

                .fakeInput {
                    height: 100%;
                    padding: 4px 11px;
                    background-color: #fff;
                    border: 1px solid #d9d9d9;
                    border-radius: 2px;
                }
            }
        }

        .buttonWrap {
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;
        }
    }
`;

export default React.memo(MclRmPoContainer);
