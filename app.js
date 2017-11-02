const myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap'])
const market = JSON.parse(localStorage.getItem('market') || '[]' )
const product = JSON.parse(localStorage.getItem('product') || '[]' )
const form = document.querySelector('#addForm')
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
        .when('/realloD', {
        templateUrl: 'pages/reallo.html',
        controller: 'realloController'
    })
});

//SERVICES

myApp.service('cityService', function() {

    this.loc = "New York, NY";

});

//CONTROLLERS

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
            depth : shops.depth,
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
                        Quagga.stop();

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


myApp.controller('dataController', ['$scope', '$routeParams', function($scope, $routeParams) {
    let table = document.querySelector('#product-table')

    let toti = _.where(product, {category: "ToTi"});
    $scope.totis = toti
    console.log(toti)




    toti.forEach(function (atoti) {
        console.log("atoto" + atoti )
        let row = document.createElement('tr')
        row.dataset.id = atoti.eanCode
        row.innerHTML = `
    <td>
      ${atoti.pName}
    </t>
    <td>
      ${atoti.eanCode}
    </td>
    <td>
        <input >
    </td>
    <br>
    <td class="actions">
        <button data-action="update">update</button>
      </td>
      `

        table.appendChild(row)
    })
    table.addEventListener('click', function (event) {

        event.preventDefault()
        let updateButton = event.target
        let row = updateButton.closest('tr')
        let id = row.dataset.id
        let action = updateButton.dataset.action

        if (action === 'update'){
            let input = row.querySelectorAll('input')
            let face = input[0].value


            product.forEach(function (aProduct) {
                if (aProduct.eanCode === id){
                    aProduct.pface =face

                }
            })

            localStorage.setItem('product', JSON.stringify(product))
            console.log(product)



        }

    })



}])
myApp.controller('realloController', ['$scope',  function($scope) {
    const bw = 1024;
    const bh = 600;
    const mT = 44
    const sca =35
    const pl = 13
    const m = 8

    const wc = 60
    const talo = 26
    const nenä = 15

    const nenaWidth = (nenä/(wc+talo+nenä))*100
    const taloWidth = (talo/(wc+talo+nenä))*100
    const wcWidth = (wc/(wc+talo+nenä))*100

    console.log(nenaWidth)

    const partNena = bw*nenaWidth/100
    const partTalo = bw*taloWidth/100
    const partWc = bw*wcWidth/100

    console.log(partWc)
    console.log(partTalo)
    console.log(partNena)

    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    canvas.width  = bw + 1;
    canvas.height = bh + 1;


    const moduleN = 5
    const shelveN = 3

    function drawBoard(){
        for (let x = 0; x <= bw; x += bw/moduleN) {
            context.moveTo(0.5 + x , 0);
            context.lineTo(0.5 + x , bh);
        }


        for (let x = 0; x <= bh; x += bh/shelveN) {
            context.moveTo(0, 0.5 + x );
            context.lineTo(bw , 0.5 + x);
        }

        context.strokeStyle = "black";
        context.stroke();
    }
    drawBoard();



    canvas.addEventListener('click', function (event) {

        const rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        console.log("x: " + x + " y: " + y);

    })

    context.moveTo(partNena, 0);
    context.lineTo(partNena, bh);
    //context.lineWidth = 15;
    context.stroke();


    context.fillStyle = "#FF0000";
    context.fillRect(0, 0, 150, 100);
    context.fillStyle = "#FFf000";
    context.fillRect(150, 0, 150, 100);

}])

myApp.controller('productController', ['$scope', '$routeParams', 'cityService', function($scope, $routeParams, cityService) {
    $scope.city = cityService.city;

}]);
