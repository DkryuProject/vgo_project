import React from 'react';
// import { useSelector } from 'react-redux';
// import moment from 'moment';
// import QRCode from "qrcode.react";
// import { Space, Button, InputNumber, Row, Col } from 'antd';

const QrCode = () => {
    // const [count, setCount] = useState(0);
    // const [qrCode, setQrCode] = useState(null);
    // const userGetEmail = useSelector((state) => state.userReducer.get.email);

    // const handleAddQrCode = () => {
    //     let result = [];
    //     let nowDate = Date.now();
    //     nowDate = moment(nowDate).format("YYYYMMDDhmmss");

    //     for (let i = 0; i < count; i++) {
    //         result.push({
    //             companyName: userGetEmail.data?.data.company.companyName,
    //             userName: userGetEmail.data?.data.userName,
    //             date: nowDate,
    //             idx: i + 1,
    //         });
    //     }
    //     setQrCode(result);
    // };

    return (
        <div style={{ padding: '2rem 1rem 1rem 2rem' }}>
            {/* <Space>
                <div style={{ fontSize: "0.625rem", fontWeight: "bold" }}>
                    Enter the number of qrcode to generate
                </div>
                <InputNumber
                    type="number"
                    step="1"
                    min="0"
                    style={{ width: "100%" }}
                    onChange={(e) => setCount(e)}
                />
                <Button onClick={handleAddQrCode}>생성</Button>
            </Space>
            <div style={{ marginTop: "2rem" }}>
                <Row gutter={[10, 10]}>
                    {qrCode?.map((v, i) => {
                        return (
                            <Col span={3} key={v.idx}>
                                <QRCode
                                    value={`${v.companyName}-${v.userName}-${v.date}-${v.idx}`}
                                />
                                <div>
                                    {`${v.companyName}-${v.userName}-${v.date}-${v.idx}`}
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </div> */}
        </div>
    );
};

export default QrCode;
