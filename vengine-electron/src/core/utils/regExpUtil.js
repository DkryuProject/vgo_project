function regExpTestUtil(str = '') {
    //함수를 호출하여 특수문자 검증 시작.
    const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi; // eslint-disable-line
    if (regExp.test(str)) {
        const t = str.replace(regExp, '');
        return t.replace(/\s/gi, '').toLowerCase();
    } else {
        return str.replace(/\s/gi, '').toLowerCase();
    }
}

export { regExpTestUtil };
