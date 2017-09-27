const myApp = angular.module('myApp', ['ngRoute']);
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




myApp.controller('locationController', ['$scope', 'cityService', function($scope, cityService) {
    $scope.loc = cityService.loc;

    $scope.$watch('loc', function() {
        cityService.loc = $scope.loc;
    });


//market.forEach(function (mark) {
  // console.log("test")
    //const ink = document.createElement('a')
   //ink.innerHTML= `
  // <div class="button_base b05_3d_roll" data-shelvdept="90">
    //  <div>${mark.name||'-'}</div>
      //<div>${mark.name ||'-' }</div>
  // </div>

//`
    //local.appendChild(ink)
//})

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
    $scope.markets = market

}]);


myApp.controller('productController', ['$scope', '$routeParams', 'cityService', function($scope, $routeParams, cityService) {
    $scope.city = cityService.city;

}]);
