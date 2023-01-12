binancebot will buy/sell ETH from/to USDT

There are two subfolders in this project
    - csv : for storing data including prices to csv files.
            csv.js includes exportCSV()function.
            csv-log folder will contain csv files that stores the prices.
    - log : records all information about this binancebot running.
            log.js includes exportLog()function.
            binance-log foler will contain log files that stores the logs of binancebot.

### About this bot
This bot is developed using node.js with binance module.(some people says that is web3.js)
The main function is "trade"

### What this bot does
Buying strategy : 1-10-10 (example 14:00 - 13:50 - 13:40).
When analyzing, Close prices are compared to Close prices, and Low prices are compared to Low prices.
- This function is implemented in trade function in 'index.js'
 every minute this bot investigates the ETH's prices.
 And then compare the prices before 10 minutes and 20 minutes each.
 Comparing : close price to close price and low price to low price.

Selling strategy : crypto price in real-time:
1. Stop loss -0.5% of the purchase price
2. Stop loss +0.7% of the purchase price
3. Stop loss floating -1.5% of the highest price since the last purchase. Applied when the selling price >= of stop loss of 2.
*A SELL occurs if the price falls TO or BELOW any of the stop losses.
- This function is implemented in trade function in 'index.js'
 every minute this bot investigates the ETH's prices.
 also sells according to your selling strategy.

### Development
Binance provides node.js module so that we can access the binance mainnet.
-----------variable-----------
- mprice
 stores the highest price temporary
- status
 represents the crypto currency types. if 1 - means:you have ETHs not USDTs, 0 - means:you have USDTs not ETHs
-----------function-----------
- main() function
 every minute calls trade function.
 every 100 milliseconds investigate prices and get the hightest price
- getHighestPrice() function
 every 100 milliseconds this function is called.
 gets the maximum price and save the price to 'mprice' value
- trade() function
 This function consists of two parts : buy&sell
 Every minute, which parts executed depends on currency types so exactly depends of status variable.
 So if status=0(that means you have only USDTs) buying parts executed.
  In this part first investigate that time is necessary for buying. if it is determined that time is necessary for buying then calculates the amount of USDTs. if you have no USDTs then buying action can not be executed. if you have USDTs then buying action is implemented.
 If status=1(that means you have only ETHs) selling parts executed.
  In this part first investigate that time is necessary for selling. According to your strategy, If it is determined that time is necessary for selling then calculates the amount of ETHs. If you have no ETHs then selling action can not be executed. If you have ETHs then selling action is implemented.
 And in two parts information of prices are stored into "<date_time>.csv"file using exportCSV() function.
 And all logs are also stored into "<date_time>.log"file using exportLog() function.
- exportCSV() function
 first converts time sections to correct parts.
 Second stores prices into csv file.
- exportLog() function
 records all logs while binancebot is running.

### Running
This binancebot is written by node.js platform.
So to run this binancebot, first runs this command to set the environment "npm install".
And then use this command to run. "npm start"

### Deployement
Bot is running on ... server
all actions are implemented manually.

### Restriction
According to the binance rule
USDTs must bigger than 10USDTs
ETHs must bigger than 0.009