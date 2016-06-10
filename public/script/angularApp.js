var app = angular.module('forumApp', ['footerCtrls', 'contentCtrls', 'threadServices', 'ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/dashboard');

  //
  // Now set up the states

  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      views: {
        content: {
          templateUrl: '/script/partials/dashboard.html',
          controller:  'dashboardCtrl',
        },
      },
    })
    .state('thread', {
      url: '/thread/:threadId',
      views: {
        content: {
          templateUrl: '/script/partials/thread.html',
          controller:  'threadCtrl',
        },
      },
    });
});

app.controller('appCtrl', ['$scope', '$location', 'ThreadService', function($scope, $location, ThreadService) {

  $scope.$on('$stateChangeSuccess', function () {
    var threadTest = /\/thread\/.+/i;
    
    var url = $location.path();
    if (url == '/dashboard') {
      $scope.current = { 'state': 'dashboard'};
    } else if (threadTest.test(url)) {
      var threadId = url.slice(8);
      var thread = ThreadService.getThread(threadId);
      console.log(thread);
      console.log(thread.$$state);
      console.log(thread.$$state.value);
      $scope.current = { 'state': 'thread',
        'threadId': threadId
      };
      $scope.current.thread = ThreadService.getThread(threadId);
    } else {
      console.log("not a valid state, how did you get here?");
    }
  });
}]);