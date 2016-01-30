/*
 * Script for updating Currency data in database
 */

var http = require('http');

var currencyURL = "YAHOO_CURRENCY_URL";

exports.getResquestCurrencyData = function(callback)
{
	http.get(currencyURL, function(res){

		var body = '';

   	 	res.on('data', function(chunk) {
        	body += chunk;
    	});//end on

    	res.on('end', function() {
        	var jsonData = JSON.parse(body)
        	var currencyData = parseOutCurrencyQuotes(jsonData);
        	callback(currencyData);
    	});//end on

	});//end get
}

/*
 * Takes a Yahoo FOREX JSON response and creates an array of Currency objects
 */
function parseOutCurrencyQuotes(jsonData)
{
	var currencyResponseArray = jsonData.list.resources;

	var currencyArray = new Array();

	for(var i=0; i<currencyResponseArray.length; i++)
	{
		var currency = currencyResponseArray[i].resource.fields;

		var currencyObj = createCurrencyObejct();
		currencyObj.price_usd = currency.price;
		currencyObj.currency_symbol = currency.symbol;
		currencyObj.last_updated = new Date();
		currencyObj.currency_name = currency.name;

		currencyArray.push(currencyObj);
	}//end for

	return currencyArray;
}

function createCurrencyObejct()
{
	var Currency = {
		price_usd: Number,
    	currency_symbol: String,
    	last_updated: Date,
    	currency_name: String
	};
	return Currency;
}

