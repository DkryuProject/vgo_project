function setCookie(name, value, expiredays) {
    var todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + parseInt(expiredays, 10));
    todayDate.setHours(0);
    todayDate.setMinutes(0);
    document.cookie =
        name +
        '=' +
        escape(value) +
        '; expires=' +
        todayDate.toGMTString() +
        ';';
}

const getCookie = (cname) => {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
};

export { setCookie, getCookie };
