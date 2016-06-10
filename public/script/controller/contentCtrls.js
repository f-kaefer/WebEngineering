var contentCtrls = angular.module('contentCtrls', []);

contentCtrls.controller('dashboardCtrl', ['$scope', 'ThreadService', function($scope, ThreadService) {
  
  ThreadService.getAllThreads().then(function (data) {
    $scope.allThreads = data;
  });

  $scope.newThread = function(){
    ThreadService.postNewThread({
      'title': 'Hilfe Katze kaputt',
      'author':	'Hans Peter',
      'content':	'liegt nur noch rum, was kann ich tun?',
    });
  }
}]);

contentCtrls.controller('threadCtrl', ['$scope', 'ThreadService', function($scope, ThreadService) {
  $scope.newComment = function(){
    ThreadService.postNewComment({
      "author":   "Hans Dieter",
      "threadId": "57569ea52d7094ec2aa6e8c3",
      "content":  "Wasser drauf!"
    });
  }

  $scope.newComment();

  ThreadService.getAllComments().then(function (data) {
    var comments = [];
    for (comment in data) {
      if (comment.threadId === $scope.currentThread) {
        comments.add(comment);
      }
    }
    $scope.allComments = comments;
  });
}]);
