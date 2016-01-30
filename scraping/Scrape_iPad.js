/*
 * iPad data scraping specific functions
 */

//https://scotch.io/tutorials/scraping-the-web-with-node-js
// https://www.apple.com/ca/macbook-pro/specs-retina/

var request = require('request');
var cheerio = require('cheerio');
var constants = require("../constants.js");
var sleep = require('sleep');
var utilityFunctions = require('../UtilityFunctions.js');

var urlFirst = "http://store.apple.com/";
var urlSecond = "/ipad/compare";
var urlUS = "http://store.apple.com/us/ipad/compare";

/*
 * Scrapes iPad prices 
 * Takes a Country object and callback function
 * Callsback with an array of Products with price and country specific information reflecting the Country that was passed in
 */
exports.scrapeIpadPrices = function(country, callback)
{
    var url = createRequestURL(country);

    sleep.sleep(1); //Sleep for 1 second

    console.log("Country: "+country.country_code+" Scraping url -> "+url);

    if(url != null || url)
    {
        request(url, function(error, response, html){

            if(!error)
            {
                console.log(url);
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                var $ = cheerio.load(html);

                $('body').each(function(i, item){
                
                    var pricesArray = new Array();

                    //iPad Air 2
                    pricesArray.push({"product_name":"iPad Air 2 Wi-Fi 16GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[3].children[3].children[3].children[0].data}); // iPad Air2 - wifi model 16GB
                    pricesArray.push({"product_name":"iPad Air 2 Wi-Fi 64GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[3].children[3].children[7].children[0].data}); // iPad Air2 - wifi model 64GB  
                    pricesArray.push({"product_name":"iPad Air 2 Wi-Fi 128GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[3].children[3].children[11].children[0].data}); // iPad Air2 - wifi model 128GB  

                    pricesArray.push({"product_name":"iPad Air 2 Wi-Fi & Cellular 16GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[3].children[7].children[3].children[0].data}); // iPad Air2 - wifi + cellular model 16GB
                    pricesArray.push({"product_name":"iPad Air 2 Wi-Fi & Cellular 64GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[3].children[7].children[7].children[0].data}); // iPad Air2 - wifi + cellular model 64GB  
                    pricesArray.push({"product_name":"iPad Air 2 Wi-Fi & Cellular 128GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[3].children[7].children[11].children[0].data}); // iPad Air2 - wifi + cellular model 128GB 

                    //iPad Air
                    pricesArray.push({"product_name":"iPad Air Wi-Fi 16GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[5].children[3].children[3].children[0].data}); // iPad Air - wifi model 16B 
                    pricesArray.push({"product_name":"iPad Air Wi-Fi 32GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[5].children[3].children[7].children[0].data}); // iPad Air - wifi model 32B   
                
                    pricesArray.push({"product_name":"iPad Air Wi-Fi & Cellular 16GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[5].children[7].children[3].children[0].data}); // iPad Air - wifi + cellular model 16B 
                    pricesArray.push({"product_name":"iPad Air Wi-Fi & Cellular 32GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[5].children[7].children[7].children[0].data}); // iPad Air - wifi + cellular model 32B  

                    //iPad mini 3
                    pricesArray.push({"product_name":"iPad Mini 3 Wi-Fi 16GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[7].children[3].children[3].children[0].data}); // iPad mini 3 - wifi model 16B 
                    pricesArray.push({"product_name":"iPad Mini 3 Wi-Fi 64GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[7].children[3].children[7].children[0].data}); // iPad mini 3 - wifi model 64B   
                    pricesArray.push({"product_name":"iPad Mini 3 Wi-Fi 128GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[7].children[3].children[11].children[0].data}); // iPad mini 3 - wifi model 128B   

                    pricesArray.push({"product_name":"iPad Mini 3 Wi-Fi & Cellular 16GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[7].children[7].children[3].children[0].data}); // iPad mini 3 - wifi + cellular model 16B 
                    pricesArray.push({"product_name":"iPad Mini 3 Wi-Fi & Cellular 64GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[7].children[7].children[7].children[0].data}); // iPad mini 3 - wifi + cellular model 64B  
                    pricesArray.push({"product_name":"iPad Mini 3 Wi-Fi & Cellular 128GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[7].children[7].children[7].children[0].data}); // iPad mini 3 - wifi + cellular model 128B  

                    //iPad mini 2
                    pricesArray.push({"product_name":"iPad Mini 2 Wi-Fi 16GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[9].children[3].children[3].children[0].data}); // iPad mini 2 - wifi model 16GB
                    pricesArray.push({"product_name":"iPad Mini 2 Wi-Fi 32GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[9].children[3].children[7].children[0].data}); // iPad mini 2 - wifi model 32GB

                    pricesArray.push({"product_name":"iPad Mini 2 Wi-Fi & Cellular 16GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[9].children[7].children[3].children[0].data}); // iPad mini 2 - wifi + cellular model 16GB
                    pricesArray.push({"product_name":"iPad Mini 2 Wi-Fi & Cellular 32GB", "price": item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[9].children[7].children[7].children[0].data}); // iPad mini 2 - wifi + cellular model 32GB
                    //Removed from store -  pricesArray.push({"product_name":"iPad Mini Wi-Fi & Cellular 16GB", "price": removeLineBreaksFromString(item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children[11].children[7].children[3].children[0].data)}); // iPad mini - wifi + cellular  model 16GB
                    //td Price Compare row -> item.children[5].children[7].children[3].children[1].children[1].children[5].children[3].children              

                    //Create Product objects
                    var productArray = new Array();
                    for(var k=0; k<pricesArray.length; k++)
                    {
                        var productName = pricesArray[k].product_name;
                        var productPrice = pricesArray[k].price;

                        var product = utilityFunctions.createProductObject();
                        product.country_code = country.country_code;
                        product.currency_symbol = country.currency_symbol;
                        product.country_name = country.country_name;
                        product.model = productName;
                        product.product_line = constants.iPad_name();
                        product.price_formatted = productPrice;
                        product.date_price_updated = new Date();
                        product.product_url = url;

                        //Convert formatted price to Number
                        var rawVal = utilityFunctions.unformatCurrencyNumber(productPrice, country.currency_symbol, country.country_code);
                        product.price = rawVal;

                        productArray.push(product);
                    }//end for
                    //console.log(productArray);
                    callback(productArray);

                });
            }
            else
            {
                //Error
                console.log("ERORR 005 "+url);
                console.log(error);
                callback(null);
            }
        });//end request
    }
    else
    {
        //null url
        console.log("No data scraped");
        callback(null);
    }
}

/*
 * Creates the country specific URL to request an apple webpage
 */
function createRequestURL(country)
{
    var url = "";
    if(country.country_code == "us") url = urlUS;
    else if(country.country_code == "chde") url = urlFirst+"ch-de"+urlSecond; //only for iPad
    else if(country.country_code == "benl") url = urlFirst+"be-nl"+urlSecond; //only for iPad
    else if(country.country_code == "in") url = null; //only for iPad - Inida does not have an iPad price page

    else url = urlFirst+country.country_code+urlSecond;
    return url;
}









