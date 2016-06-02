var footerCtrls = angular.module('footerCtrls', []);

footerCtrls.controller('footerCtrl', ['$scope', 'ThreadService', function($scope, ThreadService) {

  $scope.newThread = function(){
    ThreadService.postNewThread({
      'title': 'Hilfe Katze kaputt',
      'author':	'Hans Peter',
      'id': 		'1',
      'content':	'liegt nur noch rum, was kann ich tun?',
      'date':		'01.05.2016',
      'comments':	'1'
    });
  }

}]);