var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/local');
var db = mongoose.connection;
mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server.');
});

mongoose.connection.on('error', function (err) {
  console.log('Could not connect to mongo server!');
  console.log(err);
});

var threadSchema = mongoose.Schema({
  title: String,
  author: String,// jscs:ignore 
  content: String,
  dateCreated: { default: Date.now(), type: Date },
  comments: Number,
});

var commentSchema = mongoose.Schema({
  author: String,
  content: String,
  threadId: String,
  dateCreated: { default: Date.now(), type: Date },
});

var Thread = mongoose.model('Thread', threadSchema);
var Comment = mongoose.model('Comment', commentSchema);

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/***************
 ****REST-API***
 ***************/

//Thread

//post newThread
app.post('/thread', function (req, res) {
  var newThread = new Thread({
    title: req.body.title,
    content: req.body.content,
  });
  console.log('TRIED TO POST DATA');

  //Save object to database, error or success
  newThread.save(function (err, newThread) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {
      res.statusCode = 200;
      console.log('Added ' + newThread + ' to Database');
      res.send('success');
    }
  });
});

//update Thread
/*app.put('/api/products/:id', function (req, res){
  return Thread.findById(req.params.id, function (err, thread) {
    product.title = req.body.title;
    product.description = req.body.description;
    product.style = req.body.style;
    return product.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(thread);
    });
  });
});
*/

//getAllThreads
app.get('/allThreads', function (req, res) {
  Thread.find({}, function (err, threads) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {
      res.statusCode = 200;
      console.log('Successfully send all data');
      res.json(threads);
    }
  });
});

//GET specificThread
app.get('/thread/:id', function (req, res) {
  Thread.find({ _id: req.params.id }, function (err, thread) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {
      res.statusCode = 200;
      console.log('Successfully send specific thread');
      res.json(thread);
    }
  });
});

//Comments

//GET allComments
app.get('/allComments', function (req, res) {
  Comment.find({}, function (err, databaseResponseComments) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {
      res.statusCode = 200;
      console.log('Successfully send all data');
      res.json(databaseResponseComments);
    }
  });
});

//GET specificComment
app.get('/comment/:id', function (req, res) {
  Comment.find({ _id: req.params.id }, function (err, databaseResponseComment) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {
      res.statusCode = 200;
      console.log('Successfully send specific comment');
      res.json(databaseResponseComment);
    }
  });
});

//post newComment
app.post('/comment', function (req, res) {
  var newComment = new Comment({
    author: req.body.author,
    threadId: req.body.threadId,
    content: req.body.content,
  });

  //Save object to database, error or success
  newComment.save(function (err, newComment) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {
      res.statusCode = 200;
      console.log('Added ' + newComment + ' to Database');
      res.send('success');
    }
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(8080, function () {
  console.log('server started on port 8080');
});

module.exports = app;
