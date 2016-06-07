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
