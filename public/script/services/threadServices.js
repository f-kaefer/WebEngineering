var threadServices = angular.module('threadServices', []);
threadServices.factory('ThreadService', ['$http', function ($http) {
  var threadService = {};

  var serviceVariable = 'myThreadService';
  threadService.getString = function () {
    return threadService.serviceVariable;
  };

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
  

  return threadService;
}]);
