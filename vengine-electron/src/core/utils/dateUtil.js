import moment from 'moment-timezone';

const dateFormat = (date, format = 'basic') => {
    const timeZone =
        Intl.DateTimeFormat()?.resolvedOptions()?.timeZone || 'Asia/Seoul';
    const utcStandard = moment.tz(date, 'Europe/London'); // UTC-0

    if (format === 'basic') {
        return utcStandard.clone().tz(timeZone).format('YYYY-MM-DD HH:mm');
    } else if (format === 'dateOfBirth') {
        return utcStandard.clone().tz(timeZone).format('YYYY-MM-DD');
    }

    return moment(date).tz(timeZone);
};

export default dateFormat;
