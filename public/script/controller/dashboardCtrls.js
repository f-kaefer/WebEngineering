var dashboardCtrls = angular.module('dashboardCtrls', []);

dashboardCtrls.controller('contentCtrl', ['$scope', 'ThreadService', function($scope, ThreadService) {
  $scope.variables = {};
  $scope.variables.myTestVariable = ['Hello', 'World', 'How', 'Are', 'you'];

  $scope.testString = ThreadService.getString();
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
