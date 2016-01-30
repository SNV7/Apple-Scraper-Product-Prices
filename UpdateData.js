/*
 * Central script for updating price information
 */

var Currency 	 = require('./models/Currency.js');
var Product 	 = require('./models/Product.js');
var mongoose     = require('mongoose');
//var Constants 	 = require('./Constants.js');

var updateCurrency = require("./UpdateCurrency.js");
var updatePrices = require("./UpdatePrices.js");
//var databaseAccess = require("./DatabaseAccess.js");

mongoose.connect("mongodb://Admin:password@ds######.mongolab.com:#####/aadb"); //connect to MongoLab

console.log("Retrieving Currency data...");
updateCurrency.getResquestCurrencyData(function(currencyData)
{
	console.log("Writing Currency data to database...");
	writeCurrencyDataToDatabase(currencyData, function()
	{
		console.log("Scraping price data...");
		updatePrices.initScrapingParams("iPad", function(priceData)
		{
			console.log("Writing Price data to database...");
			writePriceDataToDatabase(priceData, function(){
				console.log(priceData);
				console.log(priceData.length+" product prices updated");
				console.log("Done updating database...");
			});
			
			//console.log(priceData);
		
		});
		
	});
});

/*
 * Takes an array of Products and converts local currency prices into USD spot prices
 * Converted USD price is assigned to the "usd_converted_price" property of a Product
 */
function convertPricesToUSD(priceData, currencyData, callback)
{
	for(var i=0; i<priceData.length; i++)
	{
		var usdExchangeRate = findExchangeRateForCurrencyCode(currencyData, priceData[i].currency_symbol);
		var usdProductPrice = priceData[i].price / usdExchangeRate;

		priceData[i].usd_converted_price = usdProductPrice;
		priceData[i].usd_converted_rate = usdExchangeRate;
		priceData[i].date_currency_rate_updated = new Date();
	}

	callback(priceData);
}

/*
 * Finds and returns the USD exchange rate for a given currency code
 * Takes an array of yahoo Currencies and the currency code to find for
 */
function findExchangeRateForCurrencyCode(currencyData, currencyCode)
{
	for(var i=0; i<currencyData.length; i++)
	{
		if(String(currencyData[i].currency_symbol) == String(currencyCode)) return currencyData[i].price;
	}

	return 0;
}

/*
 * Prints out an array of Products, displaying important fields only
 */
function printOutData(productsArray)
{
	for(var i=0; i<productsArray.length; i++)
	{
		console.log("product_line: "+productsArray[i].product_line);
		console.log("model: "+productsArray[i].model);
		console.log("country_code: "+productsArray[i].country_code);
		console.log("country_name: "+productsArray[i].country_name);
		console.log("currency_symbol: "+productsArray[i].currency_symbol);
		console.log("price: "+productsArray[i].price);
		console.log("\n");

	}//end for
}

/* //////////////////////////////////////////////////////////////////////////////////
 * Database Access functions
 */

function writeCurrencyDataToDatabase(currencyData, callback)
{
	var counter = 0;
	for(var i=0; i<currencyData.length; i++)
	{
		writeCurrencyToDatabase(currencyData[i], function(err, data)
		{
			if(++counter == currencyData.length)
			{
				callback();
			}
		});
	}//end for
}

function writePriceDataToDatabase(priceData, callback)
{
	var counter = 0;
	for(var i=0; i<priceData.length; i++)
	{
		writeProductToDatabase(priceData[i], function(err, data)
		{
			if(++counter == priceData.length)
			{
				callback();
			}
		});
	}//end for
}

/*
 * Writes a Currency object to datavase
 * Takes the Currency object and a callback function
 */
function writeCurrencyToDatabase(currencyObj, callback)
{
	Currency.update({currency_symbol: currencyObj.currency_symbol}, currencyObj, {upsert:true}, function(err,data)
	{
		if(err)
		{
			console.log(err);
			callback(err,null);
		}
		else
		{
			callback(err,data);
		}//end if
	});
}

/*
 * Writes a Product object to datavase
 * Takes the Product object and a callback function
 */
function writeProductToDatabase (productObj, callback)
{
	Product.remove({}, function(err, data){

		if(err) console.log(err);

		Product.create(productObj, function(err,data)
		{
			if(err)
			{
				console.log(err);
				callback(err,null);
			}
			else
			{
				callback(err,data);
			}//end if
		});

		/*
		Product.update({model: productObj.model, country_code: productObj.country_code}, productObj, {upsert:true}, function(err,data)
		{
			if(err)
			{
				console.log(err);
				callback(err,null);
			}
			else
			{
				callback(err,data);
			}//end if
		});
*/
	});
}



