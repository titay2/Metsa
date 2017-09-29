const myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);
let market = JSON.parse(localStorage.getItem('market') || '[]' );
const local = document.getElementById('local')

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




myApp.controller('locationController', ['$scope', '$modal', '$log','cityService', function($scope,$log,$modal,cityService) {
    $scope.loc = cityService.loc;

    $scope.$watch('loc', function() {
        cityService.loc = $scope.loc;
    });

    $scope.processForm = function(shops) {
        console.log(shops.name)
        market.push({
            chain:shops.chain,
            name : shops.name,
            address : shops.address,
            phone : shops.phone,
            contactP : shops.contactP,
            module: shops.module,
            depth : shops.depth
        })
        localStorage.setItem('market', JSON.stringify(market))
        console.log($scope.markets)
        $scope.showTheForm = false;
    }

$scope.add = function (shops) {

    market.push({
        chain:shops.chain,
        name : shops.name,
        address : shops.address,
        phone : shops.phone,
        contactP : shops.contactP,
        module: shops.module,
        depth : shops.depth
    })
    localStorage.setItem('market', JSON.stringify(market))
    console.log($scope.markets)

}
    $scope.markets = market;




}]);

myApp.controller("modalAccountFormController", ['$scope', '$modal', '$log',

    function ($scope, $modal, $log) {


    }]);


myApp.controller('productController', ['$scope', '$routeParams', 'cityService', function($scope, $routeParams, cityService) {
    $scope.city = cityService.city;

}]);
