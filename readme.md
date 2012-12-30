# couch-init [![Build Status](https://travis-ci.org/twilson63/couch-init.png?branch=master)](https://travis-ci.org/twilson63/couch-init)

Couch-Init is a nifty way to specify your couchdb database and
views.  CI adds some api methods to simplify your setup and tear down db process.  

## Install

```
npm install couch-init
```

## Usage:

Create a db.js file and create your module

```
//db.js

var async = require('async');

module.exports = function(dbUrl) {
  var init = require('couch-init')(dbUrl);

  return {
    build: function(cb) {
      var fn = async.apply;
      async.series([
        fn(init.createDb),
        fn(createViews, 'post', ['author', 'title']),
        fn(addView, 'post', 'author-title', function(doc){
          if (doc.docType === 'post') {
            emit(doc.author + ':' + doc.title.split(' ').join('-'));
          }
        }),
        fn(createViews, 'user', ['email'])
      ], cb);
    },
    drop: init.destroyDb;
  }
}
```

## API

### `createDb([callback])`

### `destroyDb([callback])`

createDb and destroyDb are pretty self explanatory, each function takes an optional callback and creates and destroys
a couchDb database respectively.


### `createViews(model, fields, callback)

`createView` takes a single model name and an array of key
columns with a callback to create a view for a document type.

The design doc name is the plural version of the model name and it creates a basic view called `all` that filters on the `docType` key equal to the model name.

then any key listed in the array of fields, CI creates a view for each one.  For example:

```
init.createViews('post', ['author','slug','posted'], function(err, res) {
  console.log('created design document called posts');
  console.log('it has four views');
  console.log('all, author, slug, posted');
});
```
Each view basically defines which field will be emitted
as the key of a key value result.

### `addView(model, view, fn, callback)`

Adds a view for a specified model to the design document 
for that model.

```
init.addView('post', 'author-title', 
  function(doc) {
    if (doc.docType === 'post') {
      emit(doc.author + ':' + doc.title, doc);
    }
  }, 
  function(err) {
    console.log('add view called author:title');
    console.log('to posts design doc');
  }
);
```

## LICENSE

MIT

## Contributions

pull requests are welcome.

## TODO

### `destroyViews(model, callback)`

Removes the specified design doc based on the plural version
of the model name.

```
init.detroyViews('post', function(err) { 
  console.log('removes design document posts');
});
```

### `removeView(model, view, callback)`

Removes the specified view from the design doc of the model.

```
init.removeView('post', 'author-title', function(err) {
  console.log('removed view author-title from posts doc');
});
```
