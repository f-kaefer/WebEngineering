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

/**
 * Category Schema
 * @constructor
 * @param {string} title - the name of the category
 * @param {date} dateCreated - date when the category was created
 * @param {number} threads - amount of threads the category contains
 */

var categorySchema = mongoose.Schema({
  title: { type: String, required: true },
  dateCreated: Date,
  threads: { default: 0, type: Number, required: false },
});

/**
 * Thread Schema
 * @constructor
 * @param {string} title - the name of the category
 * @param {string} author - the name of the author of the thread
 * @param {string} email - (OPTIONAL) the email address of the author
 * @param {string} categoryId - the ID of the category the thread has been created in
 * @param {string} content - the content of the thread
 * @param {date} dateCreated - the date when the thread has been created
 * @param {number} comments - the amount of comments which has been created in this thread
 */

var threadSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  email: { type: String, required: false },
  categoryId: { type: String, required: true },
  content: { type: String, required: true },
  dateCreated: Date,
  comments: { default: 0, type: Number, required: false },
});

/**
 * Comments Schema
 * @constructor
 * @param {string} author - the name of the author of the comment
 * @param {string} email - (OPTIONAL) the email address of the author
 * @param {string} content - the content of the thread
 * @param {string} thread - the ID of the thread the thread has been created in
 * @param {date} dateCreated - the date when the thread has been created
 */

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

/**
 * app
 * @constructor
 */
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/***************
 ****REST-API***
 ***************/

//jscs:disable
/**
 * post category to create a new category
 * @function post newCategory
 * @memberof app
 * @return {JSON} JSON with statusCode, statusMessage, category object
 */

//jscs:enable

//Category
//post newCategory
app.post('/category', function (req, res) {
  var newCategory = new Category({
    title: req.body.title,
    categoryId: req.body.categoryId,
    dateCreated: Date.now(),
    comments: req.body.comments,
  });

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

//jscs:disable
/**
 * put update a category
 * @function put updateCategory
 * @memberof app
 * @param {string} id - id of the category which should be updated
 * @return {JSON} JSON object with the updated category object
 */

//jscs:enable

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

//jscs:disable
/**
 * get all categories from the database
 * @function get allCategories
 * @memberof app
 * @return {JSON} JSON object with statusCode, statusMessage and the all category objects
 */

//jscs:enable

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

//jscs:disable
/**
 * get specific category from the database
 * @function get specificCategory
 * @memberof app
 * @param {string} id - id of the category which should be found
 * @return {JSON} JSON object with statusCode, statusMessage and the category object
 */

//jscs:enable

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

//jscs:disable
/**
 * delete specific category
 * @function delete specificCategory
 * @memberof app
 * @param {string} id - id of the category which should be deleted
 * @return {JSON} JSON object with statusMessage
 */

//jscs:enable

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

//jscs:disable
/**
 * post newThread to create a new thread in a category
 * @function post /thread
 * @memberof app
 * @return {JSON} JSON with statusCode, statusMessage, category object
 */

//jscs:enable

//post newThread
app.post('/thread', function (req, res) {
  var newThread = new Thread({
    title: req.body.title,
    content: req.body.content,
    email: req.body.email,
    categoryId: req.body.categoryId,
    author: req.body.author,
    dateCreated: Date.now(),
    comments: req.body.comments,
  });

  var update = {};
  var response = {};

  //Save object to database, error or success
  newThread.save(function (err, newThread) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {

      //jscs: disable
      /*to display how many threads in a specific thread are an increment is added to the function
      so each time a thread is created the counter of the corresponding category increments by one*/

      //jscs:enable

      Category.find({ _id: req.body.categoryId }, function (err, category) {
        if (err) {
          console.log(err);
          response.error = err;
          response.statusCode = 500;
          response.status = 'err';
          res.json(response);
        } else {
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

//jscs:disable
/**
 * update a thread with new content
 * @function put updateThread
 * @memberof app
 * @param {string} id - id of the thread which should be updated
 * @return {JSON} JSON object with the updated thread object
 */

//jscs:enable

//update Thread
app.put('/thread/:id', function (req, res) {
  return Thread.findById(req.params.id, function (err, thread) {
    thread.title = req.body.title;
    thread.content = req.body.content;
    thread.email = req.body.email;
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

//jscs:disable
/**
 * get all threads
 * @function get allThreads
 * @memberof app
 * @return {JSON} JSON object with statusCode, statusMessage and the all thread objects
 */

//jscs:enable

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

//jscs:disable
/**
 * get specific thrad
 * @function get specificThread
 * @memberof app
 * @param {string} id - id of the thread which should be found
 * @return {JSON} JSON object with statusCode, statusMessage and the category object
 */

//jscs:enable

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

//jscs:disable
/**
 * delete a specific thread
 * @function delete specificThread
 * @memberof app
 * @param {string} id - id of the thread which should be deleted
 * @return {JSON} JSON object with statusMessage
 */

//jscs:enable

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

//jscs:disable
/**
 * get all comments
 * @function get allComments
 * @memberof app
 * @return {JSON} JSON object with statusCode, statusMessage and the all category objects
 */

//GET allComments
app.get('/commentlist', function (req, res) {
  Comment.find({}, function (err, databaseResponseComments) {
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {
      res.statusCode = 200;
      console.log('Successfully sent all data');
      res.json(databaseResponseComments);
    }
  });
});

//jscs:disable
/**
 * get specific comment
 * @function get specificComment
 * @memberof app
 * @return {JSON} JSON object with statusCode, statusMessage and the all category objects
 */

//(jscs:enable

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

//jscs:disable
/**
 * update a comment with new content
 * @function put updateComment
 * @memberof app
 * @param {string} id - id of the comment which should be updated
 * @return {JSON} JSON object with the updated thread object
 */

//jscs:enable

//update comment
app.put('/comment/:id', function (req, res) {
  return Comment.findById(req.params.id, function (err, comment) {
    comment.content = req.body.content;
    comment.email = req.body.email;
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

//jscs:disable
/**
 * post newComment to create a new comment in a thread
 * @function post comment
 * @memberof app
 * @return {JSON} JSON with statusCode, statusMessage, category object
 */

//jscs:enable

//post newComment
app.post('/comment', function (req, res) {
  var newComment = new Comment({
    author: req.body.author,
    email: req.body.email,
    threadId: req.body.threadId,
    content: req.body.content,
    dateCreated: Date.now(),
  });

  var response = {};
  var update = {};

  newComment.save(function (err, newComment) {
    var response = {};
    if (err) {
      res.statusCode = 500;
      console.log(err);
      res.send('err');
    }else {

      //jscs:disable
      /*implemented a funtion which increments the number of comments in a thread
        so each time a comment is created the counter of the corresponding thread increments by one */

      //jscs:enable

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

//jscs:disable
/**
 * delete a specific comment
 * @function delete specificComment
 * @memberof app
 * @param {string} id - id of the comment which should be deleted
 * @return {JSON} JSON object with statusMessage
 */

//jscs:enable

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

//404 error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//listener
app.listen(6001, function () {
  console.log('server started on port 6001');
});

module.exports = app;
