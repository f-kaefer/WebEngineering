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
      .state('category', {
        url: '/category/{categoryId:[^/]*}',
        controller: function($stateParams){
          $stateParams.categoryId
        },
        views: {
          content: {
            templateUrl: '/script/partials/category.html',
            controller:  'categoryCtrl',
          },
        },
      })
    .state('thread', {
      url: '/category/{categoryId:[^/]*}/thread/{threadId:[^/]*}',
      controller: function($stateParams){
        $stateParams.categoryId
        $stateParams.threadId
      },
      views: {
        content: {
          templateUrl: '/script/partials/thread.html',
          controller:  'threadCtrl',
        },
      },
    });
})
.controller('appCtrl', ['$scope', '$location', 'ThreadService', '$stateParams', function($scope, $location, ThreadService, $stateParams) {

  $scope.$on('$stateChangeSuccess', function () {
    var threadTest = /\/thread\/.+/i;
    var categoryTest = /\/category\/.+/i;
    
    var url = $location.path();
    if (url == '/dashboard') {
      $scope.current = { 'state': 'dashboard'};
    } else if (categoryTest.test(url)) {
      ThreadService.getCategory($stateParams.categoryId).then(function (category) {
        $scope.current = {
          'state': 'category',
          'categoryId': $stateParams.categoryId,
          'category': category
        };
      });
      if(threadTest.test(url)) {
        ThreadService.getThread($stateParams.threadId).then(function(thread) {
          $scope.current = {
            'state': 'thread',
            'categoryId': $stateParams.categoryId,
            'category': $scope.current.category,
            'threadId': $stateParams.threadId,
            'thread': thread
          };
        });
      }
    } else {
      console.log("not a valid state, how did you get here?");
      $location.url("/dashboard")
    }
  });
}]);