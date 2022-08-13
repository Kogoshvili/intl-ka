# intl-ka
V8 doesn't support Georgian localization this package adds this support to Intl.DateTimeFormat and Date.toLocaleString.

## How to setup
Add
`import 'intl-ka';`
somewhere at the beginning of you application e.g. `index.{js|ts}`

## Examples
```javascript
var date = new Intl.DateTimeFormat('ka', {
    milisecond: 'short', era: 'long', month: 'short',
    day: '2-digit', year: 'numeric', minute: 'numeric',
    second: 'numeric', weekday: 'short', hour12: false, hour: '2-digit'
});
date.format(new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738)));
```
ხუთ 01 იან 1970 ჩვენი წელთაღრიცხვით 04:0:0

```javascript
const date = new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738));
date.toLocaleString('ka-GE', { day: '2-digit', month: 'long', year: 'numeric' });

```
20 დეკემბერი 2020

```javascript
Intl.DateTimeFormat.supportedLocalesOf(['en', 'ka', 'ka-GE', 'de-DE', 'asd']);
```
['en', 'ka', 'ka-GE', 'de-DE']
