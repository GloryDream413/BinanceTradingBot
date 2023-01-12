const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');
const fs = require('fs')
const csv = require('csv-parser');
const { Console } = require('console');
var {exportLog} = require('../binancelog/log.js');
const header = ['Kline open time', 'Open price', 'High price', 'Low price', 'Close price', 'Volume', 'Kline Close time', 'Quote asset volume', 'Number of trades', 'Taker buy base asset volume', 'Taker buy quote asset volume', 'Unused field, ignore'];
var isHeader = false;
let logPath;
function exportCSV(path, priceArray) {
    for (let i = 0; i < 20; i++)
    {
        var valDate = new Date(priceArray[i][0]);
        let textDate = valDate.getDate().toString() + valDate.getMonth().toString() + '22_';
        let varHour;
        if(valDate.getHours() < 10)
        {
            varHour = '0' + valDate.getHours().toString();
        }
        else
        {
            varHour = valDate.getHours().toString();
        }
        textDate += varHour;
        let varMinutes;
        if(valDate.getMinutes() < 10)
        {
            varMinutes = '0' + valDate.getMinutes().toString();
        }
        else
        {
            varMinutes = valDate.getMinutes().toString();
        }
        textDate += varMinutes;
        priceArray[i][0] = textDate;

        valDate = new Date(priceArray[i][6]);
        textDate = valDate.getDate().toString() + valDate.getMonth().toString() + '22_';
        if(valDate.getHours() < 10)
        {
            varHour = '0' + valDate.getHours().toString();
        }
        else
        {
            varHour = valDate.getHours().toString();
        }
        textDate += varHour;
        if(valDate.getMinutes() < 10)
        {
            varMinutes = '0' + valDate.getMinutes().toString();
        }
        else
        {
            varMinutes = valDate.getMinutes().toString();
        }
        textDate += varMinutes;
        priceArray[i][6] = textDate;
    }
    
    var val;
    if(!isHeader)
    {
        val = convertArrayToCSV(priceArray, {
            header,
            separator: ','
            });
    }
    else{

        val = convertArrayToCSV([priceArray[19]], {
            separator: ','
            });
    }
    isHeader = true;

    logPath = path;
    logPath.replace(".csv", ".log");
    fs.appendFile(path, val, (err) => {
        if(err)
        {
            exportLog(logPath, "CSV file has not been saved.");
        }
    });
}

module.exports = {exportCSV}
