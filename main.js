let allCurrency = new Array();
let totalcoinsArray = new Array();
let copyArray = new Array();
let interval;

//making an ajax request whan window is loading
(function () {
    $(function () {
        loader("#dinamicAria")
        $.ajax({
            url: "https://api.coingecko.com/api/v3/coins/list",
            type: "GET",
            success: function (data) {
                allCurrency = data
                localStorage.setItem("cryptoArray", JSON.stringify(data))
                console.log("connecion sucsses");
                console.log(data);
                drowCrypto()
            },
            error: function () {
                console.log("connection feild");
            }
        });
    })
})();
// responsable on drowing a card for each currency
function drowCrypto() {
    $("#dinamicAria").empty()
    let toglleArray = getChosenFromStorage()
    for (let index = 300; index < allCurrency.length && index < 400; index++) {
        let newDiv = $("<div>")
        newDiv.css("display", "inline-block")
        newDiv.attr("class", "card");
        newDiv.css("width", "220px")
        newDiv.css("height", "300px")
        newDiv.css("margin", "5px")
        newDiv.css("border", "black solid 1px")
        newDiv.css("padding", "5px")
        let checkBox = $("<div>")
        checkBox.css("height", "5%")
        checkBox.css("float", "right")
        checkBox.attr("class", "custom-control custom-switch")
        let inputCheckBox = $("<input type=checkbox class=custom-control-input>")
        inputCheckBox.attr("value", allCurrency[index].symbol)
        $.each(toglleArray, function (i, item) {
            if (allCurrency[index].symbol == item) {
                return inputCheckBox.attr("checked", "checked")
            }
        })
        inputCheckBox.attr("id", index)
        inputCheckBox.change(maxToglle)
        let label = $("<label class=custom-control-label for=customSwitches>")
        label.attr("for", index)
        checkBox.append(inputCheckBox)
        checkBox.append(label)
        newDiv.append(checkBox)
        let symbolDiv = $("<div>")
        let symbolText = $("<h4>")
        symbolText.html(allCurrency[index].symbol)
        let cryptoName = $("<p>")
        cryptoName.html(allCurrency[index].name)
        symbolDiv.append(symbolText)
        symbolDiv.append(cryptoName)
        symbolDiv.css("height", "35%")
        symbolDiv.css("padding-buttom", "30px")
        let buttonsDiv = $("<div>")
        let button = $("<button type=button>")
        button.html("More Info")
        button.click(moreInfo)
        button.attr("id", allCurrency[index].id)
        let textDiv = $("<div>")
        textDiv.attr("id", "text" + allCurrency[index].id)
        textDiv.css("display", "none")
        newDiv.css("background-color", "#366da53b")
        buttonsDiv.append(button)
        newDiv.append(symbolDiv)
        newDiv.append(buttonsDiv)
        newDiv.append(textDiv)
        $("#dinamicAria").append(newDiv)

    }

}
// getting the array from storage
function getFromStorage() {
    let allCurrency = JSON.parse(localStorage.getItem("cryptoArray"));
    if (allCurrency == null) {
        allCurrency = [];
    }
    return allCurrency;
}
//responsable for getting the extra information on the spaccific coin
function moreInfo() {
    let id = this.id
    loader(`#text${id}`);
    $(`#text${id}`).slideToggle("slow", drowMoreInfo(id))
    return;
}
//making an ajax request on a spaccific id
function getIdDataFromServer(id) {
    $.ajax({
        url: `https://api.coingecko.com/api/v3/coins/${id}`,
        type: "GET",
        success: function (data) {
            sessionStorage.setItem(id, JSON.stringify(data))
            drowMoreInfo(id)

            console.log("connecion sucsses");

        },
        error: function () {
            console.log("connection feild");
        }
    })
}
//display the extra information in the card
function drowMoreInfo(id) {
    let coinData = JSON.parse(sessionStorage.getItem(id))
    if (coinData == null) {
        return getIdDataFromServer(id)
    }
    let img = $("<img>")
    img.attr("src", coinData.image.small)
    $(`#text${id}`).html(
        "<br>" + "USD: " + coinData.market_data.current_price.usd +
        "<br>" + "EUR: " + coinData.market_data.current_price.eur +
        "<br>" + "ILS: " + coinData.market_data.current_price.ils
    )
    $(`#text${id}`).append(img)
}
//maneging the traffic in the chosen coins array 
function maxToglle() {
    let toglleArray = getChosenFromStorage()
    let value = this.value
    if (toglleArray.length <= 5) {
        for (let index = 0; index < toglleArray.length; index++) {
            if (value == toglleArray[index]) {
                toglleArray.splice(index, 1)
                return localStorage.setItem("toglleChosen", JSON.stringify(toglleArray))
            }
        }
        if (toglleArray.length < 5) {
            toglleArray.push(value)
            return localStorage.setItem("toglleChosen", JSON.stringify(toglleArray))
        }

        popUpForm(toglleArray, value)
    }

}
// retreving the chosen coin array from storage
function getChosenFromStorage() {
    let toglleArray = JSON.parse(localStorage.getItem("toglleChosen"));
    if (toglleArray == null) {
        toglleArray = [];
    }
    return toglleArray;
}
//displaing the modal
function popUpForm(toglleArray, value) {
    $.each(toglleArray, function (index, item) {
        let div = $("<div>")
        div.attr("class", "custom-control custom-switch")
        div.css("border", "solid black 1px")
        let input = $("<input type=checkbox class=custom-control-input>")
        input.val(item)
        input.attr("id", index)
        input.attr("checked", "checked")
        div.append(input)
        let label = $("<label class=custom-control-label>")
        label.attr("for", index)
        label.html(item)
        div.append(input)
        div.append(label)
        $(".modal-body").append(div)
    })
    copyArray.push(value)
    $('#exampleModalCenter').modal("show")

}
//changing the dinamic aria to the home display
function home() {
    clearInterval(interval)
    totalcoinsArray = []
    $("#dinamicAria").show()
    $(".Parallax").css("height", "67%")
    allCurrency = getFromStorage()
    drowCrypto()
}
//changing the dinamic aria to the reports display
function reports() {
    let toglleArray = getChosenFromStorage()
    if (toglleArray.length < 1) {
        return $("#dinamicAria").html("please choose at least one coin")
    }
    $("#dinamicAria").empty()
    let canves = $("<div>")
    canves.attr("id", "chart")
    canves.css("width", "90%")
    canves.css("margin-top", "25px")
    $(".Parallax").css("height", "0")
    canves.css("hight", "400px")
    $("#dinamicAria").append(canves)
    loader("#dinamicAria")
    interval = setInterval(getCoinsFromApi, 2000)
}
//changing the dinamic aria to the about display
function about() {
    clearInterval(interval)
    totalcoinsArray = []
    $("#dinamicAria").empty()
    $(".Parallax").css("height", " 0")

    let aboutDiv = $("<div>")
    aboutDiv.css("height", "500px")
    aboutDiv.css("width", "80%")
    aboutDiv.attr("class", "row justify-content-center")

    let textDiv = $("<div>")
    textDiv.html("Hello to all," + "<br>" +
        "My name is Gil Yanay." + "<br>" +
        "I am the CEO of " + "<b>" + "YANAY CO LTD, " + "</b>" + "the world leading website of crypto currency`s." + "<br>" +
        "In my website you can find some free information like currency symbol and live prices." + "<br>" +
        "For the " + "<b>" + "V.I.P" + "</b>" + " members club, YANAY CO provide a comprehensive trading platform with live information and market analyses." + "<br>" +
        "To join our " + "<b>" + "V.I.P" + "</b>" + " club please send a request to: registration@yanayco.com")
    textDiv.css("font-family", "arial")

    let imgDiv = $("<div>")
    imgDiv.css("height", "50%")
    imgDiv.css("width", "350px")
    let img = $("<img>")
    img.attr("src", "./images/gil.jpg")
    img.css("height", "100%")
    img.css("width", "100%")
    imgDiv.append(img)
    aboutDiv.append(imgDiv)
    aboutDiv.append(textDiv)
    $("#dinamicAria").append(aboutDiv)

}
//displaying one spaccific coin
function search() {
    allCurrency = getFromStorage()
    let userSearch = $("#cryptoSearchName").val()
    $("#cryptoSearchName").val("")
    $(".Parallax").css("height", "67%")
    $.each(allCurrency, function (index, item) {
        if (userSearch == item.symbol) {
            $("#dinamicAria").empty()
            allCurrency = new Array()
            allCurrency[300] = item

            drowCrypto()

        }
    })
}
//cancaling the last coin you chose after you chosse 5 coins
function dontSave() {
    $("#displyCrypoAria").empty()
    drowCrypto()
    $(".modal-body").empty()
    copyArray = []
}
//replacing the new chice with the coins you descard
function saveChanges() {
    $("#displyCrypoAria").empty()

    let changeArray = $(".modal-body")[0].children
    $.each(changeArray, function (index, item) {
        if (item.firstChild.checked == true) {
            copyArray.push(item.firstChild.value)
        }


    })
    if (copyArray.length > 5) {
        drowCrypto()
        $(".modal-body").empty()
        return copyArray = []
    }
    localStorage.setItem("toglleChosen", JSON.stringify(copyArray))
    drowCrypto()
    $(".modal-body").empty()
    copyArray = []
}
//responsable on the graphic display
function getCoinsFromApi() {
    let toglleArray = getChosenFromStorage()
    $.ajax({
        url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + toglleArray + "," + "&tsyms=USD",
        type: "GET",
        success: function (result) {

            let xAxis = new Date()
            console.log(xAxis)
            let coinObj = {}
            let dataArray = new Array()
            let dataObj = {}
            $.each(toglleArray, function (index, item) {
                totalcoinsArray.push([])
                let coinName = result[toglleArray[index].toUpperCase()]
                if (coinName == null) {
                    coinObj = {
                        x: xAxis,
                        y: 0
                    }
                } else {
                    coinObj = {
                        x: xAxis,
                        y: coinName.USD
                    }
                }
                totalcoinsArray[index].push(coinObj)
                dataObj = {
                    type: "line",
                    name: toglleArray[index],
                    showInLegend: true,
                    dataPoints: totalcoinsArray[index]

                }
                dataArray.push(dataObj)
            })

            let options = {
                title: { text: "Crypto Currency Live Graph" },
                toolTip: { shared: true },
                data: dataArray
            };
            $("#chart").CanvasJSChart(options);

            // function toggleDataSeries(e) {
            //     if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            //         e.dataSeries.visible = false;
            //     } else {
            //         e.dataSeries.visible = true;
            //     }
            //     e.chart.render();
            // }
            console.log("connecion sucsses");
        },
        error: function () {
            console.log("connection feild");
        }
    })

}
//display a loading bar type while user is whaiting
function loader(component) {
    let gif = '<img  src="./images/load.gif"></img>';
    let loaderDiv = `<div class="loader" col-12">${gif}</div>`;
    $(loaderDiv).append(gif);
    $(component).append(loaderDiv);
};

