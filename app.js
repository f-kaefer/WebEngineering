var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://46.101.204.109:27017/GameBase');
var db = mongoose.connection;
mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server.');
});

mongoose.connection.on('error', function (err) {
  console.log('Could not connect to mongo server!');
  console.log(err);
});

var categorySchema = mongoose.Schema({
  title: { type: String, required: true },
  dateCreated: Date,
  threads: { default: 0, type: Number, required: false },
});

var threadSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },// jscs:ignore
  email: { type: String, required: false },
  categoryId: { type: String, required: true },
  content: { type: String, required: true },
  dateCreated: Date,
  comments: { default: 0, type: Number, required: false },
});

var commentSchema = mongoose.Schema({
  author: { type: String, required: true },
  email: { type: String, required: false },
  content: { type: String, required: true },
  threadId: { type: String, required: true },
  dateCreated: Date,
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
    categoryId: req.body.categoryId,
    dateCreated: Date.now(),
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
    category.dateCreated = Date.now();
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
    Thread.remove({ category_id: this._id }).exec();
    Comment.remove({ category_id: this._id }).exec();
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
    dateCreated: Date.now(),
    comments: req.body.comments,
  });
  console.log('TRIED TO POST DATA');

  var update = {};
  var response = {};

  //Save object to database, error or success
  newThread.save(function (err, newThread) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {

      Category.find({ _id: req.body.categoryId }, function (err, category) {
        if (err) {
          console.log(err);
          response.error = err;
          response.statusCode = 500;
          response.status = 'err';
          res.json(response);
        } else {
          /* if no error occurs we try to update the found thread*/
          console.log('all data from database received');
          response.statusCode = 200;
          if (category === null) {
            response.status = 'no category with id: ' + req.body.categoryId;
            response.category = category;
            res.json(response);
          } else {
            response.status = 'success';
            response.category = category;
            update.threads = category[0].threads + 1;
            Category.update({ _id: req.body.categoryId }, update, function (err, affected) {
              if (err) {
                console.log(err);
              } else {
                console.log('successfully updated category');
                response.affected = affected;
                res.json(response);
              }
            });
          }
        }
      });
    }
  });
});

//update Thread
app.put('/thread/:id', function (req, res) {
  return Thread.findById(req.params.id, function (err, thread) {
    thread.title = req.body.title;
    thread.content = req.body.content;
    thread.dateCreated = Date.now();
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

/*threadSchema.pre('remove', function (next) {
  Comment.remove({ thread_id: this._id }).exec();
  next();
});*/

//delete thread
app.delete('/thread/:id', function (req, res) {
  Thread.findOneAndRemove({ _id: req.params.id }, function (err)  {
    Comment.remove({ thread_id: this._id }).exec();
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
    comment.dateCreated = Date.now();
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
    dateCreated: Date.now(),
  });

  var response = {};
  var update = {};

  //Save object to database, error or success
  newComment.save(function (err, newComment) {
    var response = {};
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {

      Thread.find({ _id: req.body.threadId }, function (err, thread) {
        if (err) {
          console.log(err);
          response.error = err;
          response.statusCode = 500;
          response.status = 'err';
          res.json(response);
        } else {
          console.log('all data from database received');
          response.statusCode = 200;
          if (thread === null) {
            response.status = 'no thread with id: ' + req.body.threadId;
            response.thread = category;
            res.json(response);
          } else {
            response.status = 'success';
            response.thread = thread;
            update.comments = thread[0].comments + 1;
            Thread.update({ _id: req.body.threadId }, update, function (err, affected) {
              if (err) {
                console.log(err);
              } else {
                console.log('successfully updated thread');
                response.affected = affected;
                res.json(response);
              }
            });
          }
        }
      });
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
