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

var urlFirst = "http://www.apple.com/";
var urlSecond = "/macbook-pro/specs-retina/";
var urlUS = "http://www.apple.com/macbook-pro/specs-retina/";

/*
 * Scrapes iPad prices 
 * Takes a Country object and callback function
 * Callsback with an array of Products with price and country specific information reflecting the Country that was passed in
 */
exports.scrapeMbpPrices = function(country, callback)
{
    var url = createRequestURL(country);
    sleep.sleep(1); //Sleep for 1 second
    
    console.log("Country: "+country.country_code+" Scraping url -> "+url);

    if(url != null && url)
    {

        request(url, function(error, response, html){

            if(!error)
            {
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                var $ = cheerio.load(html);
                
                $('body').each(function(i, item)
                {
                    var pricesArray = new Array();
                    console.log(url);
                    pricesArray.push({"product_name":"MacBook Pro 13-inch 128GB", "price": item.children[8].children[3].children[1].children[3].children[6].children[5].children[1].children[0].data}); //MBP 13" 128GB
                    pricesArray.push({"product_name":"MacBook Pro 13-inch 256GB", "price": item.children[8].children[3].children[1].children[3].children[6].children[7].children[1].children[0].data}); //MBP 13" 256GB
                    pricesArray.push({"product_name":"MacBook Pro 13-inch 512GB", "price": item.children[8].children[3].children[1].children[3].children[6].children[9].children[1].children[0].data}); //MBP 13" 512GB
                    pricesArray.push({"product_name":"MacBook Pro 15-inch 256GB", "price": item.children[8].children[3].children[1].children[3].children[6].children[11].children[1].children[0].data}); //MBP 15" 256GB
                    pricesArray.push({"product_name":"MacBook Pro 15-inch 512GB", "price": item.children[8].children[3].children[1].children[3].children[6].children[13].children[1].children[0].data}); //MBP 15" 512GB

                    //console.log(item.children[8].children[3].children[1].children[3].children[6].children[13].children[1].children[0].data);

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
                        product.product_line = constants.macBookPro_name();
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
                callback(new Array(constants.createProductObject()))
            }//end if

        });//end request
    }
    else
    {
        //null url
        console.log("No data scraped");
        callback(null);
    }//end if
}


/*
 * Creates the country specific URL to request an apple webpage
 */
function createRequestURL(country)
{
    var url = "";
    if(country.country_code == "us") url = urlUS;
    else url = urlFirst+country.country_code+urlSecond;
    return url;
}

/*
 * Returns an array of all product names for this product line
 */
function retreiveProducts()
{
    var productLines = constants.retreiveAppleProducts();
    var mbpName = constants.macBookPro_name();

    for(var i=0; i<productLines.length; i++)
    {
        if(mbpName == productLines[i].product_line) return productLines[i].product_list;
    }

    return new Array();
}








