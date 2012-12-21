// Initialize Db with views.
// create database if it does not exist
var assert = require('assert');
var request = require('request');
var inflection = require('inflection');


module.exports = function(db) {
  return {
    createDb: function(cb) {
      request.put(db, { json: true }, function(e,r,b) { 
        if (e) { console.log(e); }
        if(b.ok) { cb(); }
      });
    },
    createView: function(name, keys, cb) {
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
          map: "function(doc) {\n  if (doc.docType === '" + name + "') {\n    emit(doc." + key + ", doc);\n  }\n}"
        }
      });

      request.put([db, '_design', view].join('/'), { json: doc}, function(e,r,b){
        assert.ok(b.ok, 'cant create view ' + view);
        cb();
      });      
    },
    destroyDb: function(cb) {
      request.del(db, { json: true }, function(e,r,b){
        assert.ok(b.ok, 'cant destroy db');
        cb();
      });
    }
  }
}
