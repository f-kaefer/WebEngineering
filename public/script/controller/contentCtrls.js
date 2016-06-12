var contentCtrls = angular.module('contentCtrls', []);

contentCtrls.controller('dashboardCtrl', ['$scope', 'ThreadService', function ($scope, ThreadService) {//jscs:ignore
  var allCategories = function () {
    ThreadService.getAllCategories().then(function (data) {
      $scope.allCategories = data;
    });
  };

  $scope.newCategory = function () {
    ThreadService.postNewCategory({
      author: this.author,
      email: this.email,
      title: this.title,
      content: this.content,
    });
    allCategories();
  };

  $scope.updateCategory = function (category) {
    ThreadService.updateCategory(category._id, category);
  };

  $scope.editCategory = null;
  
  $scope.setEditCategory = function (category) {
    $scope.editCategory = category;
    $('#title').value = category.title;
  };

  $scope.categoryModal = function () {
    if (editCategory === null) {
      $scope.newCategory();
    } else {
      updateCategory(editCategory);
    }
  };
  allCategories();

},
]);

contentCtrls.controller('categoryCtrl', ['$scope', 'ThreadService', function ($scope, ThreadService) {//jscs:ignore
  var allThreads = function () {
    ThreadService.getAllThreads().then(function (data) {
      var threads = [];
      for (var thread in data) {
        if (data.hasOwnProperty(thread)) {
          if (data[thread].categoryId === $scope.current.categoryId) {
            threads.push(data[thread]);
          }
        }
      }

      $scope.categoryThreads = threads;
    });
  };

  $scope.newThread = function () {
    ThreadService.postNewThread({
      author: this.author,
      email: this.email,
      title: this.title,
      content: this.content,
      categoryId: $scope.current.categoryId,
    });
    allThreads();
  };

  $scope.updateThread = function (thread) {
    ThreadService.updateThread(thread._id, thread);
  };

  allThreads();
},
]);

contentCtrls.controller('threadCtrl', ['$scope', 'ThreadService', function ($scope, ThreadService) {
  var allComments = function () {
    ThreadService.getAllComments().then(function (data) {
      var comments = [];
      for (var comment in data) {
        if (data.hasOwnProperty(comment)) {
          if (data[comment].threadId === $scope.current.threadId) {
            comments.push(data[comment]);
          }
        }
      }

      $scope.threadComments = comments;
    });
  };

  $scope.newComment = function () {
    ThreadService.postNewComment({
      author: this.author,
      threadId: $scope.current.threadId,
      content: this.content,
    });
    allComments();
  };

  $scope.updateComment = function (comment) {
    ThreadService.updateComment(comment._id, comment);
  };

  allComments();
},
]);
