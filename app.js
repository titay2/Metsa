const myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'login.html',
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
        .when('/productlist', {
            templateUrl: 'pages/productList.html',
            controller: 'productController'
        })
        .when('/location', {
            templateUrl: 'pages/location.html',
            controller: 'locationController'
        })
});

//SERVICES

myApp.service('cityService', function() {

    this.loc = "New York, NY";

});




myApp.controller('locationController', ['$scope', 'cityService', function($scope, cityService) {
    $scope.loc = cityService.loc;

    $scope.$watch('loc', function() {
        cityService.loc = $scope.loc;
    });
   $scope.city={
       shops: [
           {name: 'sello prisma', depth: "80"},

           {name: 'sello Kmarket', depth: "80"}
    ]
}
$scope.remove = function (index) {
       $scope.city.shops.splice(index, 1)
}
$scope.add = function () {
    $scope.shops.push = $scope.city
    console.log($scope.city.shops)
}
}]);


myApp.controller('productController', ['$scope', '$routeParams', 'cityService', function($scope, $routeParams, cityService) {
    $scope.city = cityService.city;

}]);
