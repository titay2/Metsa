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

    // datas to be fatched from the JSON
    const bw = 1024;
    const bh = 600;


    const nenaMt = 6
    const nenasca =4
    const nenaR = 3
    const nenaOthers = 2


    const taloMt = 10
    const taloSca =7
    const taloR = 5
    const taloOthers = 4

    const wcMt = 35
    const wcSca =10
    const wcR = 10
    const wcOthers = 5


    const nenä = nenaMt + nenasca+ nenaR+ nenaOthers
    const talo = taloMt + taloSca+ taloR+ taloOthers
    const wc = wcMt + wcSca+ wcR+ wcOthers

// percentage of each product

    const nenaWidth = (nenä/(wc+talo+nenä))*100
    const taloWidth = (talo/(wc+talo+nenä))*100
    const wcWidth = (wc/(wc+talo+nenä))*100

    const nenaPercent = parseFloat(Math.round(nenaWidth * 100) / 100).toFixed(2);
    const taloPercent = parseFloat(Math.round(taloWidth * 100) / 100).toFixed(2);
    const wcPercent = parseFloat(Math.round(wcWidth * 100) / 100).toFixed(2);
    console.log(nenaWidth)

// percentage of products on the canvas width

    const partNena = bw*nenaWidth/100
    const partTalo = bw*taloWidth/100
    const partWc = bw*wcWidth/100

    console.log(partWc)
    console.log(partTalo)
    console.log(partNena)

    const canvas = document.getElementById('myCanvas');
    const canvas1 = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const context1 = canvas1.getContext('2d');
    canvas.width  = bw + 1;
    canvas.height = bh + 1;
    //
    canvas1.width  = bw + 1;
    canvas1.height = 30;


    const moduleN = 10
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

// get the coordinates of a click on the canvase
    canvas.addEventListener('click', function (event) {

        const rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        console.log("x: " + x + " y: " + y);

    })

// draw the partition for Nenäliinat
    context.beginPath()
    context.moveTo(partNena, 0);
    context.lineTo(partNena, bh);
    context.lineWidth = 10;
    context.stroke();

    context1.beginPath()
    context1.font = "15px Arial";
    context1.fillText("Nenäliinat: " + nenaPercent + "%",0,20);
    context1.moveTo(partNena, 0)
    context1.lineTo(partNena, 30);
    context1.lineWidth = 10;
    context1.stroke();

// draw the partition for talouspaperit
    const taloPart = partNena + partTalo
    context.beginPath()
    context.moveTo( taloPart, 0);
    context.lineTo(taloPart, bh);
    context.lineWidth = 10;
    context.stroke();

    context1.beginPath()
    context1.font = "15px Arial";
    context1.fillText("Talouspaperit: " + taloPercent + "%",partNena + 10,20);
    context1.moveTo(taloPart, 0)
    context1.lineTo(taloPart, 30);
    context1.lineWidth = 10;
    context1.stroke();
// draw the partition for WC_paperit
    const wcPart = taloPart + partWc
    context.beginPath()
    context.moveTo( wcPart, 0);
    context.lineTo(wcPart, bh);
    context.lineWidth = 10;
    context.stroke();

    context1.beginPath()
    context1.font = "15px Arial";
    context1.fillText("WC_paperit: " + wcPercent + "%",taloPart + 10,20);
    context1.moveTo(wcPart, 0)
    context1.lineTo(wcPart, 30);
    context1.lineWidth = 10;
    context1.stroke();



 // calculate the percentage of each producer for Nenäliinat

    const nmt = (nenaMt/(nenä))*100
    const nmtPercent = parseFloat(Math.round(nmt * 100) / 100).toFixed(2);
    const nsca = (nenasca/(nenä))*100
    const nscaPercent = parseFloat(Math.round(nsca * 100) / 100).toFixed(2);

    const nroy = (nenaR/(nenä))*100
    const nroyPercent = parseFloat(Math.round(nroy * 100) / 100).toFixed(2);

    const nothers = (nenaOthers/(nenä))*100
    const nothersPercent = parseFloat(Math.round(nothers * 100) / 100).toFixed(2);


    const nMtHeight =( bh * nmt)/100
    const nScaHeight =( bh * nsca)/100
    const nRoyHeight =( bh * nroy)/100
    const nOthersHeight =( bh * nothers)/100


// Draw the reallo diagram colors for nenäliinat MT
    context.font = "20px Arial";
    context.fillText( nmtPercent + "%" ,0,nMtHeight);
    context.fillStyle = "#13b4ff";
    context.globalAlpha = 0.5;
    context.fillRect(0,0,partNena,nMtHeight);

// Draw the reallo diagram colors for  nenäliinat SCA
    context.font = "20px Arial";
    context.fillText( nscaPercent + "%" ,0,nScaHeight +nMtHeight);
    context.fillStyle = "#ab3fdd";
    context.globalAlpha = 0.5;
    context.fillRect(0,nMtHeight,partNena,nScaHeight);


// Draw the reallo diagram colors for nenäliinat Roy
    context.font = "20px Arial";
    context.fillText( nroyPercent + "%" ,0,nScaHeight + nMtHeight + nRoyHeight);
    context.fillStyle = "#ae163e";
    context.globalAlpha = 0.5;
    context.fillRect(0,nScaHeight + nMtHeight ,partNena,nRoyHeight);


// Draw the reallo diagram colors for nenäliinat Othres
    context.font = "20px Arial";
    context.fillText( nothersPercent + "%" ,0, bh);
    context.fillStyle = "#ffff00";
    context.globalAlpha = 0.5;
    context.fillRect(0,nScaHeight + nMtHeight + nRoyHeight,partNena,nOthersHeight);


// calculate the percentage of each producer for Talospaperit


    const tmt = (taloMt/(talo))*100
    const tmtPercent = parseFloat(Math.round(tmt * 100) / 100).toFixed(2);

    const tsca = (taloSca/(talo))*100
    const tscaPercent = parseFloat(Math.round(tsca * 100) / 100).toFixed(2);

    const troy = (taloR/(talo))*100
    const troyPercent = parseFloat(Math.round(troy * 100) / 100).toFixed(2);

    const tothers = (taloOthers/(talo))*100
    const tothersPercent = parseFloat(Math.round(tothers * 100) / 100).toFixed(2);


    const tMtHeight =( bh * tmt)/100
    const tScaHeight =( bh * tsca)/100
    const tRoyHeight =( bh * troy)/100
    const tOthersHeight =( bh * tothers)/100




// Draw the reallo diagram colors for Talospaperit MT
    context.font = "20px Arial";
    context.fillText( tmtPercent + "%" ,partNena,tMtHeight);
    context.fillStyle = "#13b4ff";
    context.globalAlpha = 0.5;
    context.fillRect(partNena,0,partTalo,tMtHeight);

// Draw the reallo diagram colors for  Talospaperit SCA
    context.font = "20px Arial";
    context.fillText( tscaPercent + "%" ,partNena,tScaHeight +tMtHeight);
    context.fillStyle = "#ab3fdd";
    context.globalAlpha = 0.5;
    context.fillRect(partNena,tMtHeight,partTalo,tScaHeight);


// Draw the reallo diagram colors for Talospaperit Roy
    context.font = "20px Arial";
    context.fillText( troyPercent + "%" ,partNena,tScaHeight + tMtHeight + tRoyHeight);
    context.fillStyle = "#ae163e";
    context.globalAlpha = 0.5;
    context.fillRect(partNena,tScaHeight + tMtHeight ,partTalo,tRoyHeight);


// Draw the reallo diagram colors for Talospaperit Othres
    context.font = "20px Arial";
    context.fillText( tothersPercent + "%" ,partNena, bh);
    context.fillStyle = "#ffff00";
    context.globalAlpha = 0.5;
    context.fillRect(partNena,tScaHeight + tMtHeight + tRoyHeight,partTalo,tOthersHeight);

// calculate the percentage of each producer for Talospaperit




    const wcmt = (wcMt/(wc))*100
    const wcmtPercent = parseFloat(Math.round(wcmt * 100) / 100).toFixed(2);

    const wcsca = (wcSca/(wc))*100
    const wcscaPercent = parseFloat(Math.round(wcsca * 100) / 100).toFixed(2);

    const wcroy = (wcR/(wc))*100
    const wcroyPercent = parseFloat(Math.round(wcroy * 100) / 100).toFixed(2);

    const wcothers = (wcOthers/(wc))*100
    const wcothersPercent = parseFloat(Math.round(wcothers * 100) / 100).toFixed(2);


    const wcMtHeight =( bh * wcmt)/100
    const wcScaHeight =( bh * wcsca)/100
    const wcRoyHeight =( bh * wcroy)/100
    const wcOthersHeight =( bh * wcothers)/100


const startPoint = partTalo + partNena

// Draw the reallo diagram colors for Talospaperit MT
    context.font = "20px Arial";
    context.fillText( wcmtPercent + "%" ,startPoint ,wcMtHeight);
    context.fillStyle = "#13b4ff";
    context.globalAlpha = 0.5;
    context.fillRect(startPoint ,0,wcPart,wcMtHeight);

// Draw the reallo diagram colors for  Talospaperit SCA
    context.font = "20px Arial";
    context.fillText( wcscaPercent + "%" ,startPoint ,wcScaHeight +wcMtHeight);
    context.fillStyle = "#ab3fdd";
    context.globalAlpha = 0.5;
    context.fillRect(startPoint,wcMtHeight,wcPart,wcScaHeight);


// Draw the reallo diagram colors for Talospaperit Roy
    context.font = "20px Arial";
    context.fillText( wcroyPercent + "%" ,startPoint,wcScaHeight + wcMtHeight + wcRoyHeight);
    context.fillStyle = "#ae163e";
    context.globalAlpha = 0.5;
    context.fillRect(startPoint,wcScaHeight + wcMtHeight ,wcPart,wcRoyHeight);


// Draw the reallo diagram colors for Talospaperit Othres
    context.font = "20px Arial";
    context.fillText( wcothersPercent + "%" ,startPoint, bh);
    context.fillStyle = "#ffff00";
    context.globalAlpha = 0.5;
    context.fillRect(startPoint,wcScaHeight + wcMtHeight + wcRoyHeight,wcPart,wcOthersHeight);



}])

myApp.controller('productController', ['$scope', '$routeParams', 'cityService', function($scope, $routeParams, cityService) {
    $scope.city = cityService.city;

}]);
