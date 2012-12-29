# couch-init [![Build Status](https://travis-ci.org/twilson63/couch-init.png?branch=master)](https://travis-ci.org/twilson63/couch-init)

Couch-Init is a nifty way to specify your couchdb database and
views.  CI adds some api methods to simplify your setup and tear down db process.  

createDb and destroyDb are pretty self explainatory, each function takes an optional callback


## API

### `createDb([callback])`

### `destroyDb([callback])`

### `createView(model, fields, callback)

```
init.createView('post', ['author'], function(){
  console.log('view created');
});
```

## 

