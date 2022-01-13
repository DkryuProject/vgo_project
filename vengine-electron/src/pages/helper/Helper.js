import { Steps } from "antd";
import React from "react";
import styled from "styled-components";

const { Step } = Steps;

const Conception = (
    <div style={{ wordWrap: "break-word", fontSize: "0.625rem" }}>
        It means creating a{" "}
        <span
            style={{
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            Design Cover
        </span>
        according to the end buyer{" "}
        <span
            style={{
                color: "#000000",
                fontWeight: 400,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            Bill of Materials (BOM)
        </span>
        . It represents the first starting point through this system and is the
        closing reference material to be achieved by the end of the final sales.
        <span
            style={{
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            The Cost Breakdown (CBD)
        </span>{" "}
        and{" "}
        <span
            style={{
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            Material Checklist (MCL)
        </span>{" "}
        are written where is a{" "}
        <span
            style={{
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            Design Cover
        </span>
        ."
    </div>
);

const Design = (
    <div style={{ wordWrap: "break-word", fontSize: "0.625rem" }}>
        When a design cover is created, a{" "}
        <span
            style={{
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            Cost Breakdown (CBD)
        </span>{" "}
        is typically created. In some cases, the{" "}
        <span
            style={{
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            Material Checklist (MCL)
        </span>{" "}
        may be completed first. This place will provide you with convenience in
        writing.
    </div>
);

const Production = (
    <div style={{ wordWrap: "break-word", fontSize: "0.625rem" }}>
        <span
            style={{
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            The Materials Purchase order
        </span>{" "}
        issued by Material Checklist (MCL) and the final purchaser’s{" "}
        <span
            style={{
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            Product Order (Purchas order)
        </span>{" "}
        management. Also,{" "}
        <span
            style={{
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            Daily Production information
        </span>{" "}
        can be checked in real time. The collection of these materials is
        operated through in-plant management systems such as Barcode and RFID.
    </div>
);

const Distribution = (
    <div style={{ wordWrap: "break-word", fontSize: "0.625rem" }}>
        After the final production is completed, the{" "}
        <span
            style={{
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            Account Receivable
        </span>{" "}
        record is automatically recorded on the system with{" "}
        <span
            style={{
                color: "#000000",
                fontWeight: 600,
                fontSize: "0.6875rem",
                textDecoration: "underline",
            }}
        >
            Delivery Note
        </span>{" "}
        at the time of shipment from the factory. After that, you will be able
        to manage more efficiently and conveniently according to the sales
        deadline for each transaction condition.
    </div>
);

export const PlmHelper = () => {
    return (
        <PlmHelperWrap>
            <Steps progressDot current={4} direction="vertical">
                <Step title="Conception" description={Conception} />
                <Step title="Design" description={Design} />
                <Step title="Production" description={Production} />
                <Step title="Distribution" description={Distribution} />
            </Steps>
        </PlmHelperWrap>
    );
};

const PlmHelperWrap = styled.div`
    display: flex;
    flex: 1;
    padding: 2rem 3rem;
    width: 80%;
    .ant-steps-item-title {
        font-size: 0.6875rem;
    }
`;
