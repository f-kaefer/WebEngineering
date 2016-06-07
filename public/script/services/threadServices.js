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
  

  return threadService;
}]);
