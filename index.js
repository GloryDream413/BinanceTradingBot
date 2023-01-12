
const Binance = require("node-binance-api");
var {exportCSV} = require('./csv/csv.js');
var {exportLog} = require('./binancelog/log.js');
var {key} = require('./key.js');
const binance = new Binance().options({
  APIKEY: ,
  APISECRET: ,
});

// binance.marketBuy("ETHUSDT", quantity, flags, (error, response) => {
//   if ( error ) return console.error(error);
  
//   console.info("Quantity ", quantity);
//   console.info("Market Buy response", response);
//   console.info("order id: " + response.orderId);
//   // Now you can limit sell with a stop loss, etc.
// });

binance.balance(async (error, balances) => {
  console.log(balances.ETH.available);
  console.log(balances.USDT.available);
    try{
      let temp = Number(balances.USDT.available);
      quantity = temp.toFixed(4);
      if(quantity > temp)
      {
        quantity -= 0.0001;
        quantity = quantity.toFixed(4);
      }
      quantity = 10;
      console.log(quantity);
      await binance.marketBuy("ETHUSDT", quantity);
    } catch(e){
      console.log(e);
    }
});

let status = 1;
let price = 2000;
let mprice = 0;
let csvPath = "./csv/csv-log/";
let logPath = "./binancelog/binance-log/"

const currentDate = new Date();
let textDate = currentDate.getDate().toString() + currentDate.getMonth().toString() + '22_';
let varHour;
if(currentDate.getHours() < 10)
{
  varHour = '0' + currentDate.getHours().toString();
}
else
{
  varHour = currentDate.getHours().toString();
}
textDate += varHour;

let varMinutes;
if(currentDate.getMinutes() < 10)
{
  varMinutes = '0' + currentDate.getMinutes().toString();
}
else
{
  varMinutes = currentDate.getMinutes().toString();
}
textDate += varMinutes;
let csvRealPath = csvPath + textDate + ".csv";
let logRealPath = logPath + textDate + ".log";

const trade = async () => {
  if (status == 0) {
    let current = Date.now();
    binance.candlesticks(
      "ETHUSDT",
      "1m",
      async (error, ticks, symbol) => {
        exportCSV(csvRealPath, ticks);
        let lowPriceBefore20 = ticks[0][3];
        let lowPriceBefore10 = ticks[10][3];
        for(let i=0;i<10;i++)
        {
          if(lowPriceBefore10 > ticks[i][3])
          {
            lowPriceBefore10 = ticks[i][3];
          }
        }

        for(let j=10;j<20;j++)
        {
          if(lowPriceBefore20 > ticks[j][3])
          {
            lowPriceBefore20 = ticks[j][3];
          }
        }

        if (
          lowPriceBefore20 < lowPriceBefore10 &&
          lowPriceBefore10 < ticks[0][3] &&
          ticks[19][4] < ticks[9][4] &&
          ticks[9][4] < ticks[0][4]
        ) {
          await exportLog(logRealPath, "\n---------------------");
          await exportLog(logRealPath, "\nIt is time for buying.");
          await exportLog(logRealPath, "\nReason:Before 20 min:Low Price:");
          await exportLog(logRealPath, String(lowPriceBefore20));
          await exportLog(logRealPath, " & Close Price:");
          await exportLog(logRealPath, String(ticks[19][4]));
          await exportLog(logRealPath, "\nBefore 10 min:Low Price:");
          await exportLog(logRealPath, String(lowPriceBefore10));
          await exportLog(logRealPath, " & Close Price:");
          await exportLog(logRealPath, String(ticks[9][4]));
          await exportLog(logRealPath, "\nNow:Low Price:");
          await exportLog(logRealPath, String(ticks[0][3]));
          await exportLog(logRealPath, " & Close Price:");
          await exportLog(logRealPath, String(ticks[0][4]));
          await exportLog(logRealPath, "\nSo It fits to the buying strategy");


          console.log("\n---------------------");
          console.log("\nIt is time for buying.");
          console.log("\nReason:Before 20 min:Low Price:");
          console.log(String(lowPriceBefore20));
          console.log(" & Close Price:");
          console.log(String(ticks[19][4]));
          console.log("\nBefore 10 min:Low Price:");
          console.log(String(lowPriceBefore10));
          console.log(" & Close Price:");
          console.log(String(ticks[9][4]));
          console.log("\nNow:Low Price:");
          console.log(String(ticks[0][3]));
          console.log(" & Close Price:");
          console.log(String(ticks[0][4]));
          console.log("\nSo It fits to the buying strategy");
          
          binance.balance(async (error, balances) => {
            if (balances.USDT !== undefined && balances.USDT.available > 10) {
              await exportLog(logRealPath, "\n-------Buying-------");
              await exportLog(logRealPath, "\nBefore:ETHs balances:\n");
              await exportLog(logRealPath, String(balances.ETH.available));
              await exportLog(logRealPath, "\nUSDTs:balances:\n");
              await exportLog(logRealPath, String(balances.USDT.available));

              console.log("\n-------Buying-------");
              console.log("\nBefore:ETHs balances:\n");
              console.log(String(balances.ETH.available));
              console.log("\nUSDTs:balances:\n");
              console.log(String(balances.USDT.available));
              let ticker = await binance.prices();
              price = ticker.ETHUSDT;
              mprice = 0;
              try{
                let temp = Number(balances.USDT.available);
                quantity = temp.toFixed(4);
                if(quantity > temp)
                {
                  quantity -= 0.0001;
                  quantity = quantity.toFixed(4);
                }
                await binance.marketBuy("ETHUSDT", quantity);
              } catch(e){
              }
              await exportLog(logRealPath, "\nNow:ETHs balances:\n");
              await exportLog(logRealPath, String(balances.ETH.available));
              await exportLog(logRealPath, "\nNow:USDTs balances:\n");
              await exportLog(logRealPath, String(balances.USDT.available));

              console.log("\nNow:ETHs balances:\n");
              console.log(String(balances.ETH.available));
              console.log("\nNow:USDTs balances:\n");
              console.log(String(balances.USDT.available));
              status = 1;
            }
          });
        } else {
          binance.balance(async (error, balances) => {
            await exportLog(logRealPath, "\n---------------------");
            await exportLog(logRealPath, "\nCurrent ETH balances:");
            await exportLog(logRealPath, String(balances.ETH.available));
            await exportLog(logRealPath, "\nCurrent USDT balances:");
            await exportLog(logRealPath, String(balances.USDT.available));
            await exportLog(logRealPath, "\nIt is not time for buying.");
            await exportLog(logRealPath, "\nReason:Before 20 min:Low Price:");
            await exportLog(logRealPath, String(lowPriceBefore20));
            await exportLog(logRealPath, " & Close Price:");
            await exportLog(logRealPath, String(ticks[19][4]));
            await exportLog(logRealPath, "\nBefore 10 min:Low Price:");
            await exportLog(logRealPath, String(lowPriceBefore10));
            await exportLog(logRealPath, " & Close Price:");
            await exportLog(logRealPath, String(ticks[9][4]));
            await exportLog(logRealPath, "\nNow:Low Price:");
            await exportLog(logRealPath, String(ticks[0][3]));
            await exportLog(logRealPath, " & Close Price:");
            await exportLog(logRealPath, String(ticks[0][4]));
            await exportLog(logRealPath, "\nSo It doesn't fit to the buying strategy");

            console.log("\n---------------------");
            console.log("\nCurrent ETH balances:");
            console.log(String(balances.ETH.available));
            console.log("\nCurrent USDT balances:");
            console.log(String(balances.USDT.available));
            console.log("\nIt is not time for buying.");
            console.log("\nReason:Before 20 min:Low Price:");
            console.log(String(lowPriceBefore20));
            console.log(" & Close Price:");
            console.log(String(ticks[19][4]));
            console.log("\nBefore 10 min:Low Price:");
            console.log(String(lowPriceBefore10));
            console.log(" & Close Price:");
            console.log(String(ticks[9][4]));
            console.log("\nNow:Low Price:");
            console.log(String(ticks[0][3]));
            console.log(" & Close Price:");
            console.log(String(ticks[0][4]));
            console.log("\nSo It doesn't fit to the buying strategy");
          });
        }
      },
      { limit: 20, endTime: current }
    );
  } else {
    let ticker = await binance.prices();
    let cprice = ticker.ETHUSDT;

    if (
      cprice < (price * 995) / 1000 ||
      cprice > (price * 1007) / 1000 ||
      price < (mprice * 985) / 1000
    ) {
      exportLog(logRealPath, "\n---------------------");
      exportLog(logRealPath, "\nIt is time for selling.");
      exportLog(logRealPath, "\nThe price when I was buying:");
      exportLog(logRealPath, String(price));
      exportLog(logRealPath, "\nThe present price is:");
      exportLog(logRealPath, String(cprice));

      console.log("\n---------------------");
      console.log("\nIt is time for selling.");
      console.log("\nThe price when I was buying:");
      console.log(String(price));
      console.log("\nThe present price is:");
      console.log(String(cprice));
      if(cprice < (price * 995) / 1000)
      {
        await exportLog(logRealPath, "\nIt fits to the first selling strategy.");
        console.log("\nIt fits to the first selling strategy.");
      }
      else if(cprice > (price * 1007) / 1000)
      {
        await exportLog(logRealPath, "\nIt fits to the second selling strategy.");
        console.log("\nIt fits to the second selling strategy.");
      }
      else
      {
        await exportLog(logRealPath, "\nIt fits to the third selling strategy.");
        console.log("\nIt fits to the third selling strategy.");
      }
      binance.balance(async (error, balances) => {
        if (balances.ETH !== undefined && balances.ETH.available > 0.009) {
          await exportLog(logRealPath, "\n-------Sellling-------");
          await exportLog(logRealPath, "\nBefore:ETHs balances:");
          await exportLog(logRealPath, String(balances.ETH.available));
          await exportLog(logRealPath, "\nBefore:USDTs balances:");
          await exportLog(logRealPath, String(balances.USDT.available));

          console.log("\n-------Sellling-------");
          console.log("\nBefore:ETHs balances:");
          console.log(String(balances.ETH.available));
          console.log("\nBefore:USDTs balances:");
          console.log(String(balances.USDT.available));
          try{
            let temp = Number(balances.ETH.available);
            quantity = temp.toFixed(4);
            if(quantity > temp)
            {
              quantity -= 0.0001;
              quantity = quantity.toFixed(4);
            }
            await binance.marketSell("ETHUSDT", quantity);
          } catch(e){
          }
          status = 0;
        }
      });
    } else {
      binance.balance(async (error, balances) => {
        await exportLog(logRealPath, "\n---------------------");
        await exportLog(logRealPath, "\nCurrent ETH balances:");
        await exportLog(logRealPath, String(balances.ETH.available));
        await exportLog(logRealPath, "\nCurrent USDT balances:");
        await exportLog(logRealPath, String(balances.USDT.available));
        await exportLog(logRealPath, "\nIt is not time for selling.");
        await exportLog(logRealPath, "\nThe price when I was buying:");
        await exportLog(logRealPath, String(price));
        await exportLog(logRealPath, "\nThe present price is:");
        await exportLog(logRealPath, String(cprice));
        await exportLog(logRealPath, "\nSo It doesn't fit to your selling strategy.\n");
        await exportLog(logRealPath, "\n---------------------");

        console.log("\n---------------------");
        console.log("\nCurrent ETH balances:");
        console.log(String(balances.ETH.available));
        console.log("\nCurrent USDT balances:");
        console.log(String(balances.USDT.available));
        console.log("\nIt is not time for selling.");
        console.log("\nThe price when I was buying:");
        console.log(String(price));
        console.log("\nThe present price is:");
        console.log(String(cprice));
        console.log("\nSo It doesn't fit to your selling strategy.\n");
        console.log("\n---------------------");
      });
    }
  }
};

const getHighestPrice = async () => {
  let ticker = await binance.prices();
  mprice = mprice > ticker.ETHUSDT ? mprice : ticker.ETHUSDT;
};

const main = async () => {
  binance.balance(async (error, balances) => {
    if (balances.ETH !== undefined && balances.ETH.available > 0) {
      status = 1;
    }
  });
  setInterval(trade, 60000);
  setInterval(getHighestPrice, 1000);
};
main();