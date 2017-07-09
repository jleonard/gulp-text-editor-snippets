# Gulp Text Editor Snippets

> Generates Atom and Sublime Text snippets from a common format

## How it works

Create a text file with the following structure:

**tab** the text + Tab that will envoke your snippet in the edtior  
**description** optional human readable description of your snippet  
**scope** the source files your snippet will apply to (ex:.text.html,.source.js). See [Scope Descriptors](http://flight-manual.atom.io/behind-atom/sections/scoped-settings-scopes-and-scope-descriptors/#scope-selectors) in the Atom docs.
**---** deliniator before your snippet content  

**Example**
```html
tab=_experiment
description=Experiment
scope=.text.html
---
<h1>Hello World</h1>
  <p>Thumbs up!</p>
```

## The Gulp Task

**dest** - the destination folder for your snippets

```js
var gulp = require('gulp');
var snippets = require('gulp-text-editor-snippets');

gulp.task('default', function() {
  return gulp.src('./src/**/*.snippet').pipe(snippets({dest:'./tools'}));
});
```