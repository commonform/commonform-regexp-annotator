var predicate = require('commonform-predicate')
var name = require('./package').name

function rule(expressions, annotator, form, path)
{ return form.content
    .reduce(
      function(annotations, element, index) {
        if (predicate.text(element)) {
          var elementPath = path.concat([ 'content', index ])
          expressions
            .forEach(function(expression) {
              var match = expression.exec(element)
              if (match !== null) {
                annotations.push(
                  message(form, elementPath, expression, match)) } }) }
        return annotations },
      [ ]) }

function recurse(expressions, annotator, form, path, annotations )
{ return annotations
    .concat(rule(expressions, annotator, form, path))
    .concat(
      form.content
        .reduce(
          function(annotations, element, index) {
            if (predicate.child(element)) {
              var childForm = element.form
              var childPath = path.concat([ 'content', index, 'form' ])
              return annotations.concat(
                recurse(
                  expressions, annotator,
                  childForm, childPath, [ ])) }
            else {
              return annotations } },
          [ ])) }

function commonformRegExpAnnotator(expressions, annotator)
{ return function(form) {
    return recurse(expressions, annotator, form, [ ], [ ]) } }

module.exports = commonformRegExpAnnotator
