var footerCtrls = angular.module('footerCtrls', []);

footerCtrls.controller('footerCtrl', ['$scope', 'ThreadService', '$location', function($scope, ThreadService, $location) {

  $scope.btnEvent = function() {
    url = $location.path();
    if (url === '/dashboard') {
      ThreadService.postNewThread({
        'title': 'Hilfe Katze kaputt',
        'author': 'Hans Peter',
        'content': 'liegt nur noch rum, was kann ich tun?',
      });
    } else if (/\/thread\/.+/i.test(url)) {
      threadId = url.slice(8);
      console.log(threadId);
    } else {
      console.log('unknown state');
    }
  }

  /*app.controller("SprocketCtrl",
      [ '$scope', '$http', '$stateParams',
        function($scope, $http, $stateParams){
          // Make an AJAX call, retrieving the state.
          $scope.sprocketInfo =
              $http.get("/api/sprocket/" + $stateParams.id)
                  .then(function(res){ return res.data; });
        }]);*/

}]);