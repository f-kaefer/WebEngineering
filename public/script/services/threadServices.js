var threadServices = angular.module('threadServices', []);

threadServices.factory('ThreadService', ['$http', function ($http) {
  var threadService = {};

  threadService.getAllThreads = function () {
    return $http.get('/threadlist').then(function successCallback(response) {
      return response.data;
    },function errorCallback(response){
      return null;
    });
  };

  threadService.getThread = function (threadId) {
    return $http.get('/thread/' + threadId).then(function successCallback(response) {
      console.log(response.data);
      return response.data;
    },function errorCallback(response){
      return null;
    });
  };
  
  threadService.postNewThread = function (data) {
    $http.post('/thread', data);
  };

  threadService.getAllComments = function () {
    return $http.get('/commentlist').then(function successCallback(response) {
      return response.data;
    },function errorCallback(response){
      return null;
    });
  };

  threadService.postNewComment = function (data) {
    $http.post('/comment', data);
  };

  threadService.deleteComment = function (commentId) {
    return $http.delete('/comment/' + commentId);
  };

  return threadService;
}]);
