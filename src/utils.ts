import { TimeZoneName, Undefinable } from './models';

export function isKa(locale: string | string[] | undefined): string | undefined {
    if (locale === 'ka' || locale?.includes('ka')) {
        return 'ka';
    }

    if (locale === 'ka-GE' || locale?.includes('ka-GE')) {
        return 'ka-GE';
    }

    return;
}

export function getLongTimezone(): Record<Exclude<TimeZoneName, undefined>, Undefinable<string>> {
    const result: Record<Exclude<TimeZoneName, undefined>, Undefinable<string>> = {
        long: undefined,
        short: undefined,
        shortOffset: undefined,
        longOffset: undefined,
        shortGeneric: undefined,
        longGeneric: undefined
    };

    for (const key in result) {
        // node doesn't support all timezone name formats
        try {
            const DTI = new Intl.DateTimeFormat('en-GB', { timeZoneName: key as TimeZoneName, day: '2-digit', month: '2-digit', year: '2-digit'});
            const date = DTI.format(new Date());
            const regex = new RegExp(/(\d){2}\/(\d){2}\/(\d){2}, /i);
            result[key as Exclude<TimeZoneName, undefined>] = date.replace(regex, '');
        } catch {}
    };

    return result;
}
