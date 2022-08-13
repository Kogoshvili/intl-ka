export type Undefinable<T> = T | undefined;

export type Calendar = 'buddhist' | 'chinese' | 'coptic' |'dangi'
    | 'ethioaa' | 'ethiopic' | 'gregory' | 'hebrew'
    | 'indian' | 'islamic' | 'islamic-umalqura' | 'islamic-tbla'
    | 'islamic-civil' | 'islamic-rgsa' | 'iso8601' | 'japanese'
    | 'persian' | 'roc' | 'islamicc';

export type NumberingSystem = 'arab' | 'arabext' | 'bali' | 'beng'
    | 'deva' | 'fullwide' | ' gujr' | 'guru'
    | 'hanidec' | 'khmr' | ' knda' | 'laoo'
    | 'latn' | 'limb' | 'mlym' | 'mong'
    | 'mymr' | 'orya' | 'tamldec' | 'telu'
    | 'thai' | 'tibt';

export type FormatMatcher = 'best fit' | 'basic' | undefined;
export type LocaleMatcher = 'best fit' | 'lookup' | undefined;

//  Georgia Standard Time, GMT+4, GMT+4, GMT+04:00', Georgia Time, Georgia Standard Time;
export type TimeZoneName = 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric' | undefined;

export type Era = 'long' | 'short' | 'narrow' | undefined;
export type Year = 'numeric' | '2-digit' | undefined;
export type Month = 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined;
export type Weekday = 'long' | 'short' | 'narrow' | undefined;
export type Day = 'numeric' | '2-digit' | undefined;
export type DayPeriod = 'long' | 'short' | 'narrow' | undefined;
export type Hour = 'numeric' | '2-digit' | undefined;
export type Minute = 'numeric' | '2-digit' | undefined;
export type Second = 'numeric' | '2-digit' | undefined;
export type FractionalSecondDigits = 0 | 1 | 2 | 3 | undefined;
export type HourCycle = 'h11' | 'h12' | 'h23' | 'h24' | undefined;

export type DateStyle = 'full' | 'long' | 'medium' | 'short' | undefined;
export type TimeStyle = 'full' | 'long' | 'medium' | 'short' | undefined;

