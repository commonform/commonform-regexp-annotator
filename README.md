The module exports a single function that takes an array of `RegExp` and a function for generating annotations and returns an annotator function to apply to Common Forms.

Include capture groups and flags in your `RegExp` as needed to match and generate annotation messages.

```javascript
var expressions = [
  new RegExp('\\b(apple(s?))\\b', 'gi'),
  /\b(thereof)\b/ ]
```

The annotation function receives the form in which a `RegExp` was found, its path within the overall form, the `RegExp` that matches, and the match data from `RegeExp.prototype.exec`. It must return a [Common Form Annotations](https://npmjs.com/packages/commonform-annotation).

```javascript
function message(form, path, expression, match) {
  var word = match[1]
  return {
    message: (
      ( match[1].indexOf('apple') > -1 ) ?
        ( '"' + word + '" is fruity' ) :
        ( '"' + word + '" is archaic' ) ),
    path: path,
    source: 'example-annotator',
    url: null } }

var reAnnotator = require('commonform-regexp-annotator')

var annotator = reAnnotator(expressions, message)
```

The library does the job of finding matches and calculating paths.

```javascript
var assert = require('assert')

assert.deepEqual(
  annotator({ content: [ 'Drop them apples and the apple stem thereof!' ] }),
  [ { message: '"apples" is fruity',
      path: [ 'content', 0 ],
      source: 'example-annotator',
      url: null },
    { message: '"apple" is fruity',
      path: [ 'content', 0 ],
      source: 'example-annotator',
      url: null },
    { message: '"thereof" is archaic',
      path: [ 'content', 0 ],
      source: 'example-annotator',
      url: null } ])
```
