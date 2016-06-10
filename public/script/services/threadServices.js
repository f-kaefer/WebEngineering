var threadServices = angular.module('threadServices', []);

threadServices.factory('ThreadService', ['$http', function ($http) {
  var threadService = {};
//category
  threadService.getAllCategorys = function () {
    return $http.get('/categorylist').then(function successCallback(response) {
      return response.data;
    },function errorCallback(response){
      return null;
    });
  };

  threadService.getCategory = function (categoryId) {
    return $http.get('/category/' + categoryId).then(function successCallback(response) {
      return response.data[0];
    },function errorCallback(response){
      return null;
    });
  };

  threadService.postNewCategory = function (data) {
    $http.post('/category', data);
  };

  threadService.deleteCategory = function (categoryId) {
    return $http.delete('/category/' + categoryId);
  };

  threadService.updateCategory = function (categoryId, data) {
    $http.put('/category/' + categoryId, data);
  };


//threads
  threadService.getAllThreads = function () {
    return $http.get('/threadlist').then(function successCallback(response) {
      return response.data;
    },function errorCallback(response){
      return null;
    });
  };

  threadService.getThread = function (threadId) {
    return $http.get('/thread/' + threadId).then(function successCallback(response) {
      return response.data[0];
    },function errorCallback(response){
      return null;
    });
  };
  
  threadService.postNewThread = function (data) {
    $http.post('/thread', data);
  };

  threadService.deleteThread = function (threadId) {
    return $http.delete('/thread/' + threadId);
  };

  threadService.updateThread = function (threadId, data) {
    $http.put('/thread/' + threadId, data);
  };
//comments
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

  threadService.updateComment = function (commentId, data) {
    $http.put('/comment/' + commentId, data);
  };

  return threadService;
}]);
