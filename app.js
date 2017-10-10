const myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap'])
const market = JSON.parse(localStorage.getItem('market') || '[]' )
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


    $scope.markets = market;




}]);

myApp.controller("secondController", ['$scope', '$modal', '$log',
    function ($scope, $modal, $log) {
        var _scannerIsRunning = false;
        function startScanner() {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#scanner-container'),
                    constraints: {
                        width: 480,
                        height: 320,
                        facingMode: "environment"
                    },
                },
                decoder: {
                    readers: [
                        "ean_reader"

                    ],
                    debug: {
                        showCanvas: true,
                        showPatches: true,
                        showFoundPatches: true,
                        showSkeleton: true,
                        showLabels: true,
                        showPatchLabels: true,
                        showRemainingPatchLabels: true,
                        boxFromPatches: {
                            showTransformed: true,
                            showTransformedBox: true,
                            showBB: true
                        }
                    }
                },

            }, function (err) {
                if (err) {
                    console.log(err);
                    return
                }

                console.log("Initialization finished. Ready to start");
                Quagga.start();

                // Set flag to is running
                _scannerIsRunning = true;
            });
            Quagga.onProcessed(function (result) {
                var drawingCtx = Quagga.canvas.ctx.overlay,
                    drawingCanvas = Quagga.canvas.dom.overlay;

                if (result) {
                    if (result.boxes) {
                        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                        result.boxes.filter(function (box) {
                            return box !== result.box;
                        }).forEach(function (box) {
                            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                        });
                    }

                    if (result.box) {
                        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                    }

                    if (result.codeResult && result.codeResult.code) {
                        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                    }
                }
            });


            Quagga.onDetected(function (result) {

                $.getJSON("content.json", function(json) {
                    console.log(json.resort); // this will show the info it in firebug console
                    for (var i = 0; i < json.resort.length; i++) {
                        var eanvalue = json.resort[i].id
                        console.log(eanvalue);
                        if (result.codeResult.code === eanvalue) {
                            codes = document.querySelector('#codes')
                            codes.innerHTML = result.codeResult.code
                            console.log("Barcode detected and processed : [" + result.codeResult.code + "]");


                        }else {
                            console.log("not found")
                        }

                    }
                })





                //let codes;
                //let codde = "6415711800544"
               // if (result.codeResult.code === codde) {
                   // codes = document.querySelector('#codes')
                   // codes.innerHTML = result.codeResult.code
                 //   console.log("Barcode detected and processed : [" + result.codeResult.code + "]");


               // }


                //$scope.eanValue =  result.codeResult.code

            });

        }


        // Start/stop scanner
        document.getElementById("btn").addEventListener("click", function () {
            if (_scannerIsRunning) {
                Quagga.stop();

            } else {
                startScanner();
            }
        }, false);




    }]);


myApp.controller('productController', ['$scope', '$routeParams', 'cityService', function($scope, $routeParams, cityService) {
    $scope.city = cityService.city;

}]);
