var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'pages/productList.html',
            controller: 'mainController'
        })

        .when('/second', {
            templateUrl: 'pages/forms.html',
            controller: 'secondController'
        })
        .when('/product1', {
            templateUrl: 'pages/forms.html',
            controller: 'secondController'
        })
});

myApp.controller('mainController', ['$scope', '$log', function($scope, $log) {


}]);

myApp.controller('secondController', ['$scope', '$log', function($scope, $log) {


}]);
