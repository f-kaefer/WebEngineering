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
  ThreadService.getAllComments().then(function (data) {
    $scope.allComments = data;
  });
}]);
