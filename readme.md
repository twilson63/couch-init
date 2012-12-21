# couch-init

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

