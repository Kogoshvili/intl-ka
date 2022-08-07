# intl-ka
V8 doesn't support Georgian localization this package adds this support.

## How to setup
Add
import 'intl-ka';
somewhere at the start of you application e.g. index.js/ts

## Example
```javascript
var date = new Intl.DateTimeFormat('ka', {
    milisecond: 'short', era: 'long', month: 'short',
    day: '2-digit', year: 'numeric', minute: 'numeric',
    second: 'numeric', weekday: 'short', hour12: false, hour: '2-digit'
});
date.format(new Date(null));
```
ხუთ 01 იან 1970 ჩვენი წელთაღრიცხვით 04:0:0

```javascript
Intl.DateTimeFormat.supportedLocalesOf(['en', 'ka', 'asd']);
```
['en', 'ka']
