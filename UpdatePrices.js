//https://scotch.io/tutorials/scraping-the-web-with-node-js
// https://www.apple.com/ca/macbook-pro/specs-retina/

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
//var accounting = require("./accounting.js"); //http://openexchangerates.github.io/accounting.js/#methods
var constants = require("./constants.js");
var sleep = require('sleep');
//var utilityFunctions = require('./UtilityFunctions.js');

var ipadScrape = require('./scraping/Scrape_iPad.js');
var macbookProScrape = require('./scraping/Scrape_MacBookPro.js');

/*
initScrapingParams("iPad", function(data){
    console.log(data);
    console.log("Done mac");
});
*/

exports.initScrapingParams = function(productLineName, callback)
{
    if(productLineName == "iPad")
    {
        var scrapeFunction = ipadScrape.scrapeIpadPrices;

        var countries = constants.retrieveCountries(new Array());

        startScraping(scrapeFunction, countries, function(data)
        {
            callback(data);
        })
    }
    else if(productLineName == "MacBook Pro")
    {
        var scrapeFunction = macbookProScrape.scrapeMbpPrices;

        var countries = constants.retrieveCountries(new Array("br","mx","tr","hu","lu","cz","vn","ph","ae")); //Brazil and Mexico don't have MBP price data

        startScraping(scrapeFunction, countries, function(data)
        {
            callback(data);
        })
    }
}

function startScraping(func, countries, callback)
{
    //Loop through each country and grab Product Prices
    var arrayOfAllPrices = new Array;
    var counter = 0;

    for(var j=0; j<countries.length; j++)
    {
        func(countries[j], function(productArray)
        {
            if(productArray != null && productArray) arrayOfAllPrices.push(productArray);

            if(++counter == countries.length)
            {
                //Flatten out array (from 2D)
                var flatProductsArray = new Array();
                for(var y=0; y<arrayOfAllPrices.length; y++)
                {
                    for(var k=0; k<arrayOfAllPrices[y].length; k++) flatProductsArray.push(arrayOfAllPrices[y][k]);
                }//end for

                callback(flatProductsArray); //Done
            }//end if

        });
    
    }//end for

}//end function










