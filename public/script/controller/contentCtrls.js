var contentCtrls = angular.module('contentCtrls', []);

contentCtrls.controller('dashboardCtrl', ['$scope', 'ThreadService', function($scope, ThreadService) {
  
  var allThreads = function(){
    ThreadService.getAllThreads().then(function (data) {
      $scope.allThreads = data;
    });
  }

  $scope.newThread = function() {
    ThreadService.postNewThread ({
      'author': this.author,
      'title': this.title,
      'content': this.content
    });
    allThreads();
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

  allComments();
}]);
