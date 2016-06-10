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

var categorySchema = mongoose.Schema({
  title: String,
  content: String,
  dateCreated: { default: Date.now(), type: Date },
  threads: { default: 0, type: Number },
});

var threadSchema = mongoose.Schema({
  title: String,
  author: String,// jscs:ignore
  categoryId: String,
  content: String,
  dateCreated: { default: Date.now(), type: Date },
  comments: { default: 0, type: Number },
});

var commentSchema = mongoose.Schema({
  author: String,
  content: String,
  threadId: String,
  dateCreated: { default: Date.now(), type: Date },
});

var Category = mongoose.model('Category', categorySchema);
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

//Category

//post newCategory
app.post('/category', function (req, res) {
  var newCategory = new Category({
    title: req.body.title,
    categoryId: req.body.threadId,
    date: Date.now(),
    comments: req.body.comments,
  });
  console.log('TRIED TO POST DATA');

  //Save object to database, error or success
  newCategory.save(function (err, newCategory) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {
      res.statusCode = 200;
      console.log('Added ' + newCategory + ' to Database');
      res.send('success');
    }
  });
});

//update Category
app.put('/category/:id', function (req, res) {
  return Category.findById(req.params.id, function (err, category) {
    category.title = req.body.title;
    category.content = req.body.content;
    category.date = Date.now();
    category.comments = req.body.comments;
    return category.save(function (err) {
      if (!err) {
        console.log('Category has been updated');
      } else {
        console.log(err);
      }

      return res.send(category);
    });
  });
});

//getAllCategories
app.get('/categorylist', function (req, res) {
  Category.find({}, function (err, category) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {
      res.statusCode = 200;
      console.log('Successfully send all data');
      res.json(category);
    }
  });
});

//GET specificCategory
app.get('/category/:id', function (req, res) {
  Category.find({ _id: req.params.id }, function (err, category) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {
      res.statusCode = 200;
      console.log('Successfully send specific category');
      res.json(category);
    }
  });
});

//delete category
app.delete('/category/:id', function (req, res) {
  Category.findOneAndRemove({ _id: req.params.id }, function (err)  {
    if (!err) {
      console.log('Category removed');
      return res.send('');
    } else {
      console.log(err);
    }
  });
});

//Thread

//post newThread
app.post('/thread', function (req, res) {
  var newThread = new Thread({
    title: req.body.title,
    content: req.body.content,
    categoryId: req.body.categoryId,
    author: req.body.author,
    date: Date.now(),
    comments: req.body.comments,
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
app.put('/thread/:id', function (req, res) {
  return Thread.findById(req.params.id, function (err, thread) {
    thread.title = req.body.title;
    thread.content = req.body.content;
    thread.date = Date.now();
    thread.comments = req.body.comments;
    return thread.save(function (err) {
      if (!err) {
        console.log('Thread has been updated');
      } else {
        console.log(err);
      }

      return res.send(thread);
    });
  });
});

//getAllThreads
app.get('/threadlist', function (req, res) {
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

//delete thread
app.delete('/thread/:id', function (req, res) {
  Thread.findOneAndRemove({ _id: req.params.id }, function (err)  {
    if (!err) {
      console.log('Thread removed');
      return res.send('');
    } else {
      console.log(err);
    }
  });
});

//Comments

//GET allComments
app.get('/commentlist', function (req, res) {
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

//update comment
app.put('/comment/:id', function (req, res) {
  return Comment.findById(req.params.id, function (err, comment) {
    comment.content = req.body.content;
    comment.date = Date.now();
    return comment.save(function (err) {
      if (!err) {
        console.log('Comment has been updated');
      } else {
        console.log(err);
      }

      return res.send(comment);
    });
  });
});

//post newComment
app.post('/comment', function (req, res) {
  var newComment = new Comment({
    author: req.body.author,
    threadId: req.body.threadId,
    content: req.body.content,
    date: Date.now(),
  });

  //Save object to database, error or success
  newComment.save(function (err, newComment) {
    var response = {};
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {
      res.statusCode = 200;
      console.log('Added ' + newComment + ' to Database');
      response.status = 'success';
      response.comment = newComment;
      res.json(response);
    }
  });
});

//delete comment
app.delete('/comment/:id', function (req, res) {
  Comment.findOneAndRemove({ _id: req.params.id }, function (err)  {
    if (!err) {
      console.log('Comment removed');
      return res.send('');
    } else {
      console.log(err);
    }
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(6001, function () {
  console.log('server started on port 6001');
});

module.exports = app;
