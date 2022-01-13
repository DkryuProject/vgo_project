const getCalculateValueByUOM = (type, value, UOM) => {
    let calculateValue = 0;
    switch (type) {
        case 'cw':
            switch (UOM) {
                case 'inch':
                    calculateValue = value;
                    break;
                default:
                    calculateValue = value;
                    break;
            }
            break;
        case 'weight':
            switch (UOM) {
                case 'g/m2':
                    calculateValue = value;
                    break;
                case 'oz/m2':
                    calculateValue = value * 28.35;
                    break;
                default:
                    calculateValue = value;
                    break;
            }
            break;
        default:
            calculateValue = value;
            break;
    }

    return calculateValue;
};

const handleExchangeValue = (
    standardUnit,
    exchangeUnit,
    option = { cw: 0, cwUom: null, weight: 0, weightUom: null }
) => {
    let exchangeValue = null;

    switch (standardUnit) {
        case 'inch':
            switch (exchangeUnit) {
                case 'ft':
                    exchangeValue = 0.08333333;
                    break;
                case 'yard':
                    exchangeValue = 0.02777778;
                    break;
                case 'cm':
                    exchangeValue = 2.54;
                    break;
                case 'meter':
                    exchangeValue = 0.0254;
                    break;
                default:
                    exchangeValue = 1;
                    break;
            }
            break;
        case 'ft':
            switch (exchangeUnit) {
                case 'inch':
                    exchangeValue = 12;
                    break;
                case 'yard':
                    exchangeValue = 0.3333333;
                    break;
                case 'cm':
                    exchangeValue = 30.48;
                    break;
                case 'meter':
                    exchangeValue = 0.3048;
                    break;
                default:
                    exchangeValue = 1;
                    break;
            }
            break;

        case 'yard':
            switch (exchangeUnit) {
                case 'inch':
                    exchangeValue = 36;
                    break;
                case 'ft':
                    exchangeValue = 3;
                    break;
                case 'cm':
                    exchangeValue = 91.44;
                    break;
                case 'meter':
                    exchangeValue = 0.9144;
                    break;
                case 'lb':
                    exchangeValue =
                        (((getCalculateValueByUOM(
                            'cw',
                            option?.cw,
                            option?.cwUom
                        ) *
                            getCalculateValueByUOM(
                                'weight',
                                option?.weight,
                                option?.weightUom
                            )) /
                            43) *
                            0.01) /
                        0.453;
                    break;
                case 'kg':
                    exchangeValue =
                        ((getCalculateValueByUOM(
                            'cw',
                            option?.cw,
                            option?.cwUom
                        ) *
                            getCalculateValueByUOM(
                                'weight',
                                option?.weight,
                                option?.weightUom
                            )) /
                            43) *
                        0.01;
                    break;
                default:
                    exchangeValue = 1;
                    break;
            }
            break;
        case 'lb':
            switch (exchangeUnit) {
                case 'yard':
                    exchangeValue =
                        (((getCalculateValueByUOM(
                            'cw',
                            option?.cw,
                            option?.cwUom
                        ) *
                            getCalculateValueByUOM(
                                'weight',
                                option?.weight,
                                option?.weightUom
                            )) /
                            43) *
                            0.01) /
                        0.453;
                    break;
                default:
                    exchangeValue = 1;
                    break;
            }
            break;
        case 'kg':
            switch (exchangeUnit) {
                case 'yard':
                    exchangeValue =
                        ((getCalculateValueByUOM(
                            'cw',
                            option?.cw,
                            option?.cwUom
                        ) *
                            getCalculateValueByUOM(
                                'weight',
                                option?.weight,
                                option?.weightUom
                            )) /
                            43) *
                        0.01;
                    break;
                default:
                    exchangeValue = 1;
                    break;
            }
            break;

        case 'cm':
            switch (exchangeUnit) {
                case 'inch':
                    exchangeValue = 0.3937008;
                    break;
                case 'ft':
                    exchangeValue = 0.0328084;
                    break;
                case 'yard':
                    exchangeValue = 0.01093613;
                    break;
                case 'meter':
                    exchangeValue = 0.01;
                    break;
                default:
                    exchangeValue = 1;
                    break;
            }
            break;

        case 'meter':
            switch (exchangeUnit) {
                case 'inch':
                    exchangeValue = 39.37008;
                    break;
                case 'ft':
                    exchangeValue = 3.28084;
                    break;
                case 'yard':
                    exchangeValue = 1.093613;
                    break;
                case 'cm':
                    exchangeValue = 100;
                    break;
                default:
                    exchangeValue = 1;
                    break;
            }
            break;

        // Weight UOM
        case 'g/m2':
            switch (exchangeUnit) {
                case 'oz/m2':
                    exchangeValue = 28.35;
                    break;

                default:
                    exchangeValue = 1;
                    break;
            }
            break;
        case 'oz/m2':
            switch (exchangeUnit) {
                case 'g/m2':
                    exchangeValue = 28.35;
                    break;

                default:
                    exchangeValue = 1;
                    break;
            }
            break;

        default:
            exchangeValue = 1;
            break;
    }

    return exchangeValue;
};

const handleCalculationResult = (value, standardUnit, exchangeUnit, option) => {
    const exchangeValue = handleExchangeValue(
        standardUnit,
        exchangeUnit,
        option
    );
    if (
        standardUnit === 'lb' ||
        standardUnit === 'kg' ||
        standardUnit === 'g/m2'
    ) {
        return value / exchangeValue;
    }
    return value * exchangeValue;
};

export default handleCalculationResult;
