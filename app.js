const myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap'])
const market = JSON.parse(localStorage.getItem('market') || '[]' )
const product = JSON.parse(localStorage.getItem('product') || '[]' )

myApp.config(function ($routeProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'login.html',
            controller: 'mainController'
        })

        .when('/second', {
            templateUrl: 'pages/dataTable.html',
            controller: 'dataController'
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

//CONTROLLERS

myApp.controller('locationController', ['$scope', '$modal', '$log','cityService',, function($scope,$log,$modal,cityService) {
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

myApp.controller("secondController", ['$scope', '$modal', '$log','$compile',
    function ($scope, $modal, $log, $compile) {
        $scope.categories = ["ToTi", "HoTo", "Hanks"]
        $scope.producers = ["MT", "SCA", "Horizon tissue" ]
        $scope.newProduct = function (item) {
            product.push ({
                pName: item.pName,
                eanCode : item.eanCode,
                category : item. category,
                producer : item.producer,
                pLenght : item.pLenght,
                pHeight : item.pHeight,
                pWidth : item.pWidth,
                pface : 0
            })

            localStorage.setItem('product', JSON.stringify(product))
            console.log(product)
            $scope.showTheForm = false;
        }
        $scope.products = product;


        let _scannerIsRunning = false;
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
                let drawingCtx = Quagga.canvas.ctx.overlay,
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
                let code = document.querySelector('#code')
                let $table = document.querySelector('#list-table')

                code.innerHTML = result.codeResult.code

                product.forEach(function (aProduct) {
                    if (aProduct.eanCode === result.codeResult.code) {

                        console.log(aProduct.eanCode + '  and  '+ result.codeResult.code)
                        pname = document.querySelector('#pname')
                        pname.innerHTML = aProduct.pName
                        let row = document.createElement('tr')
                        row.dataset.id = aProduct.eanCode
                        row.innerHTML=`
`



                        row.innerHTML = `
    <td>
      ${aProduct.pName}
    </t>
    <td>
      ${aProduct.eanCode}
    </td>
    <td>
        <input >
    </td>
    <br>
    <td class="actions">
        <button data-action="update">update</button>
      </td>
   
  `
                        $table.appendChild(row)
                        console.log($("#pname").text().length)

                    }
                    if ($("#pname").text().length > 5) {
                            Quagga.stop();
                            console.log($("#pname").text())
                        }else{
                        pname.innerHTML =  `<button ng-click="" >new </button>
`
                    }
                })

                pname.addEventListener('click', function (event) {
                    console.log('test')
                    $scope.showTheForm = true;
                })

                $table.addEventListener('click', function (event) {
                    event.preventDefault()
                    let updateButton = event.target
                    let row = updateButton.closest('tr')
                    let id = row.dataset.id
                    let action = updateButton.dataset.action

                    if (action === 'update'){



                        let input = row.querySelectorAll('input')
                        let face = input[0].value
                        console.log(face)
                        product.forEach(function (aProduct) {
                            if (aProduct.eanCode === id){
                                aProduct.pface =face
                            }
                        })
                        localStorage.setItem('product', JSON.stringify(product))
                        console.log(product)
                        location.reload()

                    }

                })

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
myApp.controller('dataController', ['$scope', '$routeParams', function($scope, $routeParams) {
    let toti = []

    toti = product.filter(function (aproduct) {

        return aproduct.category === "ToTi"

    })


    $scope.totis = toti

}]);
