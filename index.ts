import { format } from 'date-fns';
import { ka } from 'date-fns/locale';

const _supportedLocalesOf = (function(_super) {
    return function(this: Intl.DateTimeFormat, locales: string | string[], options?: Intl.DateTimeFormatOptions | undefined) {
        const result = _super.apply(this, [locales, options]);

        if (locales === 'ka' || locales?.includes('ka')) {
            return [...result, 'ka'];
        }

        return result;
    };
})(Intl.DateTimeFormat.supportedLocalesOf);

const _DateTimeFormat = (function(_super) {
    return function(this: Intl.DateTimeFormat, locales?: string | string[] | undefined, options?: Intl.DateTimeFormatOptions | undefined) {
        if (locales === 'ka') {
            return (new ExtendedDateTimeFormat(locales, options)) as unknown as Intl.DateTimeFormat;
        }

        return _super.apply(this, [locales, options]);
    };
})(Intl.DateTimeFormat);

const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
// @ts-ignore
Intl.DateTimeFormat = _DateTimeFormat;
Intl.DateTimeFormat.supportedLocalesOf = _supportedLocalesOf;

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

class ExtendedDateTimeFormat {
    #locale: string = resolvedOptions.locale;
    #formatMatcher: 'best fit' | 'basic' | undefined;
    #localeMatcher: 'best fit' | 'lookup' | undefined;
    #numberingSystem: string = resolvedOptions.numberingSystem;
    #timeZone: string = resolvedOptions.timeZone;
    #timeZoneName: 'short' | 'long' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric' | undefined;
    #calendar: string = resolvedOptions.calendar;
    #era: 'long' | 'short' | 'narrow' | undefined;
    #year: 'numeric' | '2-digit' | undefined = resolvedOptions.year as 'numeric' | '2-digit';
    #month: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined = resolvedOptions.month as 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    #weekday: 'long' | 'short' | 'narrow' | undefined;
    #day: 'numeric' | '2-digit' | undefined = resolvedOptions.day as 'numeric' | '2-digit';
    #hour: 'numeric' | '2-digit' | undefined;
    #minute: 'numeric' | '2-digit' | undefined;
    #second: 'numeric' | '2-digit' | undefined;
    #hour12: boolean | undefined = false;

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
        this.#era = options?.era;
        this.#year = options?.year;
        this.#month = options?.month;
        this.#weekday = options?.weekday;
        this.#day = options?.day;
        this.#hour = options?.hour;
        this.#minute = options?.minute;
        this.#second = options?.second;
        this.#hour12 = options?.hour12;
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
        let result;

        if (this.#era === 'short') {
            result = 'GG';
        } else if (this.#era === 'long') {
            result = 'GGGG';
        } else if (this.#era === 'narrow') {
            result = 'GGGGG';
        }

        return result;
    }

    #yearFormat(): string | undefined {
        let result;

        if (this.#year === 'numeric') {
            result = 'yyyy';
        } else if (this.#year === '2-digit') {
            result = 'yy';
        }

        return result;
    }

    #monthFormat(): string | undefined {
        let result;

        if (this.#month === 'numeric') {
            result = 'M';
        } else if (this.#month === '2-digit') {
            result = 'MM';
        } else if (this.#month === 'short') {
            result = 'MMM';
        } else if (this.#month === 'long') {
            result = 'MMMM';
        } else if (this.#month === 'narrow') {
            result = 'MMMMM';
        }

        return result;
    }

    #weekdayFormat(): string | undefined {
        let result;

        if (this.#weekday === 'short') {
            result = 'EE';
        } else if (this.#weekday === 'long') {
            result = 'EEEE';
        } else if (this.#weekday === 'narrow') {
            result = 'EEEEE';
        }

        return result;
    }

    #dayFormat(): string | undefined {
        let result;

        if (this.#day === 'numeric') {
            result = 'd';
        } else if (this.#day === '2-digit') {
            result = 'dd';
        }

        return result;
    }

    #hourFormat(): string | undefined {
        let result;

        if (this.#hour === 'numeric') {
            result = 'h';
        } else if (this.#hour === '2-digit') {
            result = 'hh';
        }

        if (result && !this.#hour12) {
            result = result.toUpperCase();
        }

        return result;
    }

    #minuteFormat(): string | undefined {
        let result;

        if (this.#minute === 'numeric') {
            result = 'm';
        } else if (this.#minute === '2-digit') {
            result = 'mm';
        }

        return result;
    }

    #secondFormat(): string | undefined {
        let result;

        if (this.#second === 'numeric') {
            result = 's';
        } else if (this.#second === '2-digit') {
            result = 'ss';
        }

        return result;
    }

    #timeFormat(): string {
        const hour = this.#hourFormat();
        const minute = this.#minuteFormat();
        const second = this.#secondFormat();
        let result = '';

        if (hour && !minute && second) {
            result = `${hour} (${second} წამი)`;
        } else {
            result = [hour, minute, second].filter(v => v !== undefined).join(':');
        }

        return result;
    }

    #dateFormat() {
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
        return [dateString, timeString, h12].filter(v => v !== undefined).join(' ').trim();
    }

    format(date?: number | Date | undefined): string {
        return format(this.#toDate(date), this.#finalFormat(), { locale: ka });
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
