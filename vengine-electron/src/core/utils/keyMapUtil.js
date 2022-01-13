const handleKeyMap = (data, keyMap) => {
    return Object.keys(data)?.reduce((acc, cur) => {
        acc[keyMap[cur] || [cur]] = data[cur];

        return acc;
    }, {});
};

export { handleKeyMap };
