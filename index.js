// Initialize Db with views.
// create database if it does not exist
var assert = require('assert');
var request = require('request');
var inflection = require('inflection');


module.exports = function(db) {
  return {
    createDb: function(cb) {
      request.put(db, { json: true }, function(e,r,b) { 
        if (cb) {
          if (e) { console.log(e); return cb(e, false); }
          if (b.ok) { cb(null, true); }
        }
      });
    },
    createViews: function(name, keys, cb) {
      var view = inflection.pluralize(name);
      var doc = {
        language: 'javascript',
        views: {
          all: {
            map: "function(doc) {\n  if (doc.docType === '" + name + "') {\n    emit(doc._id, doc);\n  }\n}"
          }
        }
      }

      keys.forEach(function(key){
        doc.views[key] = {
          map: "function(doc) {\n  if (doc.docType === '" + name + "' && doc['" + key + "']) {\n    emit(doc." + key + ", doc);\n  }\n}"
        }
      });

      request.put([db, '_design', view].join('/'), { json: doc}, function(e,r,b){
        if (e) { if (cb) { cb(e, false); }; return; }
        //assert.ok(b.ok, 'cant create views ' + view);
        if (cb) { cb(null, true); }
      });      
    },
    addView: function(model, view, fn, cb) {
      var design = inflection.pluralize(model);
      request([db, '_design', design].join('/'), {json: true}, function(e,r,b) {
        b.views[view] = { map: fn.toString() };
        request.put([db, '_design', design].join('/'), {json: b }, function(e,r,b) {
          if (e) { return cb(e, false); }
          cb(null, true);
        });
      });
    },
    destroyDb: function(cb) {
      request.del(db, { json: true }, function(e,r,b){
        if (e) { return cb(e, false); }
        //assert.ok(b.ok, 'cant destroy db');
        cb(null, true);
      });
    }
  }
}
