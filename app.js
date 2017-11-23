var feed = {pName: "metsa tissue", eanCode: 33358};

const product = JSON.parse(localStorage.getItem('product') || '[]' )
product.push(feed)


const myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap'])
const market = JSON.parse(localStorage.getItem('market') || '[]' )

const currentShop = JSON.parse(localStorage.getItem('currentShop') || '[]' )
const items = JSON.parse(localStorage.getItem('items') || '[]' )



myApp.config(function ($routeProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'pages/login.html',
            controller: 'mainController'
        })
        .when('/location', {
            templateUrl: 'pages/location.html',
            controller: 'locationController'
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

        .when('/finish', {
            templateUrl: 'pages/finish.html',
            controller: 'finishController'
        })
        .when('/realloD', {
        templateUrl: 'pages/reallo.html',
        controller: 'realloController'
        })
        .when('/piechart', {
        templateUrl: 'pages/piechart.html',
        controller: 'pieController'
        })
        .when('/empty', {
        templateUrl: 'pages/empty.html',
        controller: 'emptyController'
        })
        .when('/area', {
        templateUrl: 'pages/area.html',
        controller: 'areaController'
        })


});

//SERVICES

myApp.service('cityService', function() {

    this.loc = "New York, NY";

});

//CONTROLLERS

myApp.controller('mainController', [function() {

}]);

myApp.controller('locationController', ['$scope', function($scope) {

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

    const container = document.querySelector('#container')

}]);

myApp.directive('locform', [function () {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.bind('click', function(event) {
                console.log(scope.shops)
                localStorage.setItem('currentShop', JSON.stringify(scope.shops))

            });
        }
    };
}])

myApp.controller("secondController", ['$scope', '$modal', '$log','$compile',
    function ($scope, $modal, $log, $compile) {
        $scope.categories = ["ToTi", "HoTo", "Hanks"]
        $scope.producers = ["MT", "SCA", "R.OY", "Others" ]
        $scope.newProduct = function (item) {
            product.push ({
                pName: item.pName,
                eanCode : item.eanCode,
                category : item. category,
                producer : item.producer,
                pLenght : item.pLenght,
                pHeight : item.pHeight,
                pWidth : item.pWidth,
                pface : ""
            })

            localStorage.setItem('product', JSON.stringify(product))
            console.log(product)
            $scope.showTheForm = false;
        }
        $scope.products = product;



            var resultCollector = Quagga.ResultCollector.create({
                capture: true,
                capacity: 20,
                blacklist: [{
                    code: "WIWV8ETQZ1", format: "code_93"
                }, {
                    code: "EH3C-%GU23RK3", format: "code_93"
                }, {
                    code: "O308SIHQOXN5SA/PJ", format: "code_93"
                }, {
                    code: "DG7Q$TV8JQ/EN", format: "code_93"
                }, {
                    code: "VOFD1DB5A.1F6QU", format: "code_93"
                }, {
                    code: "4SO64P4X8 U4YUU1T-", format: "code_93"
                }],
                filter: function(codeResult) {
                    // only store results which match this constraint
                    // e.g.: codeResult
                    return true;
                }
            });
            var App = {
                init: function() {
                    var self = this;

                    Quagga.init(this.state, function(err) {
                        if (err) {
                            return self.handleError(err);
                        }
                        //Quagga.registerResultCollector(resultCollector);
                        App.attachListeners();
                        App.checkCapabilities();
                        Quagga.start();

                    });
                },
                handleError: function(err) {
                    console.log(err);
                },
                checkCapabilities: function() {
                    var track = Quagga.CameraAccess.getActiveTrack();
                    var capabilities = {};
                    if (typeof track.getCapabilities === 'function') {
                        capabilities = track.getCapabilities();
                    }
                    this.applySettingsVisibility('zoom', capabilities.zoom);
                    this.applySettingsVisibility('torch', capabilities.torch);
                },
                updateOptionsForMediaRange: function(node, range) {
                    console.log('updateOptionsForMediaRange', node, range);
                    var NUM_STEPS = 6;
                    var stepSize = (range.max - range.min) / NUM_STEPS;
                    var option;
                    var value;
                    while (node.firstChild) {
                        node.removeChild(node.firstChild);
                    }
                    for (var i = 0; i <= NUM_STEPS; i++) {
                        value = range.min + (stepSize * i);
                        option = document.createElement('option');
                        option.value = value;
                        option.innerHTML = value;
                        node.appendChild(option);
                    }
                },
                applySettingsVisibility: function(setting, capability) {
                    // depending on type of capability
                    if (typeof capability === 'boolean') {
                        var node = document.querySelector('input[name="settings_' + setting + '"]');
                        if (node) {
                            node.parentNode.style.display = capability ? 'block' : 'none';
                        }
                        return;
                    }
                    if (window.MediaSettingsRange && capability instanceof window.MediaSettingsRange) {
                        var node = document.querySelector('select[name="settings_' + setting + '"]');
                        if (node) {
                            this.updateOptionsForMediaRange(node, capability);
                            node.parentNode.style.display = 'block';
                        }
                        return;
                    }
                },
                initCameraSelection: function(){
                    var streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

                    return Quagga.CameraAccess.enumerateVideoDevices()
                        .then(function(devices) {
                            function pruneText(text) {
                                return text.length > 30 ? text.substr(0, 30) : text;
                            }
                            var $deviceSelection = document.getElementById("deviceSelection");
                            while ($deviceSelection.firstChild) {
                                $deviceSelection.removeChild($deviceSelection.firstChild);
                            }
                            devices.forEach(function(device) {
                                var $option = document.createElement("option");
                                $option.value = device.deviceId || device.id;
                                $option.appendChild(document.createTextNode(pruneText(device.label || device.deviceId || device.id)));
                                $option.selected = streamLabel === device.label;
                                $deviceSelection.appendChild($option);
                            });
                        });
                },
                attachListeners: function() {
                    var self = this;

                    self.initCameraSelection();
                    $(".controls").on("click", "button.stop", function(e) {
                        e.preventDefault();
                        Quagga.stop();
                    });

                    $(".controls .reader-config-group").on("change", "input, select", function(e) {
                        e.preventDefault();
                        var $target = $(e.target),
                            value = $target.attr("type") === "checkbox" ? $target.prop("checked") : $target.val(),
                            name = $target.attr("name"),
                            state = self._convertNameToState(name);

                        console.log("Value of "+ state + " changed to " + value);
                        self.setState(state, value);
                    });
                },
                _accessByPath: function(obj, path, val) {
                    var parts = path.split('.'),
                        depth = parts.length,
                        setter = (typeof val !== "undefined") ? true : false;

                    return parts.reduce(function(o, key, i) {
                        if (setter && (i + 1) === depth) {
                            if (typeof o[key] === "object" && typeof val === "object") {
                                Object.assign(o[key], val);
                            } else {
                                o[key] = val;
                            }
                        }
                        return key in o ? o[key] : {};
                    }, obj);
                },
                _convertNameToState: function(name) {
                    return name.replace("_", ".").split("-").reduce(function(result, value) {
                        return result + value.charAt(0).toUpperCase() + value.substring(1);
                    });
                },
                detachListeners: function() {
                    $(".controls").off("click", "button.stop");
                    $(".controls .reader-config-group").off("change", "input, select");
                },
                applySetting: function(setting, value) {
                    var track = Quagga.CameraAccess.getActiveTrack();
                    if (track && typeof track.getCapabilities === 'function') {
                        switch (setting) {
                            case 'zoom':
                                return track.applyConstraints({advanced: [{zoom: parseFloat(value)}]});
                            case 'torch':
                                return track.applyConstraints({advanced: [{torch: !!value}]});
                        }
                    }
                },
                setState: function(path, value) {
                    var self = this;

                    if (typeof self._accessByPath(self.inputMapper, path) === "function") {
                        value = self._accessByPath(self.inputMapper, path)(value);
                    }

                    if (path.startsWith('settings.')) {
                        var setting = path.substring(9);
                        return self.applySetting(setting, value);
                    }
                    self._accessByPath(self.state, path, value);

                    console.log(JSON.stringify(self.state));
                    App.detachListeners();
                    Quagga.stop();
                    App.init();
                },
                inputMapper: {
                    inputStream: {
                        constraints: function(value){
                            if (/^(\d+)x(\d+)$/.test(value)) {
                                var values = value.split('x');
                                return {
                                    width: {min: parseInt(values[0])},
                                    height: {min: parseInt(values[1])}
                                };
                            }
                            return {
                                deviceId: value
                            };
                        }
                    },
                    numOfWorkers: function(value) {
                        return parseInt(value);
                    },
                    decoder: {
                        readers: function(value) {
                            if (value === 'ean_extended') {
                                return [{
                                    format: "ean_reader",
                                    config: {
                                        supplements: [
                                            'ean_5_reader', 'ean_2_reader'
                                        ]
                                    }
                                }];
                            }
                            return [{
                                format: value + "_reader",
                                config: {}
                            }];
                        }
                    }
                },
                state: {
                    inputStream: {
                        type : "LiveStream",
                        constraints: {
                            width: {min: 640},
                            height: {min: 480},
                            facingMode: "environment",
                            aspectRatio: {min: 1, max: 2}
                        }
                    },
                    locator: {
                        patchSize: "medium",
                        halfSample: true
                    },
                    numOfWorkers: 2,
                    frequency: 10,
                    decoder: {
                        readers : [{
                            format: "ean_reader",
                            config: {}
                        }]
                    },
                    locate: true
                },
                lastResult : null
            };



        App.init()

        Quagga.onProcessed(function(result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
                }
            }
        });

        Quagga.onDetected(function(result) {
            console.log(result.codeResult.code)


            let code = document.querySelector('#code')
            let $table = document.querySelector('#list-table')
            const add_new_form = document.querySelector('#addForm');
            console.log(add_new_form)


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
        <button data-action="empty">out of stock</button>
      </td>
   
  `
                    $table.appendChild(row)

                    console.log($("#pname").text().length)

                    Quagga.stop()





                }else{

                    pname.innerHTML =  `<button id="formButton" >new </button>


`
                    Quagga.stop()

                    const add_new_button = pname.querySelector('#formButton');

                    add_new_button.addEventListener('click', function (event) {
                        console.log('test')
                        add_new_form.style.display = "block"
                        // add_new_form.show();
                        console.log($scope);
                    })

                    $scope.cancleForm =   function () {
                        add_new_form.style.display = "none"
                        location.reload()

                    }


                }
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
                if (action === "empty"){
                    let input = row.querySelectorAll('input')

                    console.log(input)

                    product.forEach(function (aProduct) {
                        if (aProduct.eanCode === id) {
                            aProduct.pface = "out of stock"
                        }
                        localStorage.setItem('product' , JSON.stringify(product))
                        console.log(product)
                        location.reload()


                    })
                }

            })


        });

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
                const add_new_form = document.querySelector('#addForm');
                console.log(add_new_form)

                //code.innerHTML = result.codeResult.code

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

                        Quagga.stop()



                        }else{

                        pname.innerHTML =  `<button id="formButton" >new </button>

`
                        Quagga.stop()

                    }


                const add_new_button = pname.querySelector('#formButton');

                add_new_button.addEventListener('click', function (event) {
                 console.log('test')
                    add_new_form.style.display = "block"
                   // add_new_form.show();
                 console.log($scope);
                 })

                $scope.cancleForm =   function () {
                    add_new_form.style.display = "none"
                    location.reload()

                }


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

    let toti = _.where(product);
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
        <input placeholder={{empty}}>
    </td>
    <br>
    <td class="actions">
        <button data-action="update">update</button>
        <button data-action="empty">out of stock</button>
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
                    aProduct.pface = face
                }
            })

            localStorage.setItem('product', JSON.stringify(product))
            console.log(product)
        }
        if (action === "empty"){
            let input = row.querySelectorAll('input')

                console.log(input)

            product.forEach(function (aProduct) {
                if (aProduct.eanCode === id) {
                    aProduct.pface = "out of stock"
                }
                localStorage.setItem('product' , JSON.stringify(product))
                row.remove()
                console.log(product)

            })
        }

    })



}])
myApp.controller('realloController', ['$scope',  function($scope) {

    console.log(currentShop)
    //let toti = _.where(product, {category: "ToTi"} || {category: "ToTi"});

    // datas to be fatched from the JSON
    const bw = 1024;
    const bh = 600;


    const nenaMt = 16
    const nenasca =64
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
    const shelveN = 2

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



myApp.controller('pieController', ['$scope', '$routeParams', 'cityService', function($scope, $routeParams) {

    const myCanvas = document.getElementById("myCanvass");
    const myLegend = document.getElementById("myLegend");
    myCanvas.width = 300;
    myCanvas.height = 300;
    let myData = {

        //"SCA": (_.where(product, {producer: "SCA"} )).length,
        //"MT": _.where(product, {producer: "MT"} ),
        //"R. OY": _.where(product, {producer: "R.OY"} ),
        //"Others": _.where(product, {producer: "Others"} ),

        "MT": 325,
        "R. OY": 425,
        "SCA": 255,
        "Others": 125
    };



    function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX,centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
    }

    const Piechart = function(options){
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;

        this.draw = function(){
            let total_value = 0;
            let color_index = 0;
            for (let categ in this.options.data){
                let val = this.options.data[categ];
                total_value += val;
            }


            let start_angle = 0;
            for (categ in this.options.data){
                let val = this.options.data[categ];
                let slice_angle = 2 * Math.PI * val / total_value;

                var pieRadius = Math.min(this.canvas.width/2,this.canvas.height/2);
                var labelX = this.canvas.width/2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle/2);
                var labelY = this.canvas.height/2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle/2);



                var labelText = Math.round(100 * val / total_value);
                this.ctx.fillStyle = "black";
                this.ctx.font = "bold 20px Arial";
                this.ctx.fillText(labelText+"%", labelX,labelY);

                drawPieSlice(
                    this.ctx,
                    this.canvas.width/2,
                    this.canvas.height/2,
                    Math.min(this.canvas.width/2,this.canvas.height/2),
                    start_angle,
                    start_angle+slice_angle,
                    this.colors[color_index%this.colors.length]
                );
                start_angle += slice_angle
                color_index++;



            }


            if (this.options.legend){
                color_index = 0;
                total_value = 0;
                let legendHTML = "";
                for (categ in this.options.data){
                    let val = this.options.data[categ];
                    total_value += val;
                    console.log(total_value)

                    legendHTML += "<div><span style='display:inline-block;width:20px;background-color:"+this.colors[color_index++]+";'>&nbsp;</span> "+ categ + "</div>";


                }


                this.options.legend.innerHTML = legendHTML;
            }
        }
    }

    var myPiechart = new Piechart(
        {
            canvas:myCanvas,
            data:myData,
            colors:["#13b4ff","#ae163e", "#ab3fdd","#ffff00"],
            legend:myLegend

        }
    );
    myPiechart.draw();

}]);




myApp.controller('emptyController', [ function() {
     const table = document.getElementById("out_of_stoke")
     const out_of_stock = _.where(product, {pface: "out of stock"} )

    out_of_stock.forEach(function (empty) {
        console.log("empty" + empty )
        let row = document.createElement('tr')
        row.dataset.id = empty.eanCode
        row.innerHTML = `
    <td>
      ${empty.pName}
    </t>
    <td>
      ${empty.eanCode}
    </td>
    
      `

        table.appendChild(row)
    })





}]);
myApp.controller('productController', ['$scope', '$routeParams', 'cityService', function($scope, $routeParams, cityService) {
    $scope.city = cityService.city;

}]);
myApp.controller('areaController', [ function() {
   let items =  _.where(product, {producer: "SCA"} )

}]);
