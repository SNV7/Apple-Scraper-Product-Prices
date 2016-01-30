/*
 * General purpose utility functions
 */

var accounting = require("./accounting.js"); //http://openexchangerates.github.io/accounting.js/#methods
var constants = require("./constants.js");

var euroFormatDetectMin = 25; //Some euro countries format currencies in decimals (ie € 1.499). euroFormatDetectMin is the max value used to determine if a euro price is formatted this way


exports.createProductObject = function()
{
    var product = {
        "country_code": null, 
        "currency_symbol": null, 
        "country_name": null,
        "product_line": null,
        "model": null, 
        "price": null, 
        "price_formatted": null, 
        "date_price_updated": null,
        "product_url": null,
    };
    return product;
}

/*
exports.createCountryObject = function(code, name, symbol)
{
    var country = {
        "country_code": null, 
        "country_name": null, 
        "currency_symbol": null
    };

    country.country_code = code;
    country.country_name = name;
    country.currency_symbol = symbol;

    return country;
}
*/

/*
 * Takes a formatted Currency String and unformats it to return its raw Number value
 * Takes the formatted Currency String and Currency symbol, returns a Number value
 */
exports.unformatCurrencyNumber = function(currencyString, currencySymbol, countryCode)
{
    if(countryCode == "lu")
    {
        //Luxembourg
        var tempStr = turnCommasToDecimals(currencyString);
        tempStr = extractOnlyNumbersAndDecimalsFromString(tempStr);
        return tempStr;
    }
    else
    {
        var rawVal = accounting.unformat(currencyString);
    }
    

    if(currencySymbol == "IDR=X") rawVal = extractOnlyNumbersFromString(currencyString); //Indonesia Rp 17.999.000 SRP
    else if(currencySymbol == "INR=X") rawVal = extractOnlyNumbersFromString(currencyString); //India Rs.94,900
    else if(currencySymbol == "DKK=X") rawVal = extractOnlyNumbersFromString(currencyString); //Denmark 11.299 kr.
    else if(currencySymbol == "TRY=X") rawVal = extractOnlyNumbersFromString(currencyString); //Turkey 1.449 TL
    else if(currencySymbol == "BRL=X") rawVal = extractOnlyNumbersFromString(currencyString); //Brazil R$ 2.499
    else if(currencySymbol == "EUR=X" && rawVal < euroFormatDetectMin) rawVal = extractOnlyNumbersFromString(currencyString); //Euro 1.449 € (in some cases)
    
    else if(currencySymbol == "EUR=X")
    {
        //For Euro formatted as 511,35 €
        var stringLength = currencyString.length;
        var commaPositionFromEnd = 5;
        var commaIndex = stringLength - commaPositionFromEnd;

        if(currencyString[commaIndex] == ",")
        {
            currencyString = setCharAt(currencyString, commaIndex, ".");
            rawVal = accounting.unformat(currencyString);
        }//end if
    }

    return rawVal;
}

function setCharAt(str,index,chr) 
{
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

/*
 * Takes a String with number charachters in it and returns only the numbers as a Number type
 */
function extractOnlyNumbersFromString(str)
{
    str = str.replace(/\s+/g, ""); //Remove blank spaces from string
    var numString = "";
    for(var i=0; i<str.length; i++)
    {
        var curChar = Number(str[i]);
        //console.log(currencyString+" Looking at "+str[i]);
        if(!isNaN(curChar))
        {
            //console.log(curChar+" is a num ");
            numString = numString + curChar;
        } 
    }
    //console.log("\n");
    return Number(numString);
}

/*
 * Takes a String with number charachters in it and returns only the numbers and decimals as a Number type
 */
function extractOnlyNumbersAndDecimalsFromString(str)
{
    str = str.replace(/\s+/g, ""); //Remove blank spaces from string
    var numString = "";
    for(var i=0; i<str.length; i++)
    {
        var curChar = str[i];
        //console.log(currencyString+" Looking at "+str[i]);
        if(!isNaN(curChar) || curChar == ".")
        {
            //console.log(curChar+" is a num ");
            numString = numString + curChar;
        }
        else
        {
            var curChar2 = Number(str[i]);
            if(!isNaN(curChar))
            {
                numString = numString + curChar;
            }//end if
        }//end if
    }
    //console.log("\n");
    return Number(numString);
}

/*
 * Takes a String and turns all commas to decimals
 */
function turnCommasToDecimals(str)
{
    var numString = "";
    for(var i=0; i<str.length; i++)
    {
        var curChar = str[i];
        //console.log(currencyString+" Looking at "+str[i]);
        if(curChar == ",")
        {
            //console.log(curChar+" is a num ");
            numString = numString + ".";
        } 
        else
        {
            numString = numString + curChar;
        }
    }
    //console.log("\n");
    return numString;
}



/*
 * Removes line breaks from a given string
 */
 exports.removeLineBreaksFromString = function(str)
{
    str = str.replace(/(\r\n|\n|\r)/gm,"");
    str = str.trim();
    return str;
}


