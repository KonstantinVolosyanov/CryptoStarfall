/// <reference path="jquery-3.6.1.js" />

"use strict";

$(document).ready(function () {

    // Parallax:
    $(document, window).SnakeParallax({
        backgroundImage: "url('/assets/Images/geometrical-patterned-blue-scifi-background_53876-116694.jpg')"
    });


    // Arrays:
    let coins = [];
    let favoriteCoinsStorage = localStorage.getItem('favoriteCoins');
    let favoriteCoins = [];
    favoriteCoins = JSON.parse(favoriteCoinsStorage) || [];


    // Handle Currencies
    async function handleCurrencies() {
        $(".loader").css("visibility", "visible")
        coins = await getJson("https://api.coingecko.com/api/v3/coins//");
        displayCoins(coins);
    };


    // Link and Load
    $(document, window).on('load', handleCurrencies());
    $("#currenciesLink").on("click", handleCurrencies);

    // Get Json
    async function getJson(url) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            return json;
        } catch (err) {
            noJsonData(err);
        };

    };


    // No JSON data!!!
    function noJsonData(err) {
        $("#contentDiv").html("");
        $(".errorDataDiv").css("display", "block");
        $(".loader").css("visibility", "hidden");
        $(".errorDataDiv").html(`
        <div class="errorData">
            <p>Server not responding<p>
            <p>Check your Internet connection or try again later.<p>
        <div/>`);

    }


    // Display Coins
    function displayCoins(coins) {
        $("#contentDiv").html("");
        for (const coin of coins) {
            $("#contentDiv").append(
                `<div class="card" id="${coin.symbol}-sym">
                        <label class="switch">
                        <input type="checkbox" ${favoriteCoins.includes(coin.symbol) ? "checked" : ""} class="checkbox">
                        <span class="slider round" id="slider"></span>
                    </label>
                    <span class="coinSymbol">${coin.symbol}</span>
                    <span class="coinName">${coin.name}</span>
                    <button class="moreInfo"  data-bs-toggle="collapse" data-bs-target="#${coin.id}">More Info</button>
                    <div class="collapse" id="${coin.id}">
                        <div class="card-body">
                            <hr>
                            ${(coin.market_data.current_price.usd).toFixed(5)} $
                            <span> | </span>
                            ${(coin.market_data.current_price.eur).toFixed(5)} €
                            <span> | </span>
                            ${(coin.market_data.current_price.ils).toFixed(5)} ₪
                            <img src="${coin.image.small}">
                        </div>
                    </div>  
                </div>`);
        }
        // Hide loader
        $(".loader").css("visibility", "hidden");


        // Checkboxes
        $(".checkbox").on("click", function (e) {
            const symbol = $('.coinSymbol', this.parentElement.parentElement).text();
            if (favoriteCoins.length === 5 && $(this).is(":checked")) {
                $(".errorDiv").css("display", "block");
                e.preventDefault();
                e.stopPropagation();
                return errorWindow(favoriteCoins, symbol);
            }
            if ($(this).is(":checked")) {
                favoriteCoins.push(symbol);
                localStorage.setItem('favoriteCoins', JSON.stringify(favoriteCoins));
            } else {
                favoriteCoins.splice(favoriteCoins.indexOf(symbol), 1);
                localStorage.setItem('favoriteCoins', JSON.stringify(favoriteCoins));

                closeErrorWindow();
            };

        });
    };


    // Error 5 currencies!!!
    function errorWindow(favoriteCoins, symbol) {
        $(".errorDiv").html(`
        <button id="cancelButton"><i class="fa-solid fa-x"></i></button>
        <p id="cancelP">Maximum of favorites chosen<br>
        Please choose currency to remove:</p>
        `);
        for (let i = 0; i < favoriteCoins.length; i++) {
            $(".errorDiv").append(`<button class="deleteButton">${favoriteCoins[i]}</button>`)
        }

        // Cancel button
        $('#cancelButton').on('click', closeErrorWindow);

        // Delete currency button
        $(".deleteButton").on("click", function () {
            deleteCoin(this.innerText);
            this.parentElement.removeChild(this);
            // uncheck selected symbol
            $(`#${this.innerText}-sym input`).get(0).checked = false;
            // add new symbol instead
            $(`#${symbol}-sym input`).get(0).checked = true;
            favoriteCoins.push(symbol);
            localStorage.setItem('favoriteCoins', JSON.stringify(favoriteCoins));
            closeErrorWindow();
        });
    };


    // Close Error Window
    function closeErrorWindow() {
        $('.errorDiv').css('display', 'none');
    };


    //Delete Coins from Favorites
    function deleteCoin(symbol) {
        favoriteCoins.splice(favoriteCoins.indexOf(symbol), 1);
        localStorage.setItem('favoriteCoins', JSON.stringify(favoriteCoins));
    };


    // Search:
    $("#searchInput").on("input", function (event) {
        let search = ($(this).val()).toLowerCase();
        const cards = document.getElementsByClassName("card");
        $(cards).each((i, card) => {
            if (coins[i].name.includes(search) || coins[i].symbol.includes(search)) {
                $(card).css("display", "flex");
            } else $(card).css("display", "none");
        });
    });


    // Reports:=========================in development=============================
    $("#reportsLink").on("click", function handleReports() {
        $("#contentDiv").html("...");
        $("#contentDiv").append(`<h2 id="inDevelopment">In development...</h2>`);
    });


    // About========================================================================

    $("#aboutLink").on("click", function handleAbout() {

        $("#contentDiv").html("");
        $(".errorDataDiv").css("display", "none");
        $("#contentDiv").append(`
        <div class="about-card">
            <div class="img-avatar"></div>
            <div class="card-text">
                <div class="portada"></div>
                <div class="title-total">
                    <div class="title">Developer, Designer</div>
                        <h2>Volosyanov Konstantin</h2>
                    <div class="desc">
                        <label class="label">About me:<label>
                        <p>Front/Back-End Web developer and Graphic designer. Living in Israel, Ramat-Gan.</p>
                        <label class="label">About project:<label>
                        <p>"Crypto Currency" is a SPI (Single Page Application) that provide user with live updating information of 50 worlds most popular crypto currencies.
                            This web applications made and designed for best user experience providing search field to quickly navigate between currencies.
                            There is updated information for each coin relative to Dollar, Euro and NIS currencies.      
                            Also you can add you coins in favorite list ( up to 5 coins) and even check their rate graph via Reports (in development) updating every minute.</p>
                    </div>
                    <div class="actions">
                        <button class="about-button"><i class="far fa-heart"></i></button>
                        <button class="about-button"><i class="far fa-envelope"></i></button>
                        <button class="about-button"><i class="fas fa-user-friends"></i></button>
                    </div>
                        
                </div>
            </div>
        </div>`);
    });
});
