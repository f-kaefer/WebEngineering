var contentCtrls = angular.module('contentCtrls', []);

contentCtrls.controller('dashboardCtrl', ['$scope', 'ThreadService', function($scope, ThreadService) {
  
  var allCategories = function(){
    ThreadService.getAllCategories().then(function (data) {
      $scope.allCategories = data;
    });
  }

  $scope.newCategory = function() {
    ThreadService.postNewCategory ({
      'author': this.author,
      'title': this.title,
      'content': this.content
    });
    allCategories();
  };

  $scope.deleteCategory = function(categoryId) {
    ThreadService.deleteCategory(categoryId);
    allCategories();
  };

  $scope.updateCategory = function() {
    console.log('To Be implemented')
  };

  allCategories();
}]);

contentCtrls.controller('categoryCtrl', ['$scope', 'ThreadService', function($scope, ThreadService) {

  var allThreads = function() {
    ThreadService.getAllThreads().then(function (data) {
      var threads = [];
      for (thread in data) {
        console.log(data);
        if (data[thread].categoryId === $scope.current.categoryId) {
          threads.push(data[thread]);
        }
      }
      $scope.categoryThreads = threads;
    });
  };

  $scope.newThread = function() {
    ThreadService.postNewThread ({
      'author': this.author,
      'title': this.title,
      'content': this.content
    });
    allThreads();
  };

  $scope.deleteThread = function(threadId) {
    ThreadService.deleteThread(threadId);
    allThreads();
  };

  $scope.updateThread = function() {
    console.log('To Be implemented')
  };

  allThreads();
}]);

contentCtrls.controller('threadCtrl', ['$scope', 'ThreadService', function($scope, ThreadService) {
  var allComments = function() {
    ThreadService.getAllComments().then(function (data) {
      var comments = [];
      for (comment in data) {
        if (data[comment].threadId === $scope.current.threadId) {
          comments.push(data[comment]);
        }
      }
      $scope.threadComments = comments;
    });
  };


  $scope.newComment = function() {
    ThreadService.postNewComment({
      'author': this.author,
      'threadId': $scope.current.threadId,
      'content': this.content
    });
    allComments();
  };

  $scope.deleteComment = function(commentId) {
    ThreadService.deleteComment(commentId);
    allComments();
  };

  $scope.updateComment = function() {
    console.log('To Be implemented')
  };

  allComments();
}]);
