import { isKa } from './utils';
import DateTimeFormat from './DateTimeFormat';

const _supportedLocalesOf = (function(_super) {
    return function(this: Intl.DateTimeFormat, locales: string | string[], options?: Intl.DateTimeFormatOptions) {
        return _super.apply(this, [locales, options]);
    };
})(Intl.DateTimeFormat.supportedLocalesOf);

const _DateTimeFormat = (function(_super) {
    return function(this: Intl.DateTimeFormat, locales?: string | string[], options?: Intl.DateTimeFormatOptions) {
        if (isKa(locales)) return new DateTimeFormat(locales, options) as Intl.DateTimeFormat;

        return _super.apply(this, [locales, options]);
    };
})(Intl.DateTimeFormat);

const _toLocaleString = (function(_super) {
    return function(this: Date, locales?: string | string[], options?: Intl.DateTimeFormatOptions) {
        if (isKa(locales)) return (new Intl.DateTimeFormat(locales, options)).format(this);

        return _super.apply(this, [locales, options]);
    };
})(Date.prototype.toLocaleString);

// @ts-ignore
Intl.DateTimeFormat = _DateTimeFormat;
Intl.DateTimeFormat.supportedLocalesOf = _supportedLocalesOf;

// @ts-ignore
Date.prototype.toLocaleString = _toLocaleString;
