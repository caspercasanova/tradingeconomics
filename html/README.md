# Trading Economics - HTML - Market Data Stream

Trading Economics provides its users with real time quotes, delayed feeds and historical data for currencies, commodities, stock indexes, share prices and bond yields. 

#

## Usage

* Set your API key and secret in the HTML file before running the sample.
* Please subscribe to a plan at https://tradingeconomics.com/api/pricing.aspx to get an API key.
* Then change the topic for the one desired

```bash
ws.send('{"topic": "subscribe", "to": "EURUSD:CUR"}');
```

* **Note:** A valid API key and secret are required to use this stream sample.

#

## Learn More

https://tradingeconomics.com/api/pricing.aspx


