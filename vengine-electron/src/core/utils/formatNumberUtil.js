function formatNumberUtil(num) {
    if (!num) {
        return 0;
    }
    const _num = num.toString().split('.');
    const integer = _num[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    return _num.length > 1 ? `${integer}.${_num[1]}` : integer;
}

export default formatNumberUtil;
