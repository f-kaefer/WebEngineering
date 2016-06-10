var threadServices = angular.module('threadServices', []);

threadServices.factory('ThreadService', ['$http', function ($http) {
  var threadService = {};

  threadService.getAllThreads = function () {
    return $http.get('/allThreads').then(function successCallback(response) {
      return response.data;
    },function errorCallback(response){
      return null;
    });
  };

  threadService.getThread = function (threadId) {
    return $http.get('/thread/' + threadId).then(function successCallback(response) {
      console.log(response.data[0]);
      return response.data[0];
    },function errorCallback(response){
      return null;
    });
  };
  
  threadService.postNewThread = function (data) {
    $http.post('/thread', data);
  }

  threadService.getAllComments = function () {
    return $http.get('/allComments').then(function successCallback(response) {
      return response.data;
    },function errorCallback(response){
      return null;
    });
  };

  threadService.postNewComment = function (data) {
    $http.post('/comment', data);
  }

  return threadService;
}]);
