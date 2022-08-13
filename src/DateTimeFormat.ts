import { format } from 'date-fns';
import { ka } from 'date-fns/locale';
import { getLongTimezone } from './utils';
import {
    Undefinable,
    FormatMatcher,
    LocaleMatcher,
    NumberingSystem,
    TimeZoneName,
    Calendar,
    Era,
    Year,
    Month,
    Weekday,
    Day,
    DayPeriod,
    Hour,
    Minute,
    Second,
    FractionalSecondDigits,
    HourCycle,
    DateStyle,
    TimeStyle
} from './models';

const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
const timezoneNames = getLongTimezone();

class DateTimeFormat  {
    #locale: string = resolvedOptions.locale; // ka || ka-GE

    #formatMatcher: FormatMatcher;
    #localeMatcher: LocaleMatcher;

    #timeZone: string = resolvedOptions.timeZone; // Asia/Tbilisi, ... | UTC, EST, ...
    #timeZoneName: TimeZoneName = 'short'; // Pacific Standard Time, GMT+4, ...

    #numberingSystem: NumberingSystem = resolvedOptions.numberingSystem as NumberingSystem; // Latn
    #calendar: Calendar = resolvedOptions.calendar as Calendar; // Gregory

    #era: Era;
    #year: Year = resolvedOptions.year as Year;
    #month: Month = resolvedOptions.month as Month;
    #weekday: Weekday;
    #day: Day = resolvedOptions.day as Day;
    #dayPeriod: DayPeriod; // in the morning, at night, ...
    #hour: Hour;
    #minute: Minute;
    #second: Second;
    #fractionalSecondDigits: FractionalSecondDigits;

    #hour12: Undefinable<boolean> = false;
    #hourCycle: HourCycle; // h11, h12, ...

    #dateStyle: DateStyle;
    #timeStyle: TimeStyle;

    constructor(locales?: string | string[] | undefined, options?: Intl.DateTimeFormatOptions | undefined) {
        if (locales instanceof Array) {
            const supportedLocales = Intl.DateTimeFormat.supportedLocalesOf(locales);
            this.#locale = supportedLocales.length > 0 ? supportedLocales[0] : resolvedOptions.locale;
        } else {
            this.#locale = locales ?? resolvedOptions.locale;
        }

        this.#localeMatcher = options?.localeMatcher;
        this.#formatMatcher = options?.formatMatcher;

        this.#timeZone = options?.timeZone ?? resolvedOptions.timeZone;
        this.#timeZoneName = options?.timeZoneName;

        this.#numberingSystem = (options?.numberingSystem ?? resolvedOptions.numberingSystem) as NumberingSystem;
        this.#calendar = (options?.calendar ?? resolvedOptions.calendar) as Calendar;

        this.#era = options?.era;
        this.#year = options?.year;
        this.#month = options?.month;
        this.#weekday = options?.weekday;
        this.#day = options?.day;
        this.#dayPeriod = options?.dayPeriod;
        this.#hour = options?.hour;
        this.#minute = options?.minute;
        this.#second = options?.second;
        this.#fractionalSecondDigits = options?.fractionalSecondDigits;

        this.#hour12 = options?.hour12 ?? false;
        this.#hourCycle = options?.hourCycle;

        this.#dateStyle = options?.dateStyle;
        this.#timeStyle = options?.timeStyle;
    }

    #toDate(date: number | bigint | Date | undefined): Date {
        let result = date;

        if (date === undefined) {
            result = new Date();
        } else if (typeof date === 'number') {
            result = new Date(date);
        } else if (typeof date === 'bigint') {
            result = new Date(Number(date));
        }

        return result as Date;
    }

    #earFormat(): string | undefined {
        switch (this.#era) {
            case 'short':
                return 'GG';
            case 'long':
                return 'GGGG';
            case 'narrow':
                return 'GGGGG';
            default:
                return;
        }
    }

    #yearFormat(): string | undefined {
        switch (this.#year) {
            case 'numeric':
                return 'yyyy';
            case '2-digit':
                return 'yy';
            default:
                return;
        }
    }

    #monthFormat(): string | undefined {
        switch (this.#month) {
            case 'numeric':
                return 'M';
            case '2-digit':
                return 'MM';
            case 'short':
                return 'MMM';
            case 'long':
                return 'MMMM';
            case 'narrow':
                return 'MMMMM';
            default:
                return;
        }
    }

    #weekdayFormat(): string | undefined {
        switch (this.#weekday) {
            case 'short':
                return 'EE';
            case 'long':
                return 'EEEE';
            case 'narrow':
                return 'EEEEE';
            default:
                return;
        }
    }

    #dayFormat(): string | undefined {
        switch (this.#day) {
            case 'numeric':
                return 'd';
            case '2-digit':
                return 'dd';
            default:
                return;
        }
    }

    #dayPeriodFormat(): string | undefined {
        switch (this.#dayPeriod) {
            case 'short':
                return 'BBBB';
            case 'long':
                return 'BB';
            case 'narrow':
                return 'BBBBB';
            default:
                return;
        }
    }

    #hourFormat(): string | undefined {
        let formatterChar = 'H';

        switch (this.#hourCycle) {
            case 'h11':
                formatterChar = 'k';
                break;
            case 'h12':
                formatterChar = 'h';
                break;
            case 'h23':
                formatterChar = 'H';
                break;
            case 'h24':
                formatterChar = 'k'
                break;
            default:
                if (this.#hour12) formatterChar = 'h'
        }

        switch (this.#hour) {
            case 'numeric':
                return formatterChar;
            case '2-digit':
                return formatterChar + formatterChar;
        }
    }

    #minuteFormat(): string | undefined {
        switch (this.#minute) {
            case 'numeric':
                return 'm';
            case '2-digit':
                return 'mm';
            default:
                return;
        }
    }

    #secondFormat(): string | undefined {
        switch (this.#second) {
            case 'numeric':
                return 's';
            case '2-digit':
                return 'ss';
            default:
                return;
        }
    }

    #fractionalSecondFormat(): string | undefined {
        switch (this.#fractionalSecondDigits) {
            case 1:
                return 'S';
            case 2:
                return 'SS';
            case 3:
                return 'SSS';
            default:
                return;
        }
    }

    #timeFormat(): string {
        switch (this.#timeStyle) {
            case 'full':
                return 'EEEE dd MMMM yyyy';
            case 'long':
                return 'dd MMMM yyyy';
            case 'medium':
                return 'dd MMM yyyy';
            case 'short':
                return 'dd/MM/yyyy';
        }

        const dayPeriod = this.#dayPeriodFormat();
        const hour = this.#hourFormat();
        const minute = this.#minuteFormat();
        const second = this.#secondFormat();
        const fractionalSecond = this.#fractionalSecondFormat();
        let result = '';

        if (hour && !minute && second) {
            result = `${dayPeriod} ${hour} (${second} წამი)`.trim();
        } else {
            result = [dayPeriod, hour, minute, second, fractionalSecond].filter(v => v !== undefined).join(':');
        }

        return result;
    }

    #dateFormat() {
        switch (this.#dateStyle) {
            case 'full':
                return 'hh:mm:ss OOOO'; // OOOO gets replace with long name GMT+04:00 => Georgia Standard Time
            case 'long':
                return 'hh:mm:ss OOO';
            case 'medium':
                return 'hh:mm:ss';
            case 'short':
                return 'hh:mm';
        }

        const weekday = this.#weekdayFormat();
        const day = this.#dayFormat();
        const month = this.#monthFormat();
        const year = this.#yearFormat();
        const era = this.#earFormat();

        const main = [day, month, year].filter(v => v !== undefined).join(month && month.length > 2 ? ' ' : '/');
        const result = [weekday, main, era].filter(v => v !== undefined).join(' ');

        return result;
    }

    #finalFormat() {
        const h12 = this.#hour12 ? 'aa' : undefined;
        const timeString = this.#timeFormat();
        const dateString = this.#dateFormat();
        const defaultFormat = 'dd/MM/yyyy';

        const result = [dateString, timeString, h12].filter(v => v !== undefined).join(' ').trim();

        return result || defaultFormat
    }

    format(date?: number | Date | undefined): string {
        const result = format(this.#toDate(date), this.#finalFormat(), { locale: ka });

        if (this.#dateStyle === 'full') {
            const regex = new RegExp(/[A-Z]{3}[+-]\d{2}:\d{2}/i);
            return result.replace(regex, timezoneNames.long!)
        }

        return result;
    }

    formatToParts(date?: number | Date | undefined): Intl.DateTimeFormatPart[] {
        let formatStringArray = this.#finalFormat().split('');
        let result: Intl.DateTimeFormatPart[] = [];
        let formatStringLength = formatStringArray.length;

        for (let i = 0; i < formatStringLength; i++) {
            const char = formatStringArray[i];
            if (formatCharType[char] !== 'literal') {
                const subFormatArray = formatStringArray.filter(v => v === char);

                result.push({
                    type: formatCharType[char],
                    value: format(this.#toDate(date), subFormatArray.join(''), { locale: ka })
                });

                formatStringArray = formatStringArray.filter(v => v !== char);
                formatStringLength -= subFormatArray.length;
                i--;
            } else {
                result.push({
                    type: 'literal',
                    value: char
                });
            }
        }

        result = result.reduce((acc, cur, i) => {
            if (acc.length === 0) return [cur];

            const prev = acc[i - 1] as Intl.DateTimeFormatPart;

            if (cur.type === 'literal' && prev.type === 'literal') {
                return [
                    ...acc,
                    {
                        type: 'literal',
                        value: prev.value + cur.value
                    }
                ];
            }

            return [...acc, cur];
        }, [] as Intl.DateTimeFormatPart[]);

        return result;
    }

    formatRange(startDate: number | bigint | Date, endDate: number | bigint | Date): string {
        // @ts-ignore
        return `${this.format(startDate)} - ${this.format(endDate)}`;
    }

    formatRangeToParts(startDate: number | bigint | Date, endDate: number | bigint | Date): Intl.DateTimeFormatPart[] {
        // @ts-ignore
        const start = this.formatToParts(startDate);
        // @ts-ignore
        const end = this.formatToParts(endDate);
        let result: Intl.DateTimeFormatPart[] = [];

        result = [...start.map(e => ({ ...e, source: 'startRange' }))];
        result = [...result, { type: 'literal', value: ' - ', source: 'shared' } as Intl.DateTimeFormatPart ];
        result = [...result, ...end.map(e => ({ ...e, source: 'endRange' }))];

        return result;
    }

    resolvedOptions(): Intl.ResolvedDateTimeFormatOptions {
        return {
            locale: this.#locale,
            numberingSystem: this.#numberingSystem,
            timeZone: this.#timeZone,
            timeZoneName: this.#timeZoneName,
            calendar: this.#calendar,
            era: this.#era,
            year: this.#year,
            month: this.#month,
            weekday: this.#weekday,
            day: this.#day,
            hour: this.#hour,
            minute: this.#minute,
            second: this.#second,
            hour12: this.#hour12
        };
    }

    get [Symbol.toStringTag]() {
        return '[object Intl]';
    }
}

const formatCharType: { [key: string]: Intl.DateTimeFormatPartTypes } = {
    'G': 'era',
    'Y': 'year',
    'y': 'year',
    'M': 'month',
    'E': 'weekday',
    'd': 'day',
    'H': 'hour',
    'h': 'hour',
    'm': 'minute',
    's': 'second',
    'a': 'dayPeriod',
    'O': 'timeZoneName',
    ' ': 'literal',
    ':': 'literal',
    '/': 'literal',
    '.': 'literal',
    ',': 'literal'
};

export default DateTimeFormat;
