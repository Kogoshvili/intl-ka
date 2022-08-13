// import './index';

// const date = new Date(Date.UTC(2007, 0, 10, 10, 0, 0));
// // const date2 = new Date(Date.UTC(2007, 0, 10, 11, 0, 0));


// const locale: string | string[] = 'ka';
// const options: Intl.DateTimeFormatOptions = {
//     era: 'long', month: 'short',
//     day: '2-digit', year: 'numeric', minute: '2-digit',
//     second: '2-digit', weekday: 'short', hour12: false, hour: '2-digit', fractionalSecondDigits: 0
// };

// const DTI = new Intl.DateTimeFormat(locale, options);

// console.log(DTI.format(date));
// // // console.log(DTI.formatToParts(date));
// // // console.log(DTI.resolvedOptions());
// // // console.log(DTI.formatRange(date, date2));
// // // console.log(DTI.formatRangeToParts(date, date2));


// // const date = new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738));
// // date.toLocaleString('ka-GE', { day: '2-digit', month: 'long', year: 'numeric' });
// // console.log(date.toLocaleString('ka-GE', { day: '2-digit', month: 'long', year: 'numeric' }));
// // console.log(Intl.DateTimeFormat.supportedLocalesOf(['en', 'de-DE', 'asd', locale]));
// // console.log(Intl.DateTimeFormat.supportedLocalesOf(['en', 'ka', 'ka-GE', 'de-DE', 'asd']))
import { format } from 'date-fns';
import { ka } from 'date-fns/locale';

console.log(format(new Date(), 'BBBBB', { locale: ka }));
