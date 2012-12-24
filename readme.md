# couch-init [![Build Status](https://travis-ci.org/twilson63/couch-init.png?branch=master)](https://travis-ci.org/twilson63/couch-init)

A simple module that creates/destroys a couchDb and creates basic document views.

## API

### `createDb(callback)`

### `destroyDb(callback)`

### `createView(model, fields, callback)

```
init.createView('post', ['author'], function(){
  console.log('view created');
});
```

## 

