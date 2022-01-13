const handleEmpty = (data) => {
    return typeof data === 'number'
        ? data
        : Object.keys(data).length === 0
        ? ''
        : data;
};

const handleExtract = ({ data, field, property, property2 }) => {
    let result = null;

    if (data?.['data'][field]) {
        if (
            data['data'][field][property] ||
            data['data'][field][property] === 0
        ) {
            if (
                data['data'][field][property][property2] ||
                data['data'][field][property][property2] === 0
            ) {
                result = handleEmpty(data['data'][field][property][property2]);
            } else {
                result = handleEmpty(data['data'][field][property]);
            }
        } else {
            result = data['data'][field][property] === null ? '' : '';
            // handleEmpty(data['data'][field])
        }
    } else {
        result = '';
    }

    return result;
};

export default handleExtract;
