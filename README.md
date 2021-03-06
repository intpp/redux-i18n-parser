## redux-i18n-parser

Utility for parsing translations for [react-native](https://github.com/AlexanderZaytsev/react-native-i18n) and [react-redux-i18n](https://github.com/zoover/react-redux-i18n).

Utility parses snippets like:
```javascript
<Translation value="HERE.YOUR.TRANSLATION.TOKEN"/>
```

OR

```javascript
I18n.t('HERE.YOUR.TRANSLATION.TOKEN')
```

### Instalation

```
yarn add redux-i18n-parser
```

### Usage

``node ./node_modules/.bin/i18n-parser --config={PATH_TO_CONFIG}``

### Configuration

Simple config for *redux-i18n-parser*, ``i18n.json``
```javascript
{
  "languages": [
    "ru",
    "en"
  ],
  "sourceDir": "../src",
  "outputDir": "../src/i18n"
}
```

``languages`` - List of supported languages, utility will be parse & merge with existing translations

``sourceDir`` - Relative path to your source code

``outputDir`` - Relative path to your translations

### Etc

In ``package.json``
```javascript
// ...
"scripts": {
  // ...
  "i18n": "i18n-parser --config=./config/i18n.json"
  // ...
},
// ...
```