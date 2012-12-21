var db = 'http://localhost:5984/foobar';
var init = require('../')(db);
var request = require('request');
var assert = require('assert');
var nock = require('nock');

nock('http://localhost:5984')
  .put('/foobar')
  .reply(201, "{\"ok\":true}\n");

nock('http://localhost:5984')
  .put('/foobar/_design/posts', "{\"language\":\"javascript\",\"views\":{\"all\":{\"map\":\"function(doc) {\\n  if (doc.docType === 'post') {\\n    emit(doc._id, doc);\\n  }\\n}\"},\"author\":{\"map\":\"function(doc) {\\n  if (doc.docType === 'post') {\\n    emit(doc.author, doc);\\n  }\\n}\"}}}")
  .reply(201, "{\"ok\":true,\"id\":\"_design/posts\",\"rev\":\"1-fc417395eea8ac50773aaa8b1289de40\"}\n");

nock('http://localhost:5984')
  .get('/foobar')
  .reply(200, "{\"db_name\":\"foobar\",\"doc_count\":1,\"doc_del_count\":0,\"update_seq\":1,\"purge_seq\":0,\"compact_running\":false,\"disk_size\":460,\"data_size\":381,\"instance_start_time\":\"1356037350163229\",\"disk_format_version\":6,\"committed_update_seq\":0}\n");

nock('http://localhost:5984')
  .get('/foobar/_design/posts/_view/all')
  .reply(200, "{\"total_rows\":0,\"offset\":0,\"rows\":[]}\n");

nock('http://localhost:5984')
  .get('/foobar/_design/posts/_view/author')
  .reply(200, "{\"total_rows\":0,\"offset\":0,\"rows\":[]}\n");

nock('http://localhost:5984')
  .delete('/foobar')
  .reply(200, "{\"ok\":true}\n");
    
describe('init db', function(){
  before(function(done){
    init.createDb(function(){
      init.createView('post', ['author'], done);
    });
  });
  it('should create db', function(done){
    request(db, {json: true}, function(e,r,b){
      assert.ok(b.db_name === 'foobar', 'foobar');
      done();
    });
  });
  it('should have posts view with all method', function(done){
    request(db + '/_design/posts/_view/all', {json: true}, function(e,r,b) {
      assert.ok(b.total_rows === 0);
      done();
    });
  });
  it('should have posts view with author method', function(done){
    request(db + '/_design/posts/_view/author', {json: true}, function(e,r,b) {
      assert.ok(b.total_rows === 0);
      done();
    });
  });
  after(function(done){
    init.destroyDb(done);
  });
});