var contentCtrls = angular.module('contentCtrls', []);

contentCtrls.controller('dashboardCtrl', ['$scope', 'ThreadService', function($scope, ThreadService) {
  
  var allCategories = function(){
    ThreadService.getAllCategories().then(function (data) {
      $scope.allCategories = data;
    });
  };

  $scope.newCategory = function() {
    ThreadService.postNewCategory ({
      'author': this.author,
      'email': this.email,
      'title': this.title,
      'content': this.content
    });
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

  $scope.newThread = function() {
    ThreadService.postNewThread ({
      'author': this.author,
      'email': this.email,
      'title': this.title,
      'content': this.content,
      'categoryId': $scope.current.categoryId
    });
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


  $scope.newComment = function() {
    ThreadService.postNewComment({
      'author': this.author,
      'threadId': $scope.current.threadId,
      'content': this.content
    });
    allComments();
  };
  
  $scope.updateComment = function() {
    console.log('To Be implemented')
  };

  allComments();
}]);
